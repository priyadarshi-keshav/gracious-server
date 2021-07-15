const { generateUploadURL } = require('../config/s3')


module.exports = {
    s3URL: async (req, res, next) => {
        try {
            const url = await generateUploadURL()
            res.send(url)

        } catch (error) {
            next(error)
        }
    }
}