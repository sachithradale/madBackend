const express = require('express');
const image = require('../app/image');
const upload = require('../handlers/image');

const router = express.Router();

router.put('/upload', upload.single('image'), image.upload);
router.use('/', express.static('images'));

module.exports = router;
