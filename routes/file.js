const express = require('express');
const file = require('../app/file');
const upload = require('../handlers/file');

const router = express.Router();

router.put('/upload', upload.single('file'), file.upload);
router.use('/', express.static('files'));

module.exports = router;
