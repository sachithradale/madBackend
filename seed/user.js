const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

const generateUsers = (num, role) => {
    const user = [];

    let profile = {};
    if (role === 'jobApplicant') {
        profile = {
            name: faker.internet.displayName(),
            dob: faker.date.past(),
            contact: faker.phone.number(),
            socialLinks: [faker.internet.url()],
            skills: [faker.lorem.word()],
            qualifications: [{ qualification: faker.lorem.word(), date: faker.date.past(), description: faker.lorem.sentence() }],
            workExperience: [{ position: faker.person.jobTitle(), company: faker.company.name(), startDate: faker.date.past(), endDate: faker.date.past(), isCurrent: false, description: faker.lorem.sentence() }],
            education: [{ institution: faker.company.name(), degree: faker.person.jobTitle(), field: faker.person.jobArea(), startDate: faker.date.past(), endDate: faker.date.past(), description: faker.lorem.sentence() }]
        }
    } else if (role === 'employer') {
        profile = {
            companyName: faker.company.name(),
            industry: faker.company.buzzPhrase()
        }
    }

    for (let i = 0; i < num; i++) {
        user.push({
            email: faker.internet.email().toLowerCase(),
            password: bcrypt.hashSync('1234', salt),
            role: role,
            image: faker.image.avatarGitHub(),
            profile: profile

        });
    }

    return user;
};

module.exports = { generateUsers };