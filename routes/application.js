const express = require('express');
const application = require('../app/application');
const auth = require('../auth');
const authenticateToken = require('../auth/authMiddleware');

const router = express.Router();

router.post('/create', auth.verifyToken, application.create);
// router.get('/all', application.all);
// router.get('/search', application.search);
// router.get('/random/:id', application.random);
router.get('/:id', authenticateToken.authenticateToken, application.get);
// router.patch('/update/:id', auth.verifyToken, application.update);
// router.patch('/update/state/:id', auth.verifyToken, application.state);
// router.delete('/remove/:id', auth.verifyToken, application.remove);

module.exports = router;
