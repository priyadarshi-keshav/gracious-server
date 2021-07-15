const router = require('express').Router()

const {placeOrder} = require('../controller/order.controller')
const { myAccountHealth, getProfile, updatePassword, updateProfile} = require('../controller/profile.controller')
const { isLoggedIn } = require('../middleware/isLoggedIn')

router.get('/', myAccountHealth)

router.get('/profile/:id', isLoggedIn, getProfile)

router.put('/update_profile', isLoggedIn, updateProfile)

router.post('/place_order', isLoggedIn, placeOrder)

module.exports = router