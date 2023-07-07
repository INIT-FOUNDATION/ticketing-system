const Joi = require("joi");
let ERRORCODE = require('../constants/ERRRORCODE')
const datetime = new Date()
let moment = require('moment');

const UpdateUser = function (users) {
    this.first_name = users.first_name.trim();
    this.last_name = users.last_name.trim();
    this.display_name = this.first_name.concat(" ").concat(this.last_name).trim();
    this.date_modified = datetime.toISOString().slice(0,30);
    this.date_of_birth = users.date_of_birth;
    this.gender = users.gender;
    this.zip_code = users.zip_code;
    this.updated_by = users.updated_by;
    this.email_id = users.email_id;
};

function validateUpdateUsers(user) {
    const pattern = /^[0-9]{10}$/;
    const pattern1 = /^([^0-9]*){1,50}$/;
    const userPattern = /^([ A-Za-z.\-()]){2,30}$/
    const schema = {
        first_name: Joi.string(),
        last_name: Joi.string(),
        display_name: Joi.string()
            .strict()
            .trim()
            .regex(userPattern)
            .error(
                new Error(`{"errorCode":"ADMROL0001", "error":"${ERRORCODE.ERROR.ADMROL0001}"}`)
            ),
        gender: Joi.number().allow("", null),
        zip_code: Joi.string(),
        date_of_birth: Joi.date().allow("", null),
        date_modified: Joi.date(),
        updated_by: Joi.number(),
        email_id: Joi.string().allow("", null)
    };

    return Joi.validate(user, schema);
}

module.exports.UpdateUser = UpdateUser;
module.exports.validateUpdateUsers = validateUpdateUsers;