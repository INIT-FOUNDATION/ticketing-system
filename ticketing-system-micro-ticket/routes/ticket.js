const express = require("express");
const router = express.Router();
const fileUpload = require('express-fileupload')
const moment = require('moment');

const { STATUS, logger, CONST, redis, SMS, s3Util } = require("ticketing-system-micro-common");
const { COMMON_ERR, TICKET_ERR } = require('../constants/ERRRORCODE');

const ticketModel = require('../models/ticket')
const ticketService = require('../services/ticketService')

const { validateDocuments } = require('../utility/doc.util')

router.use(fileUpload());

router.get('/health', async (req, res) => {
    try {
        return res.status(STATUS.OK).send("Ticket Service is Healthy");
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send();
    }
});

router.post("/createTicket", async (req, res) => {

    try {

        const reqUser = req.plainToken;
        req.body.ticket_number = await ticketService.generateTicketNumber();
        const ticketDetails = new ticketModel.CreateTicket(req.body);

        const { error } = ticketModel.validateCreateTicket(ticketDetails);

        if (error) {
            if (error.details != null && error.details != "" && error.details != "undefined")
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }

        ticketDetails.created_by = reqUser.user_id;
        ticketDetails.updated_by = reqUser.user_id;

        const data = await ticketService.createTicket(ticketDetails);
        return res.status(STATUS.OK).send(data);

    } catch (error) {
        console.log(error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CMNERR0000", "error":"${COMMON_ERR.CMNERR0000}"}`);
    }
});

router.post('/updateTicket', async (req, res) => {
    try {
        const reqUser = req.plainToken;
        const ticketDetails = new ticketModel.UpdateTicket(req.body);
        ticketDetails.updated_by = reqUser.user_id;

        const { error } = ticketModel.validateUpdateTicket(ticketDetails);

        if (error) {
            if (error.details != null && error.details != "" && error.details != "undefined")
                return res.status(STATUS.BAD_REQUEST).send(error.details[0].message);
            else return res.status(STATUS.BAD_REQUEST).send(error.message);
        }
        const data = await ticketService.updateTicket(ticketDetails);
        const response = {
            message : 'Ticket updated successfully'
        }
        return res.status(STATUS.OK).send(response);
        
    } catch (error) {
        console.log(error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CMNERR0000", "error":"${COMMON_ERR.CMNERR0000}"}`);
    }
})

router.post("/getTicketList", async (req, res) => {
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

        const productData = await ticketService.getTicketList(reqParams)
        res.send(productData)

    } catch (error) {
        console.log("catch error", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CMNERR0000", "error":"${COMMON_ERR.CMNERR0000}"}`);
    }
});

router.post("/getTicket", async (req, res) => {
    try {

        const ticket_id = req.body.ticket_id ? req.body.ticket_id : null;

        let ticketData = await ticketService.getTicket(ticket_id)
        const docData = await ticketService.getDocument(ticket_id)
        console.log(docData);
        ticketData.documents = docData
        res.send(ticketData)

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
        const ticket_id = req.body.ticket_id ? req.body.ticket_id : null;
        const docsArr = Array.isArray(req.files.imageFile) ? req.files.imageFile : [req.files.imageFile];
        console.log(docsArr);

        if (!ticket_id) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "TCKTERR0002", error: TICKET_ERR.TCKTERR0002 });
        }

        const isValidDocuments = validateDocuments(docsArr);
        if (!isValidDocuments) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "TCKTERR0001", error: TICKET_ERR.TCKTERR0001 });
        }

        const isTicketIdExists = await ticketService.checkTicketIdExists(ticket_id);
        if (!isTicketIdExists) {
            return res.status(STATUS.BAD_REQUEST).send({ errorCode: "TCKTERR0003", error: TICKET_ERR.TCKTERR0003 });
        }

        const bucketName = process.env.TS_S3_BUCKET;
        const data = [];

        for (const [idx, doc] of docsArr.entries()) {
            const [doc_title, fileExt] = doc.name.split(".");
            const fileName = `${ticket_id}_${Date.now()}_${idx}.${fileExt}`
            const filePath = `TICKET_DOCS/${ticket_id}/${fileName}`
            console.log(fileExt, fileName, filePath);
            const docUploadResult = await s3Util.uploadFile(filePath, doc.data, bucketName);
            console.log(docUploadResult);
            const params = {
                ticket_id,
                doc_title,
                doc_url: filePath,
                user_id: reqUser.user_id
            }
            console.log(params);
            const result = await ticketService.insertDocuments(params);
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