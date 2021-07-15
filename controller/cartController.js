const dbcart = require('../modal/cartModal')
const createError = require('http-errors')

module.exports = {

    // @GET ROUTE /cart
    cart: (req, res) => {
        res.send({ auth: true, message: 'this is cart route' })
    }, 

    // @GET route cart/get_products/:user_id
    getCartProducts: async (req, res, next) => {
        try {
            const products = await dbcart.find({ user_id: req.params.user_id })
            if (!products) {
                throw createError.NotFound()
            }
            else {
                return res.send(products)
            }
        }
        catch (error) {
            next(error)
        }
    },

    // @POST route cart/add_products
    addToCartMultiple: async (req, res, next) => {
        try {
            const { cartProducts, user_id } = req.body
            const cart = await cartProducts.map((product) => {
                return (
                    dbcart.create({
                        product_id: product._id,
                        user_id: user_id,
                        name: product.name,
                        price: product.price,
                        quantity_available: product.quantity_available,
                        quantity_selected: product.quantity_selected,
                        image: product.image,
                    })
                )
            })

            if (!cart) {
                throw createError.InternalServerError()
            }
            else {
                res.send('products added successfully' )
            }
        }
        catch (error) {
            next(error)
        }
    },

    // @POST route cart/add_product
    addToCart: async (req, res, next) => {

        const product = req.body
        try {
            const addNewProduct = new dbcart(product)
            await addNewProduct.save()
            return res.send('product added successfully')
        }
        catch (error) {
            next(error)
        }
    },

    // @PUT ROUTE cart/remove_product
    removeFromCart: async (req, res, next) => {
        try {
            const { user_id, product_id } = req.body
            // console.log(req.body, req.headers)
            const isDelete = await dbcart.deleteOne({ product_id, user_id })
            if (isDelete.deletedCount > 0) {
                res.send('product removed from cart')
            }
            else {
                throw createError.InternalServerError()
            }
        } catch (error) {
            next(error)
        }
    },

    // @PUT ROUTE cart/update_quantity
    updateQuantity: async (req, res, next) => {
        try {
            const { user_id, product_id, quantity_selected } = req.body
            dbcart.updateOne({ user_id, product_id }, { quantity_selected: quantity_selected }, (err, data) => {
                if (err) throw createError.InternalServerError()

                if (data.nModified > 0) {
                    res.send('quantity updated')
                }
                else {
                    throw createError.InternalServerError()
                }
            })
        } catch (error) {
            next(error)
        }
    },

    // @DELETE ROUTE /cart/empty_cart/:user_id
    clearCartOfUser: async (req, res, next) => {
        const user_id = req.params.user_id
        try {
            const isDeleted = await dbcart.deleteMany({ user_id: user_id })
            if (isDeleted.deletedCount > 0) {
                res.send('cart is empty')
            }
            else {
                throw createError.InternalServerError()
            }
        } catch (error) {
            next(error)
        }
    }
}