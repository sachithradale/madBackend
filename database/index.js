const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const config = require('../config');
const seedDB = require('../seed/index');

module.exports = {
    init: async (runSeed = false) => {

        // if DB_CONNECTION == memory use MongoMemoryServer for testing purposes
        let uri = config.mongodb_con;
        if (config.node_env === 'test' && config.mongodb_con === 'memory') {
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
        }

        // config.client_urls.app

        runSeed = false;
        runSeed = config.seed_status === 'true' ? true : false;
        console.log('>> runSeed:', runSeed);
        // runSeed = true;

        mongoose
            .connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {
                console.log('>> Connected to the database <<');
                if (runSeed) seedDB();
            })
            .catch((err) => {
                console.log(`>> DB ERROR << \n ${err}`);

                if (err.code === 'ECONNREFUSED') {
                    console.log('>> Failed to connect to the database <<');
                }
            });
    }
};
