const dbuser = require('../modal/userModal')
const { generateLoginToken, passwordResetToken } = require('../utils/generateToken')
const bcrypt = require("bcryptjs")
const createError = require('http-errors')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = {

    // @GET ROUTE /user
    userHealth: (req, res) => {
        res.json({ auth: true, message: "This is user route where user can register and login" })
    },

    //@POST ROUTE /user/register
    register: async (req, res, next) => {
        try {
            const { firstname, lastname, email, password, confirmPassword, role } = req.body

            if (password === '' || confirmPassword === '' || firstname === '' || lastname === '') throw createError.BadRequest()
            
            if (password.length < 6) {
                throw createError(406, "Your password must be at least 6 characters");
            }

            const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            const validPassword = regularExpression.test(password)
            
            if(!validPassword){
                throw createError(406, 'Password should contain(A-a 0-9 !@#$%^&*)' )
            }

            if (password !== confirmPassword) throw createError(406, 'password mismatched')

            const hashPassword = await bcrypt.hashSync(password, 12)
            
            const userData = {
                firstname,
                lastname,
                email,
                password: hashPassword,
                role: role ? role : "buyer",
            }

            const userExist = await dbuser.findOne({ email })
            if (userExist) throw createError(409, 'email exist')
            else {
                const newUser = new dbuser(userData)
                const savedUser = await newUser.save()
                res.json({
                    _id: savedUser._id,
                    firstname: savedUser.firstname,
                    lastname: savedUser.lastname,
                    email: savedUser.email,
                    role: savedUser.role,
                    token: generateLoginToken(savedUser._id)
                })
            }
        } catch (error) {
            next(error)
        }
    },

    //@POST ROUTE /user/generate_emailtoken
    generateEmailToken: async (req, res, next) => {
        try {
            const { email } = req.body
            const user = await dbuser.findOne({email})
            if(user){
                const emailToken = await passwordResetToken(user._id)
                const msg = {
                    to: email,
                    from: 'keshavpriyadarshi93@gmail.com',
                    subject: 'Reset your password.',

                    text: `Hello from gracious.
                                    Please verify your email using the link http://localhost:3000/account_verify?generated%id=${emailToken}  to reset your password.`,

                    html: `<h1>Hello from gracious.</h1>
                                    <p>Please verify your email to reset your password. </p>
                                    <a href="http://localhost:3000/account_verify?generated%id=${emailToken}"><button>Verify Email</button></a>`
                };

                const result = await sgMail.send(msg)
                if(result){
                    return res.send('We have sent you an email to reset your password.')
                }                   
                else{
                    throw createError.InternalServerError()
                }    
            }
            else{
                throw createError(404, 'Email not found.')
            }
        } catch (error) {
            next(error)
        }
    },

    //@PUT ROUTE /user/reset_password
    resetPassword: async (user_id, req, res, next) => {
        try {
            const { password, confirmPassword } = req.body

            if (password === '' || confirmPassword === '') throw createError.BadRequest()

            if (password !== confirmPassword) throw createError(406, 'password mismatched')

            const hashPassword = await bcrypt.hashSync(password, 12)

            const user = await dbuser.findById({ _id:user_id })
            if (user) {
                user.password = hashPassword || user.password
                await user.save()
                res.send('Password reset successfully.')
            }
            else {
                throw createError.BadRequest()
            }

        } catch (error) {
            next(error)
        }
    },

    //@POST ROUTE /user/login
    login: async (req, res, next) => {

        try {
            const { email, password } = req.body
            if (email === '' && password === '') throw createError.BadRequest()

            const user = await dbuser.findOne({ email })

            if (user) {
                // if (user.isActive === true) {

                const matchpassword = bcrypt.compareSync(password, user.password)

                if (!matchpassword) throw createError(400, "Invalid email or password")

                res.send({
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                    token: generateLoginToken(user._id)
                })
                // }

                // else {
                //     throw createError(400, "Account is in deactive mode.")
                // }
            }
            else {
                throw createError(404, 'User not found')
            }
        } catch (error) {
            next(error)
        }
    },

    //@POST ROUTE /user/adminlogin
    adminLogin: async (req, res, next) => {
        try {
            const { email, password } = req.body
            if (email === '' && password === '') throw createError.BadRequest()
            const user = await dbuser.findOne({ email })
            if (user) {
                if (user.role === 'admin') {
                    const matchpassword = bcrypt.compareSync(password, user.password)

                    if (!matchpassword) throw createError(400, "Invalid email or password")

                    res.send({
                        _id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        token: generateToken(user._id)
                    })
                }
                else {
                    throw createError.BadRequest()
                }
            }
            else {
                throw createError.NotFound()
            }
        } catch (error) {
            next(error)
        }
    },

    //@PUT ROUTE /user/logout/:user_id
    logout: async (req, res, next) => {
        try {
            const _id = req.params.user_id
            const user = await dbuser.findById({ _id })

            if (user) {
                user.lastlogin = new Date()
                await user.save()
                res.send('lastlogin updated')
            }
            else {
                throw createError('logout failed')
            }

        } catch (error) {
            next(error)
        }
    }

}