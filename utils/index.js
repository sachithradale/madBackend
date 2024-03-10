const mongoose = require('mongoose');

module.exports = {
    mongoID: (str) => {
        return new mongoose.Types.ObjectId(str ?? undefined);
    }
};
