const dbOrder = require('../modal/orderModal')
const dbproduct = require("../modal/productModal")
const Razorpay = require('razorpay')
const shortid = require('shortid')
const createError = require('http-errors')

const razorpay = new Razorpay({
    key_id: 'rzp_test_OySIcjLvv0NCGK',
    key_secret: 'XKJ4JKCEcBrnWx5GHrMXXqYn'
})


module.exports = {

    // @GET ROUTE /order
    order: (req, res) => {
        res.send({ auth: true, message: 'this is order route' })
    },

    // @POST ROUTE /order/generate_order_id
    generateOrderId: async (req, res, next) => {
        try {
            const options = {
                amount: req.body.amount * 100, //it always takes as paise
                currency: 'INR',
                receipt: shortid.generate()
            }

            const order = await razorpay.orders.create(options)

            if (order) {
                return res.json(order)
            }
            else {
                throw createError.InternalServerError()
            }
        } catch (error) {
            next(error)
        }
    },

    // @POST ROUTE /order/place_order
    placeOrder: async (req, res, next) => {
        try {
            const { orderedBy, orderItems, shippingAddress, paymentMethod, paymentResult, itemsPrice, deliveryPrice, totalPrice } = req.body

            if (orderItems && orderItems.length === 0) {
                throw createError.BadRequest()
            }
            else {
                //THIS WILL RETURN ALL THE PAYMENT DETAILS FROM RAZORPAY
                razorpay.payments.fetch(paymentResult.razorpay_payment_id)
                    .then(async (paymentDocument) => {

                        if (paymentDocument.status === 'captured') {
                            const order = new dbOrder({
                                orderedBy,
                                orderItems,
                                shippingAddress,
                                paymentMethod,
                                paymentResult: {
                                    razorpay_payment_id: paymentResult.razorpay_payment_id,
                                    razorpay_order_id: paymentResult.razorpay_order_id,
                                    razorpay_signature: paymentResult.razorpay_signature,
                                    amount: paymentDocument.amount,
                                    method: paymentDocument.method,
                                    vpa: paymentDocument.vpa,
                                    email: paymentDocument.email,
                                    contact: paymentDocument.contact,
                                    acquirer_data: paymentDocument.acquirer_data
                                },
                                itemsPrice,
                                deliveryPrice,
                                totalPrice,
                                isPaid: true,
                                paidAt: new Date(),
                            })
                            await order.save()
                            for (let i = 0; i < orderItems.length; i++) {

                                const product = await dbproduct.findById({ _id: orderItems[i].product_id})
                                if(product){
                                    product.quantity_available = product.quantity_available - orderItems[i].quantity_selected
                                    product.quantity_ordered = product.quantity_ordered + orderItems[i].quantity_selected
                                    await product.save()
                                }
                            }
                            res.send('order placed successfully')
                        }
                        else {
                            throw createError.InternalServerError()
                        }
                    })
            }
        } catch (error) {
            next(error)
        }
    },

    // @GET ROUTE /order/get_order_details/:id
    getOrderById: async (req, res, next) => {
        try {
            const orderId = req.params.id
            const order = await dbOrder.findById({ _id: orderId }).populate(
                'orderedBy',
                'firstname email'
            )

            if (order) {
                res.send(order)
            }
            else {
                throw createError.NotFound()
            }

        } catch (error) {
            next(error)
        }
    },

    // @GET ROUTE /order/get_user_orders/:id
    getOrdersByUser: async (req, res, next) => {
        try {
            const userId = req.params.id
            const orders = await dbOrder.find({ orderedBy: userId })

            if (orders.length === 0) {
                throw createError.NotFound()
            }
            else {
                res.send(orders)
            }
        } catch (error) {
            next(error)
        }
    }
}


// {
//     id: 'pay_HOwydWMOyt5iwW',
//     entity: 'payment',
//     amount: 159900,
//     currency: 'INR',
//     status: 'captured',
//     order_id: 'order_HOwyFbEScGTDpd',
//     invoice_id: null,
//     international: false,
//     method: 'upi',  method: 'card',
//     amount_refunded: 0,
//     refund_status: null,
//     captured: true,
//     description: 'Complete your order to pay the amount.',
//     card_id: null,
//     bank: null,
//     wallet: null,
//     vpa: '9504583841@ybl',
//     email: 'keshavpriyadarshi93@gmail.com',
//     contact: '+919504583841',
//     notes: { address: 'Razorpay Corporate Office' },
//     fee: 3774,
//     tax: 576,
//     error_code: null,
//     error_description: null,
//     error_source: null,
//     error_step: null,
//     error_reason: null,
//     acquirer_data: {
//       rrn: '547243410798',
//       upi_transaction_id: '3BA67D54313CD95FC2CC608CF0D930D6'
//     } acquirer_data: { auth_code: '961374' }