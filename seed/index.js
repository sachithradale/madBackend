const fs = require('fs');
const User = require('../database/models/user');
const Job = require('../database/models/job');
const Application = require('../database/models/application');
const { generateUsers } = require('./user');
const { generateJobs } = require('./job');
const { generateApplications } = require('./application');
const userUtils = require('../utils/user');

const seedUsers = async (num, role, name, result) => {
    return new Promise((resolve) => {
        const users = generateUsers(num, role);

        if (result?.[name]) return true;

        User.insertMany(users, { ordered: false })
            .then((docs) => {
                console.log(
                    `${docs.length} "${name}" records have been inserted into the database.`
                );
                return resolve(true);
            })
            .catch((err) => {
                console.error(err);
                console.error(
                    `${err.writeErrors?.length ?? 0
                    } errors occurred during the insertMany operation.`
                );
                return resolve(false);
            });
    });
};

const seedJobs = async (num, num_employers, name, result) => {
    return new Promise(async (resolve) => {
        const employer = await User.find({ role: userUtils.roles.EMPLOYER }).limit(num_employers);
        // console.log(employer);

        let employer_ids = employer.map((e) => e._id);

        let jobs = {};
        for (let i = 0; i < num_employers; i++)
            jobs = Object.values(jobs).concat(generateJobs(num, employer_ids[i]));


        jobs = Object.values(jobs);

        if (result?.[name]) return true;

        Job.insertMany(jobs, { ordered: false })
            .then((docs) => {
                console.log(
                    `${docs.length} "${name}" records have been inserted into the database.`
                );
                return resolve(true);
            })
            .catch((err) => {
                console.error(err);
                console.error(
                    `${err.writeErrors?.length ?? 0
                    } errors occurred during the insertMany operation.`
                );
                return resolve(false);
            });
    });
};

const seedApplications = async (num, num_jobs, num_applicants, name, result) => {
    return new Promise(async (resolve) => {
        const jobs = await Job.find().limit(num_jobs);
        const applicants = await User.find({ role: userUtils.roles.APPLICANT }).limit(num_applicants);

        let job_ids = jobs.map((j) => j._id);
        let applicant_ids = applicants.map((a) => a._id);

        let applications = {};
        for (let i = 0; i < num_applicants; i++)
            applications = Object.values(applications).concat(generateApplications(job_ids, applicant_ids[i]));

        applications = Object.values(applications);

        if (result?.[name]) return true;

        Application.insertMany(applications, { ordered: false })
            .then((docs) => {
                console.log(
                    `${docs.length} "${name}" records have been inserted into the database.`
                );
                return resolve(true);
            })
            .catch((err) => {
                console.error(err);
                console.error(
                    `${err.writeErrors?.length ?? 0
                    } errors occurred during the insertMany operation.`
                );
                return resolve(false);
            });
    });

}

const seedDB = () => {
    console.log('>> Seeding the database <<');
    fs.readFile('seed/seed.json', async function (err, content) {
        if (err) throw err;

        let result = JSON.parse(content) || {};

        let [applicant, employer, jobs,] = await Promise.all([
            seedUsers(15, userUtils.roles.APPLICANT, 'applicant', result),
            seedUsers(15, userUtils.roles.EMPLOYER, 'employer', result),
            seedJobs(10, 4, 'jobs', result)
        ]);
        
        let applications = await seedApplications(5, 10, 5, 'applications', result);

        fs.writeFile(
            'seed/seed.json',
            JSON.stringify({
                ...result,
                applicant,
                employer,
                jobs,
                applications
            }),
            function (err) {
                if (err) throw err;
            }
        );
    });
};

module.exports = seedDB;
