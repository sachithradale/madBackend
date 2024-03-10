const bcrypt = require('bcrypt');
const User = require('../database/models/user');
const schemaValidation = require('../validation/user');
const validate = require('../utils/validate');
const utils = require('../utils');
const userUtils = require('../utils/user');

const salt = bcrypt.genSaltSync(10);

// TODO: get company details add auth to update change password and remove

module.exports = {
    get: async (req, res) => {
        try {
            let body = req.body;
            let params = req.params;

            /* validate request data */
            const validation = validate(schemaValidation.get, params);
            if (validation?.error) return res.status(400).json(validation.error);

            const user = await User.findOne({ _id: utils.mongoID(params.id) }, { password: false });

            if (!user) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'user not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: user
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    all: async (req, res) => {
        try {
            let query = req.query;

            /* validate request data */
            const validation = validate(schemaValidation.search, query);
            if (validation?.error) return res.status(400).json(validation.error);

            const users = await User.find({ role: userUtils.roles.APPLICANT }, { password: false });

            return res.status(200).json({
                status: 'success',
                data: users
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    all_employers: async (req, res) => {
        try {
            let query = req.query;

            /* validate request data */
            const validation = validate(schemaValidation.search, query);
            if (validation?.error) return res.status(400).json(validation.error);

            const users = await User.find({ role: userUtils.roles.EMPLOYER }, { password: false });

            return res.status(200).json({
                status: 'success',
                data: users
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    update: async (req, res) => {
        try {
            let body = req.body;
            let params = req.params;

            /* validate request data */
            const validation = validate(schemaValidation.update, body);
            if (validation?.error) return res.status(400).json(validation.error);

            if (body.email) {
                const exist = await User.findOne(
                    { email: body.email },
                    { password: false }
                );

                if (exist && exist?._id.toString() !== params.id) {
                    return res.status(404).json({
                        status: 'failed',
                        message: 'email already exists'
                    });
                }
            }

            const user = await User.findOne(
                { _id: utils.mongoID(params.id) },
                { password: false }
            );

            if (!user) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'user not found'
                });
            }

            // check if user is the same as the one updating
            const tokenDataArray = req.tokenData;
            if (user._id.toString() !== tokenDataArray.user_id) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'unauthorized'
                });
            }

            // only update the profile fields
            for (const key in body) {
                user.profile[key] = body[key];
            }

            await user.save();

            return res.status(200).json({
                status: 'success',
                message: 'user details updated'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    update_image: async (req, res) => {
        try {
            let body = req.body;
            let params = req.params;

            /* validate request data */
            const validation = validate(schemaValidation.update_image, body);
            if (validation?.error) return res.status(400).json(validation.error);

            const user = await User.findOne({ _id: utils.mongoID(params.id) }, { password: false });

            if (!user) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'user not found'
                });
            }

            // check if user is the same as the one updating
            const tokenDataArray = req.tokenData;
            if (user._id.toString() !== tokenDataArray.user_id) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'unauthorized'
                });
            }

            user.profile.image = body.image;

            await user.save();

            return res.status(200).json({
                status: 'success',
                message: 'user image updated'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    add_work_experience: async (req, res) => {
        try {
            let body = req.body;
            let params = req.params;

            /* validate request data */
            const validation = validate(schemaValidation.add_work_experience, body);
            if (validation?.error) return res.status(400).json(validation.error);

            const user = await User.findOne({ _id: utils.mongoID(params.id), role: userUtils.roles.APPLICANT }, { password: false });

            if (!user) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'user not found'
                });
            }

            // check if user is the same as the one updating
            const tokenDataArray = req.tokenData;
            if (user._id.toString() !== tokenDataArray.user_id) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'unauthorized'
                });
            }

            user.profile.workExperience.push(body);

            await user.save();

            return res.status(200).json({
                status: 'success',
                message: 'work experience added'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    search_employers: async (req, res) => {
        try {
            let query = req.query;

            /* validate request data */
            const validation = validate(schemaValidation.search, query);
            if (validation?.error) return res.status(400).json(validation.error);

            const users = await User.find({
                role: userUtils.roles.EMPLOYER, 'profile.companyName': { $regex: query.search, $options: 'i' }
            }, { password: false }).limit(query.limit);

            return res.status(200).json({
                status: 'success',
                data: users
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    change_password: async (req, res) => {
        try {
            let body = req.body;
            let params = req.params;

            /* validate request data */
            const validation = validate(schemaValidation.change_password, body);
            if (validation?.error) return res.status(400).json(validation.error);

            const user = await User.findOne({ _id: utils.mongoID(params.id) }, { password: false });

            if (!user) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'user not found'
                });
            }

            // check if user is the same as the one updating
            const tokenDataArray = req.tokenData;
            if (user._id.toString() !== tokenDataArray.user_id) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'unauthorized'
                });
            }

            user.password = bcrypt.hashSync(body.password, salt);

            await user.save();

            return res.status(200).json({
                status: 'success',
                message: 'user password changed'
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    remove: async (req, res) => {
        try {
            let body = req.body;
            let params = req.params;

            /* validate request data */
            const validation = validate(schemaValidation.remove, params);
            if (validation?.error) return res.status(400).json(validation.error);

            const user = await User.findOne({ _id: params.id, role: userUtils.roles.APPLICANT });

            if (!user) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'user not found'
                });
            }

            await user.deleteOne();

            return res.status(200).json({
                status: 'success',
                message: 'user deleted'
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
