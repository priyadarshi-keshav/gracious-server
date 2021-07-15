const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE, { 
            useNewUrlParser: true,
            useFindAndModify : true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        })
        console.log(`MongoDB Connected ${connection.connection.host}`)
    } catch (error) {
        console.log(`Error : ${error.message}`)
        process.exit(1)
    }
    
}

module.exports = connectDB 