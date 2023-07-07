const express = require("express");
const router = express.Router();
const { STATUS, logger, CONST, passwordPolicy, redis, SMS } = require("ticketing-system-micro-common");
const { COMMON_ERR } = require('../constants/ERRRORCODE');
let moment = require('moment');

const visitModel = require('../models/visit')
const visitService = require('../services/visitService')


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


module.exports = router;