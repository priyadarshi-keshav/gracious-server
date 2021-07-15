const express = require("express")
const cors = require("cors")
const app = express()

const dotenv = require("dotenv")
dotenv.config()

//connect to database**************
const connectDB = require("./config/db")
connectDB()


//apply middleware*****************
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


//routes start*****************************
app.get('/', (req, res) => {
    res.send({
        message: "Welcome to the e-commerce Application Programming Interface",
        health: "Ok"
    }) 
})

const login = require("./routes/login.route")
app.use('/user', login)

const product = require('./routes/product.route')
app.use('/product', product)


const admin = require('./routes/auth.admin.route')
app.use('/admin', admin)

const cart = require('./routes/auth.cart.route')
app.use('/cart', cart)

const myAccount = require('./routes/auth.myAccount.route')
app.use('/my_account', myAccount)

const order = require('./routes/auth.order.route')
app.use('/order', order)



//routes end********************************************

const { expressErrorHandler, routeNotFound } = require("./utils/errorHandlers")

//page not found route
app.use(routeNotFound)

//express error handler
app.use(expressErrorHandler)

const port = process.env.PORT || 2400

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is running on port ${port}`)
})

