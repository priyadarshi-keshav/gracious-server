const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const dbuser = require('../modal/userModal')


module.exports = {

    isAdmin: async (req, res, next) => {
        try {
            const token = req.headers["x-access-token"]
            if (!token) throw createError(400, "Token missing")

            const verifiedToken = jwt.verify(token, process.env.SECRET_KEY)

            if (verifiedToken) {
                const user = await dbuser.findById(verifiedToken.id)

                if (user && user.role === "admin") {
                    next()
                }
                else {
                    throw createError(400, "You are not an authorise person")
                }
            }
            else{
                throw createError.BadRequest()
            }

        }

        catch (error) {
            next(error)
        }
    }
}