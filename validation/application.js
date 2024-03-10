const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        job: Joi.string().required(),
        applicant: Joi.string().required(),
        resume: Joi.string().required(),
        description: Joi.string().allow('', null),
        status: Joi.string().valid('pending', 'accepted', 'rejected').required()
    }),
    get: Joi.object().keys({
        id: Joi.string().required()
    }),
    search: Joi.object().keys({
        search: Joi.string().allow('', null),
        limit: Joi.number().integer().min(1).allow('', null)
    }),
    remove: Joi.object().keys({
        id: Joi.string().required()
    }),
    state: Joi.object().keys({
        status: Joi.string().valid('pending', 'accepted', 'rejected').required()
    }),
    update: Joi.object().keys({
        job: Joi.string().required(),
        applicant: Joi.string().required(),
        resume: Joi.string().required(),
        description: Joi.string().allow('', null),
        status: Joi.string().valid('pending', 'accepted', 'rejected').required()
    })
};