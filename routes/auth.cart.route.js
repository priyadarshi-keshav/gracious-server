const express = require('express')
const { addToCart, getCartProducts, cart, addToCartMultiple, removeFromCart, updateQuantity, clearCartOfUser } = require('../controller/cartController')
const router = express.Router()
const { isLoggedIn } = require('../middleware/isLoggedIn')

router.get('/', cart)

router.get('/get_products/:user_id', isLoggedIn, getCartProducts)

router.post('/add_products', isLoggedIn, addToCartMultiple)

router.post('/add_product', isLoggedIn, addToCart)

router.put('/remove_product', isLoggedIn, removeFromCart)

router.put('/update_quantity', isLoggedIn, updateQuantity)

router.delete('/empty_cart/:user_id', isLoggedIn, clearCartOfUser)

module.exports = router