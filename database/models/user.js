const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['jobApplicant', 'employer'], required: true, default: 'jobApplicant' },
        image: { type: String, required: false },
        profile: {
            name: String,
            dob: Date,
            contact: String,
            socialLinks: [String],
            skills: [String],
            qualifications: [{ qualification: String, date: Date, description: String }],
            workExperience: [{ position: String, company: String, startDate: Date, endDate: Date, isCurrent: Boolean, description: String }],
            education: [{ institution: String, degree: String, field: String, startDate: Date, endDate: Date, description: String }],

            // User 2 - Employer
            companyName: String,
            industry: String,
        },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
