const validate = (schema, body) => {
    const validation_result = schema.validate(body);
    if (validation_result.error) {
        var error_message = validation_result.error.details[0].message.replace(/"/g, '');
        return {
            error: {
                code: 400,
                status: 'failed',
                message: error_message
            }
        };
    }

    return null;
};

module.exports = validate;
