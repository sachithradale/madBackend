const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/models/user');
const schemaValidation = require('../validation/auth');
const crypt = require('../utils/crypt');
const validate = require('../utils/validate');
const config = require('../config');
const userUtils = require('../utils/user');

const salt = bcrypt.genSaltSync(10);

// TODO: Complete signup

module.exports = {
    signup: async (req, res) => {
        console.log(req.body);
        try {
            let body = req.body;

            /* validate request data */
            const validation = validate(schemaValidation.signup, body);
            if (validation?.error) return res.status(400).json(validation.error);

            const exist = await User.findOne({ email: body.email });

            if (exist) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'user with the email already exist'
                });
            }

            // if role is not set or empty set it to APPLICANT
            if (!body.role) body.role = userUtils.roles.APPLICANT;

            const user = new User({
                email: body.email,
                password: bcrypt.hashSync(body.password, salt),
                role: body.role,
                profile: {
                    name: body.name
                }
            });

            await user.save();

            // if signup is successful log the user in
            let token = jwt.sign(
                { user_id: user._id, email: user.email, role: user.role },
                config.encryption.hash,
                { expiresIn: '2d' }
            );

            let encrypted_token = crypt.encrypt(token);
            let mobile_token = encrypted_token.iv + ',' + encrypted_token.content;

            return res.status(200).json({
                status: 'success',
                message: 'user signup successful',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: mobile_token
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    signin: async (req, res) => {
        try {
            let body = req.body;

            /* validate request data */
            const validation = validate(schemaValidation.signin, body);
            if (validation?.error) return res.status(400).json(validation.error);

            const user = await User.findOne({ email: body.email });

            if (!user) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'user not found'
                });
            }

            if (!bcrypt.compareSync(body.password, user.password)) {
                return res.status(400).json({
                    status: 'failed',
                    message: 'incorrect password'
                });
            }

            // generate a token for 2 Days
            // edit this if you want to increase the session time
            let token = jwt.sign(
                { user_id: user._id, email: user.email, role: user.role },
                config.encryption.hash,
                {
                    expiresIn: '2d'
                }
            );

            // encrypt token
            let encrypted_token = crypt.encrypt(token);

            // return {
            //     iv: iv.toString('hex'),
            //     content: encrypted.toString('hex')
            // };

            let mobile_token = encrypted_token.iv + ',' + encrypted_token.content;
            // console.log(mobile_token);

            // to pass the tokens through cookies uncomment the following lines 
            // res.cookie('session', encrypted_token, {
            //     maxAge: 3 * 30 * 24 * 60 * 60 * 1000, // 3 months
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'none'
            // });

            return res.status(200).json({
                status: 'success',
                message: 'user signup successful',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                    token: mobile_token
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    signout: async (req, res) => {
        try {
            // signout is possible if cookie auth is used only
            res.cookie('session', '', { httpOnly: true });

            return res.status(200).json({
                status: 'success',
                message: 'user signed out'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    isEmployer: async (req, res) => {
        // check in jwt
        try {
            return res.status(200).json({
                status: 'success',
                message: req.cookies.auth_user
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    }
};
