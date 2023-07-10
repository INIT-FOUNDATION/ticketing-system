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

        // if (!req.files || Object.keys(req.files).length === 0) {
        //     return res.status(STATUS.BAD_REQUEST).send({ errorCode: "VISITERR0004", error: VISIT_ERR.VISITERR0004 });
        // }

        const docsArr = Array.isArray(req.files.doc_files) ? req.files.doc_files : [req.files.doc_files];
        const isValidDocuments = validateDocuments(docsArr);
        if (!isValidDocuments) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "VISITERR0001", error: VISIT_ERR.VISITERR0001 });
        }


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
        const visit_id = data[0].visit_id;

        const bucketName = process.env.TS_S3_BUCKET;
        const docData = [];

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
            docData.push(result)
        }

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

        const ticket_id = req.body.ticket_id ? req.body.ticket_id : null;
        const visits = await visitService.getAllVisits(ticket_id)

        
        res.send(visits)

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


router.post('/downloadDocument', async (req, res) => {
    try {

        const visit_doc_id = req.body.visit_doc_id;
        if (!visit_doc_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "VISITERR0005", error: VISIT_ERR.VISITERR0005 });
        }

        const docDetails = await visitService.getDocumentDetails(visit_doc_id);

        if (!docDetails) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "VISITERR0006", error: VISIT_ERR.VISITERR0006 });
        }

        const options = {
            Bucket: process.env.TS_S3_BUCKET,
            Key: docDetails.doc_url
        };

        const [filePath, fileExt] = docDetails.doc_url.split(".");
        const fileName = filePath.split('/')[2]
        console.log(fileName, fileExt);
        res.setHeader("Content-Type", "image/" + fileExt);
        res.setHeader("Content-disposition", "filename=" + fileName);
        s3.getObject(options).createReadStream()
            .on("error", function (err) {
                res.status(500).json({ error: "Error -> " + err });
            })
            .pipe(res);
    } catch (error) {
        console.log(error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CMNERR0000", "error":"${COMMON_ERR.CMNERR0000}"}`);
    }
})


module.exports = router;