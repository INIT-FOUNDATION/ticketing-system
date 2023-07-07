const Joi = require("joi");
const ERRORCODE = require('../constants/ERRRORCODE');
const moment = require('moment');

const Visit = function (visitData) {
    this.ticket_id = visitData.ticket_id ? visitData.ticket_id : null 
    this.visit_type = visitData.visit_type ? visitData.visit_type : null;
    this.visit_date = visitData.visit_date ? visitData.visit_date : null;
    this.visit_by = visitData.visit_by ? visitData.visit_by : null;
    this.remarks = visitData.remarks ? visitData.remarks : null;
    this.status = visitData.status ? visitData.status : 1;
};

const validateVisit = (visitData) => {
    const schema = {
        ticket_id: Joi.number().required(),
        visit_type: Joi.number().required(),
        visit_date: Joi.date().required(),
        visit_by: Joi.string().allow("", null),
        remarks: Joi.string().allow("", null),
        status: Joi.number().required(),
        updated_by: Joi.number(),
    };
    return Joi.validate(visitData, schema);
}

const UpdateVisit = function (visitData) {
    this.visit_id = visitData.visit_id ? visitData.visit_id : null;
    this.visit_type = visitData.visit_type ? visitData.visit_type : null;
    this.visit_date = visitData.visit_date ? visitData.visit_date : null;
    this.visit_by = visitData.visit_by ? visitData.visit_by : null;
    this.remarks = visitData.remarks ? visitData.remarks : null;
    this.status = visitData.status ? visitData.status : null;
};

const validateUpdateVisit = (visitData) => {
    const schema = {
        visit_type: Joi.number().required(),
        visit_date: Joi.date().allow("", null),
        visit_by: Joi.string().allow("", null),
        remarks: Joi.string().allow("", null),
        status: Joi.number().allow("", null),
        updated_by: Joi.number(),
    };
    return Joi.validate(visitData, schema);
}

module.exports = {
    Visit,
    validateVisit,
    UpdateVisit,
    validateUpdateVisit
}