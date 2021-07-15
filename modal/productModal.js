const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    image2: {
        type: String,
        required: true
    },
    image3: {
        type: String,
    },
    views : {
        type:Number,
        required: true
    },
    quantity_available: {
        type: Number,
        required: true
    },
    quantity_ordered: {
        type: Number,
        default: 0,
        required: true
    },
    product_details: {
        material: {type: String, required: true},
        color: {type: String, required: true},
        items_in_pack: {type: Number, required: true}
    },

    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },

    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ProductCategory'
    },
    rating:{
        type: Number,
        required: true
    },
    reviews: [
        {
            name: { type: String, required:true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'users'
            },
            createdAt: {type: Date}
        },
    ],
},
    {
        timestamps: true
    }
)

const Product = mongoose.model("products", productSchema);
module.exports = Product