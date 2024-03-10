const express = require('express');
const user = require('./user');
const application = require('./application');
const job = require('./job');
const image = require('./image');
const file = require('./file');
const auth = require('./auth');

const router = express.Router();

/* auth routes */
router.use('/auth', auth);
/* user routes */
router.use('/users', user);
/* application routes */
router.use('/application', application);
/* job routes */
router.use('/job', job);
/* images routes: use upload image route in images to upload the file and get the file name */
router.use('/images', image);
/* file routes: use upload file route in file to upload the CV/Resume and get the file name */
router.use('/files', file);


module.exports = router;
