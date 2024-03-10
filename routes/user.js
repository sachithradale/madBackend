const express = require('express');
const user = require('../app/user');
const auth = require('../auth');
const authenticateToken = require('../auth/authMiddleware');

const router = express.Router();

router.get('/all', auth.verifyToken, user.all);
router.get('/all/employers', auth.verifyToken, user.all_employers);
router.get('/:id', user.get);
router.patch('/update/:id', auth.verifyToken, authenticateToken.authenticateToken, user.update);
router.patch('/update/password/:id', auth.verifyToken, authenticateToken.authenticateToken, user.change_password);

// search employers
router.get('/search/employers', auth.verifyToken, user.search_employers);

// use upload image route in images to upload the file and get the file name
router.patch('/update/image/:id', auth.verifyToken, authenticateToken.authenticateToken, user.update_image);
router.post('/add/work-experience/:id', auth.verifyToken, authenticateToken.authenticateToken, user.add_work_experience);
// router.delete('/remove/:id', auth.verifyToken, user.remove);

module.exports = router;
