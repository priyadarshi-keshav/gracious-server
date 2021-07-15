const router = require('express').Router()

const { getAllProducts, productsAccordtoCategory, productDetails, productHealth, getAllCategory, addProductReview, categoryDetails, productsAccordtoViews, mostViews, newArrival, updateQuantityOrdered } = require('../controller/product.controller')
const { isLoggedIn } = require('../middleware/isLoggedIn')


router.get('/', productHealth)

router.get('/category', getAllCategory)

router.get('/categorydetails/:categoryId', categoryDetails)

router.get('/all_product', getAllProducts)

router.get("/selected_category/:id", productsAccordtoCategory)

router.get("/most_viewed", mostViews)

router.get("/new_arrival", newArrival)

router.get("/details/:id", productDetails)

router.post('/add_review/:id', isLoggedIn, addProductReview)

router.put('/update_ordered_quantity', isLoggedIn, updateQuantityOrdered)

module.exports = router