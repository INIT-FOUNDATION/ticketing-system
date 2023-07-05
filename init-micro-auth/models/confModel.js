const Joi = require("joi");

const validateConf = (data) => {
    const schema = {
        type: Joi.string().valid(['GOVT', 'PVT']),
        user_name: Joi.string().required()
    };
    return Joi.validate(data, schema);
}

module.exports = {
    validateConf
}