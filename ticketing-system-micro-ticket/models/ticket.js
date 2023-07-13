const Joi = require("joi");
const ERRORCODE = require('../constants/ERRRORCODE');
const moment = require('moment');

const CreateTicket = function (ticketData) {
    this.ticket_number = ticketData.ticket_number ? ticketData.ticket_number : null;
    this.ticket_mode = ticketData.ticket_mode ? ticketData.ticket_mode : null;
    this.product_id = ticketData.product_id ? ticketData.product_id : null;
    this.description = ticketData.description ? ticketData.description : null;
    this.opening_date = ticketData.opening_date ? ticketData.opening_date : null;
    this.closing_date = ticketData.closing_date ? ticketData.closing_date : null;
    this.remarks = ticketData.remarks ? ticketData.remarks : null;
    this.status = ticketData.status ? ticketData.status : 1;
};

const validateCreateTicket = (ticketData) => {
    const schema = {
        ticket_number: Joi.number().required(),
        ticket_mode: Joi.number().required(),
        product_id: Joi.number().required(),
        description: Joi.string(),
        opening_date: Joi.date().allow("", null),
        closing_date: Joi.date().allow("", null),
        updated_by: Joi.number(),
        remarks: Joi.string().allow("", null),
        status: Joi.number().allow(null)
    };
    return Joi.validate(ticketData, schema);
}

const UpdateTicket = function (ticketData) {
    this.ticket_id = ticketData.ticket_id ? ticketData.ticket_id : null;
    this.description = ticketData.description ? ticketData.description : null;
    this.opening_date = ticketData.opening_date ? ticketData.opening_date : null;
    this.closing_date = ticketData.closing_date ? ticketData.closing_date : null;
    this.remarks = ticketData.remarks ? ticketData.remarks : null;
    this.status = ticketData.status ? parseInt(ticketData.status) : null;

    this.status = this.closing_date ? 3 : this.status;
};

const validateUpdateTicket = (ticketData) => {
    const schema = {
        ticket_id: Joi.number().required(),
        description: Joi.string().allow("", null),
        opening_date: Joi.date().allow("", null),
        closing_date: Joi.date().allow("", null),
        remarks: Joi.string().allow("", null),
        status: Joi.number().allow("", null),
        updated_by: Joi.number()
    };
    return Joi.validate(ticketData, schema);
}

module.exports = {
    CreateTicket,
    validateCreateTicket,
    UpdateTicket,
    validateUpdateTicket
}