const Joi = require('joi');
const userUtils = require('../utils/user');

module.exports = {
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
            .allow('', null)
    }),
    signin: Joi.object().keys({
        email: Joi.string()
            .regex(/^\S+@\S+\.\S+$/)
            .required(),
        password: Joi.string().required()
    }),
    request_reset: Joi.object().keys({
        email: Joi.string()
            .regex(/^\S+@\S+\.\S+$/)
            .required()
    }),
    reset_password: Joi.object().keys({
        otp: Joi.number().integer().required(),
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
    change_password: Joi.object().keys({
        password: Joi.string().required(),
        confirm_password: Joi.any()
            .equal(Joi.ref('password'))
            .label('confirm password')
            .messages({ 'any.only': '{{#label}} does not match' })
            .required()
    }),
    update: Joi.object().keys({
        name: Joi.string(),
        dob: Joi.date(),
        contact: Joi.string(),
        socialLinks: Joi.array().items(Joi.string()),
        skills: Joi.array().items(Joi.string()),
        qualifications: Joi.array().items(Joi.object().keys({
            qualification: Joi.string().required(),
            date: Joi.date().required(),
            description: Joi.string().required()
        })),
        workExperience: Joi.array().items(Joi.object().keys({
            position: Joi.string().required(),
            company: Joi.string().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
            isCurrent: Joi.boolean().required(),
            description: Joi.string().required()
        })),
        education: Joi.array().items(Joi.object().keys({
            institution: Joi.string().required(),
            degree: Joi.string().required(),
            field: Joi.string().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
            description: Joi.string().required()
        })),
        companyName: Joi.string(),
        industry: Joi.string()
    }),
    update_image: Joi.object().keys({
        image: Joi.string().required()
    }),
    add_work_experience: Joi.object().keys({
        position: Joi.string().required(),
        company: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        isCurrent: Joi.boolean().required(),
        description: Joi.string().required()
    }),
    get: Joi.object().keys({
        id: Joi.string().required()
    }),
    remove: Joi.object().keys({
        id: Joi.string().required()
    }),
    search: Joi.object().keys({
        search: Joi.string().allow('', null),
        limit: Joi.number().integer().min(1).allow('', null)
    })
};
