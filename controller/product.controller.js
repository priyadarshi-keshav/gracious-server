const dbcategory = require("../modal/categoryModal")
const dbproduct = require("../modal/productModal")
const createError = require('http-errors')
const moment = require("moment")


module.exports = {

    //@GET ROUTE /product
    productHealth: (req, res) => {
        res.json({ auth: true, message: "This is product route which can be access by all users" })
    },

    //@GET ROUTE /product/category
    getAllCategory: async (req, res, next) => {
        try {
            const category = await dbcategory.find({})
            if (!category) throw createError.NotFound()
            else {
                return res.send(category)
            }

        } catch (error) {
            next(error)
        }
    },

    //@GET ROUTE /product/all_product
    getAllProducts: async (req, res, next) => {
        try {
            const allProducts = await dbproduct.find({})
            if (!allProducts) throw createError.NotFound()
            else {
                return res.send(allProducts)
            }
        } catch (error) {
            next(error)
        }
    },

    //@GET ROUTE /product/selected_category/:id
    productsAccordtoCategory: async (req, res, next) => {
        try {
            const category_id = req.params.id
            const product = await dbproduct.find({ category_id: category_id })
            if (!product) throw createError.NotFound()
            else {
                return res.send(product)
            }

        } catch (error) {
            next(error)
        }
    },

    //@GET ROUTE /product/most_viewed
    mostViews: async (req, res, next) => {
        try {
            const product = await dbproduct.find().sort({ views: -1 }).limit(8)
            if (!product) throw createError.NotFound()
            else {
                return res.send(product)
            }
        } catch (error) {
            next(error)
        }
    },

    //@GET ROUTE /product/new_arrival 
    newArrival: async (req, res, next) => {
        try {
            const product = await dbproduct.find({
                createdAt: { 
                    $gte: moment().add(-15, "days"),
                }
            })
            if (!product) throw createError.NotFound()
            else {
                return res.send(product)
            }
        } catch (error) {
            next(error)
        }
    },

    //GET ROUTE /product/details/:id
    productDetails: async (req, res, next) => {
        try {
            const _id = req.params.id

            const product = await dbproduct.findById(_id)
            if (product) {
                product.views = product.views + 1
                await product.save()
                res.send(product)
            }
            else {
                throw createError.NotFound()
            }
        } catch (error) {
            next(error)
        }
    },

    //GET ROUTE /product/categorydetails/:categoryId
    categoryDetails: async (req, res, next) => {
        try {
            const category_id = req.params.categoryId

            const data = await dbcategory.findById(category_id)
            if (!data) throw createError.NotFound()
            else {
                res.send(data)
            }
        } catch (error) {
            next(error)
        }
    },

    //@PUT ROUTE /product/add_review/:id
    addProductReview: async (req, res, next) => {
        try {
            const { name, rating, comment, postedBy } = req.body
            const product_id = req.params.id

            const reviewData = {
                name,
                rating: Number(rating),
                comment,
                postedBy,
                createdAt: new Date()
            }
            const product = await dbproduct.findById({ _id: product_id })

            if (product) {
                const alreadyReviewed = product.reviews.find(item => item.postedBy.toString() === postedBy.toString())
                if (alreadyReviewed) {
                    throw createError.BadRequest('product already reviewed')
                }
                product.reviews.push(reviewData)
                product.rating = product.reviews.reduce((total, item) => item.rating + total, 0) / product.reviews.length
                await product.save()

                res.send('Thanks for your feedback.')
            }
            else {
                throw createError.NotFound()
            }
        } catch (error) {
            next(error)
        }
    },

    // @PUT ROUTE /product/update_product_quantity
    updateQuantityOrdered: async (req, res, next) => {
        try {
            const orderItems = req.body

            for (let i = 0; i < orderItems.length; i++) {

                const product = await dbproduct.findById({ _id: orderItems[i].product_id})
                if(product){
                    product.quantity_available = product.quantity_available - orderItems[i].quantity_selected
                    product.quantity_ordered = product.quantity_ordered + orderItems[i].quantity_selected
                    await product.save()
                }
            }
            res.send('Ordered quantity updated')

        } catch (error) {
            next(error)
        }
    },
}
