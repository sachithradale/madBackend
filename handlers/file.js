const multer = require('multer');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync('./files')) {
    fs.mkdirSync('./files');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files/');
    },
    filename: function (req, file, cb) {
        if (!fs.existsSync('./files')) {
            fs.mkdirSync('./files');
        }

        cb(null, Date.now().toString() + path.extname(file.originalname));
    }
});

/* filter image with file type */
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); // save file
    } else {
        cb(new Error('only pdf files are accepted'), false); // reject file
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
