const Application = require('../database/models/application');
const utils = require('../utils');
const validate = require('../utils/validate');
const schemaValidation = require('../validation/application');
const commonValidation = require('../validation/common');
const User = require('../database/models/user');

// const applicationSchema = new Schema(
//     {
//         job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
//         applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//         resume: { type: String, required: true },
//         status: { type: String, enum: ['pending', 'accepted', 'rejected'], required: true, default: 'pending' }
//     },
//     { timestamps: true }
// );

/* 
TODO: 
    search
    all
    remove
    update
*/

module.exports = {
    create: async (req, res) => {
        try {
            let body = req.body;
            let params = req.params;

            /* validate request data */
            const validation = validate(schemaValidation.create, body);
            if (validation?.error) return res.status(400).json(validation.error);

            const application = new Application({
                job: utils.mongoID(body.job),
                applicant: utils.mongoID(body.applicant),
                resume: body.resume,
                description: body.description,
                status: body.status
            });

            await application.save();

            return res.status(200).json({
                status: 'success',
                message: 'application created'
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

            const tokenDataArray = req.tokenData;

            /* validate request data */
            const validation = validate(schemaValidation.get, params);
            if (validation?.error) return res.status(400).json(validation.error);

            const application = await Application.findOne({ _id: utils.mongoID(params.id) }).populate('job').populate('applicant');
            
            if (!application) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'application details not found'
                });
            }

            // check if the user is the applicant or the job owner
            if (application.applicant._id.toString() !== tokenDataArray.user_id && application.job.employer.toString() !== tokenDataArray.user_id) {
                return res.status(403).json({
                    status: 'failed',
                    message: 'permission denied'
                });
            }

            return res.status(200).json({
                status: 'success',
                data: application
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    },
};
