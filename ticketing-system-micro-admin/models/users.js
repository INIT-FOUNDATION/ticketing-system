const Joi = require("joi");
let ERRORCODE = require('../constants/ERRORCODE.js')

const User = function (users) {
    this.user_name = users.user_name;
    this.first_name = users.first_name.trim();
    this.last_name = users.last_name.trim();
    this.display_name = this.first_name.concat(" ").concat(this.last_name).trim();
    this.mobile_number = users.mobile_number;
    this.role_id = users.role_id;
    this.country_id = users.country_id ? users.country_id : 1;
    this.state_id = users.state_id ? users.state_id : null;
    this.district_id = users.district_id ? users.district_id : null;
    this.sub_district_id = users.sub_district_id ? users.sub_district_id : null;
    this.block_id = users.block_id ? users.block_id : null;
    this.village_id = users.village_id ? users.village_id : null;
    this.email_id = users.email_id ? users.email_id : null;
    this.designation = users.designation ? users.designation : null;
    this.user_module_json = users.user_module_json ? users.user_module_json : null;
};

const UpdateUser = function (users) {
    this.display_name = users.display_name;
    this.date_modified = new Date();
    this.date_of_birth = users.date_of_birth;
    this.gender = users.gender;
    this.updated_by = users.updated_by;
    this.email_id = users.email_id;
};

function validateUpdateUsers(user) {
    const pattern = /^[0-9]{10}$/;
    const pattern1 = /^([^0-9]*){1,50}$/;
    const userPattern = /^([ A-Za-z.\-()]){2,30}$/
    const schema = {
        display_name: Joi.string()
            .strict()
            .trim()
            .regex(userPattern)
            .error(
                new Error(`{"errorCode":"ADMROL0001", "error":"${ERRORCODE.ERROR.ADMROL0001}"}`)
            ),
        gender: Joi.number().allow("", null),
        date_of_birth: Joi.date().allow("", null),
        date_modified: Joi.date(),
        updated_by: Joi.number(),
        email_id: Joi.string().email()
    };

    return Joi.validate(user, schema);
}


function validateUsers(user) {
    const userPattern = /^([ A-Za-z.\-()]){2,30}$/
    const schema = {
        user_name: Joi.string(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        display_name: Joi.string()
            .strict()
            .trim()
            .regex(userPattern)
            .error(
                new Error(`{"errorCode":"ADMROL0013", "error":"${ERRORCODE.ERROR.ADMROL0013}"}`)
            ),
        mobile_number: Joi.number()
            .error(
                new Error(`{"errorCode":"ADMROL0014", "error":"${ERRORCODE.ERROR.ADMROL0014}"}`)
            )
            .required(),
        role_id: Joi.string()
            .error(
                new Error(`{"errorCode":"ADMROL0012", "error":"${ERRORCODE.ERROR.ADMROL0012}"}`)
            )
            .required(),
        created_by: Joi.number(),
        country_id: Joi.number().empty('').allow(null),
        state_id: Joi.number().empty('').allow(null),
        district_id: Joi.number().empty('').allow(null),
        sub_district_id: Joi.number().empty('').allow(null),
        block_id: Joi.number().empty('').allow(null),
        village_id: Joi.number().empty('').allow(null),
        email_id: Joi.string().email().allow(null, ""),
        designation: Joi.string().empty('').allow(null),
        user_module_json: Joi.array().allow(null)
    };

    return Joi.validate(user, schema);
}

const EditUser = function (users) {
    this.user_id = users.user_id;
    this.first_name = users.first_name.trim();
    this.last_name = users.last_name.trim();
    this.display_name = this.first_name.concat(" ").concat(this.last_name).trim();
    this.is_active = users.is_active;
    this.email_id = users.email_id;
    this.designation = users.designation;
};


function validateEditUsers(user) {
    const userPattern = /^([ A-Za-z.\-()]){2,30}$/
    const schema = {
        user_id: Joi.number().required(),
        first_name: Joi.string(),
        last_name: Joi.string(),
        display_name: Joi.string()
            .strict()
            .trim()
            .regex(userPattern)
            .error(
                new Error(`{"errorCode":"ADMROL0001", "error":"${ERRORCODE.ERROR.ADMROL0003}"}`)
            ),
        is_active: Joi.number()
            .min(0)
            .max(255)
            .error(
                new Error(`{"errorCode":"ADMROL0011", "error":"${ERRORCODE.ERROR.ADMROL0011}"}`)
            ),
        email_id: Joi.string().email(),
        designation: Joi.string().empty('').allow(null)
    };

    return Joi.validate(user, schema);
}

module.exports = User;
module.exports.UpdateUser = UpdateUser;
module.exports.validateUpdateUsers = validateUpdateUsers;
module.exports.validate = validateUsers;
module.exports.EditUser = EditUser;
module.exports.validateEditUsers = validateEditUsers;
//module.exports.createPasswordPolicySchema = createPasswordPolicySchema;
//module.exports.UpdatePasswordPolicySchema = UpdatePasswordPolicySchema;
//module.exports.AddDepartment = AddDepartment;
//module.exports.validateAddDepartment = validateAddDepartment;

module.exports = User;