const config = require('../config');

module.exports = {
    upload: async (req, res) => {
        try {
            let file = req.file.filename;

            return res.status(200).json({
                status: 'success',
                message: 'file uploaded',
                data: {
                    file,
                    url: `${config.server_urls.api}/api/files/${file}`
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
