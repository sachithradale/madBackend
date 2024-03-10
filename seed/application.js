const { faker } = require('@faker-js/faker');

const generateApplications = (jobs, applicant) => {
    const applications = [];

    for (let i = 0; i < jobs.length; i++) {
        applications.push({
            job: jobs[i],
            applicant: applicant,
            // file path or URL to the resume
            resume: faker.internet.url(),
            description: faker.lorem.paragraph(),
            status: 'pending'
        });
    }

    return applications;
}

module.exports = { generateApplications };