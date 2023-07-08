const express = require("express");
const router = express.Router();
const { STATUS, logger, CONST, passwordPolicy, redis, s3Util } = require("ticketing-system-micro-common");
const { COMMON_ERR, VISIT_ERR } = require('../constants/ERRRORCODE');
let moment = require('moment');

const visitModel = require('../models/visit')
const visitService = require('../services/visitService')

const { validateDocuments } = require('../utility/doc.util')

router.post("/addVisit", async (req, res) => {

    try {

        const reqUser = req.plainToken;
        const visitDetails = new visitModel.Visit(req.body);

        const { error } = visitModel.validateVisit(visitDetails);

        if (error) {
            if (error.details != null && error.details != "" && error.details != "undefined")
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        visitDetails.created_by = reqUser.user_id;
        visitDetails.updated_by = reqUser.user_id;

        const data = await visitService.createVisit(visitDetails);
        return res.status(STATUS.OK).send(data);

    } catch (error) {
        console.log(error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CMNERR0000", "error":"${COMMON_ERR.CMNERR0000}"}`);
    }
});

router.post("/getVisit", async (req, res) => {
    try {
        const visit_id = req.body.visit_id ? req.body.visit_id : null;
        const visitData = await visitService.getVisit(visit_id)
        const docData = await visitService.getDocument(visit_id)
        console.log(docData);
        visitData.documents = docData
        res.send(visitData)
    } catch (error) {
        console.log("catch error", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CMNERR0000", "error":"${COMMON_ERR.CMNERR0000}"}`);
    }
});

router.post("/getAllVisits", async (req, res) => {
    try {

        const reqUserDetails = req.plainToken;
        let pageSize = req.body.pageSize ? req.body.pageSize : 0;
        let currentPage = req.body.currentPage ? req.body.currentPage : 0;
        currentPage = (currentPage == 1 || currentPage == 0) ? 0 : ((currentPage - 1) * pageSize);

        const ticket_mode = req.body.ticket_mode ? req.body.ticket_mode : null;
        const product_id = req.body.product_id ? req.body.product_id : null;

        const reqParams = {
            pageSize,
            currentPage,
            ticket_mode,
            product_id
        };

        const productData = await visitService.getTicketList(reqParams)
        res.send(productData)

    } catch (error) {
        console.log("catch error", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CMNERR0000", "error":"${COMMON_ERR.CMNERR0000}"}`);
    }
});

router.post("/addDocuments", async (req, res) => {

    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const reqUser = req.plainToken;
        const visit_id = req.body.visit_id ? req.body.visit_id : null;
        const docsArr = Array.isArray(req.files.imageFile) ? req.files.imageFile : [req.files.imageFile];
        console.log(docsArr);

        if (!visit_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "VISITERR0002", error: VISIT_ERR.VISITERR0002 });
        }

        const isValidDocuments = validateDocuments(docsArr);
        if (!isValidDocuments) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "VISITERR0001", error: VISIT_ERR.VISITERR0001 });
        }

        const isVisitIdExists = await visitService.checkVisitIdExists(visit_id);
        if (!isVisitIdExists) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "VISITERR0003", error: VISIT_ERR.VISITERR0003 });
        }

        const bucketName = process.env.TS_S3_BUCKET;
        const data = [];

        for (const [idx, doc] of docsArr.entries()) {
            const [doc_title, fileExt] = doc.name.split(".");
            const fileName = `${visit_id}_${Date.now()}_${idx}.${fileExt}`
            const filePath = `VISIT_DOCS/${visit_id}/${fileName}`
            console.log(fileExt, fileName, filePath);
            const docUploadResult = await s3Util.uploadFile(filePath, doc.data, bucketName);
            console.log(docUploadResult);
            const params = {
                visit_id,
                doc_title,
                doc_url: filePath,
                user_id: reqUser.user_id
            }
            const result = await visitService.insertDocuments(params);
            result.doc_url = docUploadResult
            result.doc_title = doc_title
            data.push(result)
        }

        return res.status(STATUS.OK).send({ message: 'Documents uploaded Successfully', data });

    } catch (error) {
        console.log(error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CMNERR0000", "error":"${COMMON_ERR.CMNERR0000}"}`);
    }
});

module.exports = router;