const jwt = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {

    isValidEmailToken: (req, res, next) => {
        try {
            const emailToken = req.headers["x-access-token"]

            if (!emailToken) throw createError(400,"Token missing")

            const verifiedToken = jwt.verify(emailToken, process.env.SECRET_KEY)
            if(verifiedToken){
                next(verifiedToken.id)
            }
            else{
                throw createError.BadRequest()
            }

        }catch (error) {
            next(error)
        }
    }
}