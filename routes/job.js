const express = require('express');
const job = require('../app/job');
const auth = require('../auth');
const authenticateToken = require('../auth/authMiddleware');

const router = express.Router();

router.post('/create', auth.verifyToken, auth.isEmployer, authenticateToken.authenticateToken, job.create);
router.patch('/update/:id', auth.verifyToken, auth.isEmployer, authenticateToken.authenticateToken, job.update);
router.get('/all', job.all);
// router.get('/random/:id', job.random);
router.get('/search', job.search);
router.get('/filter', job.filter);
router.get('/:id', job.get);
router.get('/:id/applications', auth.verifyToken, auth.isEmployer, authenticateToken.authenticateToken, job.applications);
router.delete('/remove/:id', auth.verifyToken, auth.isEmployer, authenticateToken.authenticateToken, job.remove);

module.exports = router;
