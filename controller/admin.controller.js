const dbcategory = require('../modal/categoryModal')
const dbproduct = require("../modal/productModal");
const dbuser = require("../modal/userModal")
const dborder = require("../modal/orderModal")
const createError = require('http-errors')


module.exports = {

    // @GET ROUTE /admin
    adminHealth: (req, res) => {
        res.json({ auth: true, message: "This is admin route which can be only access by admin" })
    },

    // @GET ROUTE /admin/users
    getAllUsers: async (req, res, next) => {
        try {
            const data = await dbuser.find({ role: "buyer" })
            if (!data) throw createError.NotFound()
            return res.send(data)

        } catch (error) {
            next(error)
        }
    },

    // @GET ROUTE /admin/active_orders
    getActiveOrders: async (req, res, next) => {
        try {
            const order = await dborder.find({ isDelivered: false }).populate(
                'orderedBy',
                'firstname lastname email'
            )
            if (order) {
                return res.send(order)
            }
            else {
                throw createError.NotFound()
            }

        } catch (error) {
            next(error)
        }
    },

    // @GET ROUTE /admin/completed_orders
    getCompletedOrders: async (req, res, next) => {
        try {
            const order = await dborder.find({ isDelivered: true }).populate(
                'orderedBy',
                'firstname email'
            )
            if (order) {
                return res.send(order)
            }
            else {
                throw createError.NotFound()
            }

        } catch (error) {
            next(error)
        }
    },

    // @PUT ROUTE /admin/update_delivery_status/:orderId
    updateOrderDeliveryStatus: async (req, res, next) => {
        try {
            const orderId = req.params.orderId
            const order = await dborder.findById(orderId)
            if (order) {
                order.isDelivered = true
                order.deliveredAt = new Date()
                await order.save()

                res.send(`Delivery status is updated to delivered`)
            }
            else {
                throw createError.NotFound()
            }
        } catch (error) {
            next(error)
        }
    },

    // @PUT ROUTE /admin/update_tracking_details/:orderId
    updateOrderTrackingDetails: async (req, res, next) => {
        try {
            const orderId = req.params.orderId
            const { serviceName, trackingNumber, status } = req.body
            const order = await dborder.findById(orderId)
            if (order) {
                order.trackingDetails.serviceName = serviceName || order.trackingDetails.serviceName
                order.trackingDetails.trackingNumber = trackingNumber || order.trackingDetails.trackingNumber
                order.trackingDetails.status = status || order.trackingDetails.status
                await order.save()

                res.send(`Tracking details is updated`)
            }
            else {
                throw createError.NotFound()
            }
        } catch (error) {
            next(error)
        }
    },

    // @POST ROUTE /admin/create_category
    createCategory: async (req, res, next) => {
        try {
            const { category_name, category_image, created_by } = req.body
            let data = {
                category_name,
                category_image,
                created_by
            }
            const newCategory = new dbcategory(data)
            await newCategory.save()
            return res.send("Category added")

        } catch (error) {
            next(error)
        }
    },

    // @PUT ROUTE /admin/update_category/:categoryId
    updateCategory: async (req, res, next) => {
        try {
            const categoryId = req.params.categoryId
            const { category_name, category_image } = req.body

            const category = await dbcategory.findById(categoryId)
            if (category) {
                category.category_name = category_name || category.category_name,
                    category.category_image = category_image || category.category_image,
                    console.log(category)
                await category.save()
                return res.send(`${category.category_name} is updated`)
            }
            else {
                throw createError.NotFound()
            }
        } catch (error) {
            next(error)
        }
    },

    // @POST ROUTE /admin/add_product
    addProduct: async (req, res, next) => {
        try {
            const { name, brand, description, price, image, quantity_available, product_details, created_by, category_id } = req.body
            console.log(req.body)
            const productData = {
                name,
                brand,
                description,
                price,
                image: image[0],
                image2: image.length === 2 && image[1] || '',
                image3: image.length === 3 && image[2] || '',
                views: 0,
                quantity_available,
                quantity_ordered: 0,
                product_details: {
                    material: product_details.material,
                    color: product_details.color,
                    items_in_pack: product_details.items_in_pack
                },
                created_by,
                category_id,
                rating : 0,
                reviews: []
            }
            
            const newProduct = new dbproduct(productData)
            await newProduct.save()
            return res.send("Product added successfully")

        } catch (error) {
            next(error)
        }
    },

    // @PUT ROUTE /admin/update_product/:productId
    updateProduct: async (req, res, next) => {
        try {
            const productId = req.params.productId
            const { name, brand, description, price, quantity_available, quantity_ordered, product_details, category_id } = req.body
            const product = await dbproduct.findById(productId)
            if (product) {
                product.name = name || product.name,
                product.brand = brand || product.brand,
                product.description = description || product.description,
                product.price = price || product.price,
                product.quantity_available = quantity_available || product.quantity_available,
                product.quantity_ordered = quantity_ordered || product.quantity_ordered,
                product.product_details.material = product_details.material ||product.product_details.material
                product.product_details.color = product_details.color || product.product_details.color
                product.product_details.items_in_pack = product_details.items_in_pack || product.product_details.items_in_pack
                product.category_id = category_id || product.category_id

                await product.save()
                return res.send(`${product.name} is updated`)
            }
            else {
                throw createError.NotFound()
            }
        } catch (error) {
            next(error)
        }
    },

    // @DELETE ROUTE admin/delete_product/:productId
    deleteProduct: async (req, res, next) => {
        try {
            const product_id = req.params.productId
            const product = await dbproduct.deleteOne({ _id: product_id })

            if (product.deletedCount > 0) {
                return res.send(`Product has been deleted`)
            }
            else {
                throw createError.InternalServerError()
            }
        } catch (error) {
            next(error)
        }
    }

}