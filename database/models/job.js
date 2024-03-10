const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    responsibilities: [String],
    location: { type: String, required: true },
    salaryRange: {
        low: { type: Number, required: true },
        high: { type: Number, required: true },
        currency: { type: String, default: 'USD' }
    },
    employer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }]
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
