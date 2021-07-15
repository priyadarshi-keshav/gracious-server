const router = require('express').Router()
const { isLoggedIn } = require('../middleware/isLoggedIn')

const {placeOrder, order, getOrderById, generateOrderId, paymentVerification, getOrdersByUser} = require('../controller/order.controller')

router.get('/', order)

router.post('/generate_order_id', generateOrderId)

router.post('/place_order', isLoggedIn, placeOrder)

router.get('/get_user_orders/:id', isLoggedIn, getOrdersByUser)

router.get('/get_order_details/:id', isLoggedIn, getOrderById)

// router.post('/payment_verification', paymentVerification )


module.exports = router