const dbuser = require('../modal/userModal')
const { generateLoginToken } = require('../utils/generateToken')
const createError = require('http-errors')
const bcrypt = require("bcryptjs")


module.exports = {

    // @GET ROUTE /my_account
    myAccountHealth: (req, res) => {
        res.json({ auth: true, message: "This is myaccount route where all users can update their profile, add orders, wishlist" })
    },

    // @GET ROUTE /my_account/profile/:id
    getProfile: async (req, res, next) => {
        try {
            const userId = req.params.id
            const profile = await dbuser.findById(userId).select('-password')
            if (profile) {
                res.json(profile)
            }
            else {
                createError.NotFound()
            }

        } catch (error) {
            next(error)
        }
    },

    // @PUT ROUTE /my_account/update_profile
    updateProfile: async (req, res, next) => {
        try {
            const { _id, firstname, lastname, oldPassword, newPassword } = req.body
            const user = await dbuser.findById(_id)
            if (user) {

                if (oldPassword) {

                    const matchpassword = bcrypt.compareSync(oldPassword, user.password)
                    if (!matchpassword) throw createError(400, "Invalid old password")


                    if (newPassword.length < 6) {
                        throw createError(406, "Your password must be at least 6 characters");
                    }

                    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
                    const validPassword = regularExpression.test(newPassword)

                    if (!validPassword) {
                        throw createError(406, 'Password should contain(A-a 0-9 !@#$%^&*)')
                    }

                    const isValidNewPassword = bcrypt.compareSync(newPassword, user.password)
                    if (isValidNewPassword) throw createError(400, "New password should different from old password.")

                    const hashPassword = await bcrypt.hashSync(newPassword, 12)
                    user.password = hashPassword
                }

                user.firstname = firstname || user.firstname
                user.lastname = lastname || user.lastname
                await user.save()

                res.send({
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    role: user.role,
                    token: generateLoginToken(user._id)
                })
            }
            else {
                throw createError.NotFound()
            }
        }
        catch (error) {
            next(error)
        }
    },

}