const multer = require('multer');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync('./images')) {
    fs.mkdirSync('./images');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/');
    },
    filename: function (req, file, cb) {
        if (!fs.existsSync('./images')) {
            fs.mkdirSync('./images');
        }

        cb(null, Date.now().toString() + path.extname(file.originalname));
    }
});

/* filter image with file type */
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // save image
    } else {
        cb(new Error('only jpeg and png files are accepted'), false); // reject image
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
