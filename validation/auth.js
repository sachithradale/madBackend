const Joi = require('joi');
const userUtils = require('../utils/user')

module.exports = {
    signin: Joi.object().keys({
        email: Joi.string()
            .regex(/^\S+@\S+\.\S+$/)
            .required(),
        password: Joi.string().required()
    }),
    change_password: Joi.object().keys({
        email: Joi.string()
            .regex(/^\S+@\S+\.\S+$/)
            .required(),
        password: Joi.string().required(),
        confirm_password: Joi.any()
            .equal(Joi.ref('password'))
            .label('confirm password')
            .messages({ 'any.only': '{{#label}} does not match' })
            .required()
    }),
    signup: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string()
            .regex(/^\S+@\S+\.\S+$/)
            .required(),
        password: Joi.string().required(),
        confirm_password: Joi.any()
            .equal(Joi.ref('password'))
            .label('confirm password')
            .messages({ 'any.only': '{{#label}} does not match' })
            .required(),
        role: Joi.string()
            .valid(...Object.values(userUtils.roles))
            .required()
    })
};
