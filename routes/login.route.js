const router = require('express').Router()

const {login, register, userHealth, adminLogin, logout, resetPassword, generateEmailToken} = require("../controller/login.controller")

const {isValidEmailToken} = require('../middleware/isValidEmailToken')

router.get('/', userHealth)

router.post('/login', login)

router.post('/adminlogin', adminLogin)

router.post('/register', register)

router.post('/generate_emailtoken', generateEmailToken)

router.put('/reset_password', isValidEmailToken, resetPassword)

router.put('/logout/:user_id', logout)

module.exports = router 