const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    category_name:{
        type:String
    },
    category_image:{
        type:String
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
},
{
    timestamps:true
})

const ProductCategory = mongoose.model('product_category', productSchema)
module.exports = ProductCategory