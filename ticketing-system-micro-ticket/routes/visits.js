const express = require("express");
const router = express.Router();
const { STATUS, logger, CONST, passwordPolicy, redis, SMS } = require("ticketing-system-micro-common");

const bcrypt = require("bcryptjs");
const { COMMON_ERR } = require('../constants/ERRRORCODE');
let userService = require('../services/userService');
let moment = require('moment');

const ticketModel = require('../models/ticket')
const ticketService = require('../services/ticketService')


router.post("/addVisits", async (req, res) => {

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

        const ticketData = await ticketService.getTicket(ticket_id)
        res.send(ticketData)

    } catch (error) {
        console.log("catch error", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).send(`{"errorCode":"CMNERR0000", "error":"${COMMON_ERR.CMNERR0000}"}`);
    }
});

module.exports = router;