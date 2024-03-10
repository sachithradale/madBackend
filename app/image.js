const config = require('../config');

module.exports = {
    upload: async (req, res) => {
        try {
            let file = req.file.filename;

            return res.status(200).json({
                status: 'success',
                message: 'image uploaded',
                data: {
                    file,
                    url: `${config.server_urls.api}/api/images/${file}`
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'failed',
                message: error.message
            });
        }
    }
};
