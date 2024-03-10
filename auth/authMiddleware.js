const jwt = require('jsonwebtoken');
const config = require('../config');
const crypt = require('../utils/crypt');

function getTokenData(token) {
    try {
        const decodedData = jwt.verify(token, config.encryption.hash);
        return decodedData;
    } catch (error) {
        console.error('Error decoding token:', error.message);
        return null;
    }
}

function authenticateToken(req, res, next) {
    try {
        let access_token = req.headers['x-access-token'];

        access_token = access_token.split(',');
        access_token = {
            iv: access_token[0],
            content: access_token[1]
        };

        if (!access_token) {
            return res.status(401).json({
                status: 'failed',
                message: 'auth failed, please login'
            });
        }

        if (access_token) {
            let token = crypt.decrypt(access_token);

            jwt.verify(token, config.encryption.hash, (error, user) => {
                if (error) {
                    return res.status(401).json({
                        status: 'failed',
                        message: 'session has expired please login',
                        error: error
                    });
                }

                // get the user data from the token
                let tokenData = getTokenData(token);
                req.tokenData = tokenData;

                next();
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: 'failed',
            message: 'auth failed'
        });
    }
}

module.exports = {
    authenticateToken,
    getTokenData
};
