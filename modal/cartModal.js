const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity_available:{
        type:Number,
        required:true
    },
    quantity_selected:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true 
    },
    product_details: {
        material: {type: String},
        color: {type: String},
        items_in_pack: {type: Number}
    }
})

const Cart = mongoose.model('cart', cartSchema )

module.exports = Cart