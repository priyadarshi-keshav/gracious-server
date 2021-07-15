const jwt = require("jsonwebtoken")

const generateLoginToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '30d' })
}

const passwordResetToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '10min' })
}

module.exports = {
    generateLoginToken,
    passwordResetToken
}