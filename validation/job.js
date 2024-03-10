const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        requirements: Joi.array().items(Joi.string()).required(),
        responsibilities: Joi.array().items(Joi.string()).required(),
        location: Joi.string().required(),
        salaryRange: Joi.object().keys({
            low: Joi.number().required(),
            high: Joi.number().required(),
            currency: Joi.string()
        }),
        employer: Joi.string(),
        applications: Joi.array().items(Joi.string())
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
    }),
    // filter search
    filter: Joi.object().keys({
        title: Joi.string().allow('', null),
        location: Joi.string().allow('', null),
        salaryRange: Joi.object().keys({
            low: Joi.number().allow('', null),
            high: Joi.number().allow('', null),
            currency: Joi.string().allow('', null)
        }),
        requirements: Joi.array().items(Joi.string()).allow('', null),
        responsibilities: Joi.array().items(Joi.string()).allow('', null),
        employer: Joi.string().allow('', null),
        limit: Joi.number().integer().min(1).allow('', null)
    }),
    update: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        requirements: Joi.array().items(Joi.string()).required(),
        responsibilities: Joi.array().items(Joi.string()).required(),
        location: Joi.string().required(),
        salaryRange: Joi.object().keys({
            low: Joi.number().required(),
            high: Joi.number().required(),
            currency: Joi.string()
        }),
        employer: Joi.string().required(),
        applications: Joi.array().items(Joi.string())
    })
};