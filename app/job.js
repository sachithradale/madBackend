const Job = require('../database/models/job');
const Application = require('../database/models/application');
const schemaValidation = require('../validation/job');
const commonValidation = require('../validation/common');
const validate = require('../utils/validate');
const utils = require('../utils');

/* 
TODO: 
    create
    get
    random
    search
    all
    remove
    update
*/


module.exports = {
    create: async (req, res) => {
        try {
            let body = req.body;

            /* validate request data */
            const validation = validate(schemaValidation.create, body);
            if (validation?.error) return res.status(400).json(validation.error);

            // if currency is not provided, defaults to USD

            const tokenData = req.tokenData;            
            const job = new Job({
                title: body.title,
                description: body.description,
                requirements: body.requirements,
                responsibilities: body.responsibilities,
                location: body.location,
                salaryRange: body.salaryRange,
                employer: req.tokenData.user_id
            });

            await job.save();

            return res.status(200).json({
                status: 'success',
                message: 'job created'
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    get: async (req, res) => {
        try {
            let body = req.body;
            let params = req.params;

            /* validate request data */
            const validation = validate(schemaValidation.get, params);
            if (validation?.error) return res.status(400).json(validation.error);

            const job = await Job.findOne({ _id: utils.mongoID(params.id) }).populate('employer', 'email image profile.name');

            if (!job) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'job not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: job
            });


        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    applications: async (req, res) => {
        try {
            let body = req.body;
            let params = req.params;
            // console.log('params', params);
            // console.log(params.id)

            /* validate request data */
            const validation = validate(schemaValidation.get, params);
            if (validation?.error) return res.status(400).json(validation.error);
            
            let job = await Job.findOne({ _id: utils.mongoID(params.id) });

            // check if the user is the job owner
            if (req.tokenData.user_id !== job.employer.toString()) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'permission denied'
                });
            }

            // get all applications for this job
            const applications = await Application.find({ job: utils.mongoID(params.id) }).populate('applicant', 'email image profile.name');

            if (!applications) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'applications not found'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: applications
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
            const jobs = await Job.find({}, { applications: false }).populate('employer', 'email image profile.name');

            return res.status(200).json({
                status: 'success',
                data: jobs
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    search: async (req, res) => {
        try {
            let body = req.body;

            /* validate request data */
            const validation = validate(schemaValidation.search, body);
            if (validation?.error) return res.status(400).json(validation.error);

            const jobs = await Job.find({
                title: { $regex: body.search, $options: 'i' },
                description: { $regex: body.search, $options: 'i' },
                requirements: { $regex: body.search, $options: 'i' },
                responsibilities: { $regex: body.search, $options: 'i' },
                location: { $regex: body.search, $options: 'i' }
            }, { applications: false }).populate('employer', 'email image profile.name').limit(body.limit);

            return res.status(200).json({
                status: 'success',
                data: jobs
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    filter: async (req, res) => {
        try {
            let body = req.body;

            /* validate request data */
            const validation = validate(schemaValidation.filter, body);
            if (validation?.error) return res.status(400).json(validation.error);

            const jobs = await Job.find({
                title: { $regex: body.title, $options: 'i' },
                location: { $regex: body.location, $options: 'i' },
                'salaryRange.low': { $gte: body.salaryRange.low || 0 },
                'salaryRange.high': { $lte: body.salaryRange.high || 999999999 },
                requirements: { $in: body.requirements },
                responsibilities: { $in: body.responsibilities },
                employer: body.employer
            }, { applications: false }).populate('employer', 'email image profile.name').limit(body.limit);

            return res.status(200).json({
                status: 'success',
                data: jobs
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
    random: async (req, res) => {
        try {
            const jobs = await Job.aggregate([{ $sample: { size: 1 } }]);

            return res.status(200).json({
                status: 'success',
                data: jobs
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

            const job = await Job.findOne({ _id: utils.mongoID(params.id) });

            if (!job) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'job not found'
                });
            }

            // check if the user is the job owner
            if (req.tokenData.user_id !== job.employer.toString()) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'permission denied'
                });
            }

            for (const key in body) {
                job[key] = body[key];
            }

            await job.save();

            return res.status(200).json({
                status: 'success',
                message: 'job details updated'
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

            const job = await Job.findOne({ _id: utils.mongoID(params.id) });

            if (!job) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'job not found'
                });
            }

            // check if the user is the job owner
            if (req.tokenData.user_id !== job.employer.toString()) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'permission denied'
                });
            }

            await job.deleteOne();

            return res.status(200).json({
                status: 'success',
                message: 'job deleted'
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
