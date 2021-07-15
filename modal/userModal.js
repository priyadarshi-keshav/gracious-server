const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    firstname:{
        type: String,
        required:true
    },
    lastname:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        lowercase:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    emailToken:{
        type:String,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    lastlogin:{
        type:String
    }
},
{
    timestamps: true
})

// userSchema.methods.matchPassword = async (enteredPassword) => {
//     return await bcrypt.compare(enteredPassword, this.password)
// }

const User = mongoose.model('users', userSchema); //here users is the name of database collection

module.exports = User