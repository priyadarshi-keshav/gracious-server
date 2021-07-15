const router = require('express').Router()
//token verification
const { isAdmin } = require('../middleware/isAdmin')

const { adminHealth, createCategory, addProduct, updateProduct, deleteProduct, getAllUsers, updateCategory, getActiveOrders, getCompletedOrders, updateOrderDeliveryStatus, updateOrderTrackingDetails } = 
require('../controller/admin.controller')
const { s3URL } = require('../controller/s3.controller')


router.get('/', adminHealth)

router.get('/users', isAdmin, getAllUsers)


router.post('/create_category', isAdmin, createCategory)

router.put('/update_category/:categoryId', isAdmin, updateCategory)


router.post('/add_product', isAdmin, addProduct)

router.put('/update_product/:productId', isAdmin, updateProduct)

router.delete("/delete_product/:productId", isAdmin, deleteProduct)


router.get("/gets3_url", isAdmin, s3URL)


router.get("/active_orders", isAdmin, getActiveOrders)

router.get("/completed_orders", isAdmin, getCompletedOrders)

router.put("/update_delivery_status/:orderId", isAdmin, updateOrderDeliveryStatus)

router.put("/update_tracking_details/:orderId", isAdmin, updateOrderTrackingDetails)


module.exports = router