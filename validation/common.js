const Joi = require('joi');

module.exports = {
    get: Joi.object().keys({
        id: Joi.string().required()
    }),
    all: Joi.object().keys({
        search: Joi.string().allow('', null),
        limit: Joi.number().integer().min(1).allow('', null)
    }),
    random: Joi.object().keys({
        search: Joi.string().allow('', null),
        limit: Joi.number().integer().min(1).required()
    })
};
