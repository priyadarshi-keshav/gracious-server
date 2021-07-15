const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
    {
        orderedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        orderItems: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                },
                name: { type: String, required: true },
                quantity_selected: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true }
            }
        ],
        shippingAddress: {
            name: { type: String, required: true },
            address: { type: String, required: true },
            mobile: { type: String, required: true },
            pincode: { type: String, required: true },
            locality: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true }
            // country:{type:String, required:true}
        },
        paymentMethod: {
            type: String,
            required: true
        },
        paymentResult: {
            razorpay_payment_id: { type: String },
            razorpay_order_id: { type: String },
            razorpay_signature: { type: String },
            amount: { type: Number },
            method: { type: String },
            vpa: { type: String },
            email: { type: String },
            contact: { type: String },
            acquirer_data: { type: Object }
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0
        },
        deliveryPrice: {
            type: Number,
            required: true,
            default: 0.0
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false
        },
        paidAt: {
            type: Date
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false
        },
        deliveredAt: {
            type: Date
        },
        trackingDetails: {
            serviceName: {type:String},
            trackingNumber : {type:Number},
            status : {type:String}
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('orders', orderSchema)

module.exports = Order