const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema(
    {
        job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
        applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        resume: { type: String, required: true },
        description: { type: String, required: false },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], required: true, default: 'pending' }
    },
    { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;