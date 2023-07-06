const Joi = require("joi");
let ERRORCODE = require('../constants/ERRORCODE.js')

const User = function (users) {
    this.user_name = users.user_name;
    this.first_name = users.first_name.trim();
    this.last_name = users.last_name.trim();
    this.display_name = this.first_name.concat(" ").concat(this.last_name).trim();
    this.mobile_number = users.mobile_number;
    this.role_id = users.role_id;
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


const createPasswordPolicySchema = function (policy) {
    this.password_expiry = policy.password_expiry;
    this.password_history = policy.password_history;
    this.min_password_length = policy.min_password_length;
    this.complexity = policy.complexity;
    this.alphabetical = policy.alphabetical;
    this.numeric = policy.numeric;
    this.special_chars = policy.special_chars;
    this.allowed_special_chars = policy.allowed_special_chars;
    this.max_invalid_attempts = policy.max_invalid_attempts;
}

const UpdatePasswordPolicySchema = function (policy) {
    this.password_expiry = policy.password_expiry ? parseInt(policy.password_expiry) : 0;
    this.password_history = policy.password_history ? parseInt(policy.password_history) : 0;
    this.min_password_length = policy.min_password_length ? parseInt(policy.min_password_length) : 0;
    this.complexity = policy.complexity ? parseInt(policy.complexity) : 0;
    this.alphabetical = policy.alphabetical ? parseInt(policy.alphabetical) : 0;
    this.numeric = policy.numeric ? parseInt(policy.numeric) : 0;
    this.special_chars = policy.special_chars ? parseInt(policy.special_chars) : 0;
    this.allowed_special_chars = policy.allowed_special_chars;
    this.max_invalid_attempts = policy.max_invalid_attempts ? parseInt(policy.max_invalid_attempts) : 0;
    this.date_modified = new Date();
};


function validatePasswordPolicy(policy) {

    const schema = {
        password_expiry: Joi.number()
            .min(0)
            .max(365)
            .required(),
        password_history: Joi.number()
            .min(0)
            .max(3)
            .required(),
        min_password_length: Joi.number()
            .min(6)
            .max(20)
            .required(),
        complexity: Joi.number()
            .min(0)
            .max(1)
            .required(),
        alphabetical: Joi.number()
            .min(0)
            .max(1),
        numeric: Joi.number()
            .min(0)
            .max(1),
        special_chars: Joi.number()
            .min(0)
            .max(1),
        allowed_special_chars: Joi.string(),
        max_invalid_attempts: Joi.number()
            .min(0)
            .max(99),
        date_created: Joi.date(),
        date_modified: Joi.date()
    };

    return Joi.validate(policy, schema);
}


module.exports = User;
module.exports.UpdateUser = UpdateUser;
module.exports.validateUpdateUsers = validateUpdateUsers;
module.exports.validate = validateUsers;
module.exports.EditUser = EditUser;
module.exports.validateEditUsers = validateEditUsers;
module.exports.createPasswordPolicySchema = createPasswordPolicySchema;
module.exports.UpdatePasswordPolicySchema = UpdatePasswordPolicySchema;
module.exports.validatePasswordPolicy = validatePasswordPolicy;
//module.exports.validateAddDepartment = validateAddDepartment;

module.exports = User;