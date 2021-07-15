const jwt = require('jsonwebtoken')
const dbuser = require('../modal/userModal')
const createError = require('http-errors')
const createHttpError = require('http-errors')

module.exports = {

    isLoggedIn: (req, res, next) => {
        try {
            const token = req.headers["x-access-token"]

            if (!token) throw createError(400,"Token missing")

            const verifiedToken = jwt.verify(token, process.env.SECRET_KEY)
            if(verifiedToken){
                next()
            }
            else{
                throw createHttpError.BadRequest()
            }

        }catch (error) {
            next(error)
        }
    }
}