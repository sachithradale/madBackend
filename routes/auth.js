const express = require('express');
const auth = require('../app/auth');
const authentication = require('../auth');

const router = express.Router();

// signup for applicant and employer
router.post('/signup', auth.signup);
router.post('/signin', auth.signin);
router.delete('/signout', auth.signout);

module.exports = router;


