const Joi = require("joi");

const validateLoginDetails = (user) => {
    const pattern = /^[0-9]{10}$/;
    const schema = {
        user_name: Joi.string()
            .trim()
            .regex(pattern)
            .required(),
        password: Joi.string().required()
    };
    return Joi.validate(user, schema);
}

module.exports = {
    validateLoginDetails
}