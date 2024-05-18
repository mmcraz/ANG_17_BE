const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
    model:String,
    pattern: String,
    size: String,
    text: String,
    space: Number,
    fsize: Number,
    userId: String,
    date: String,
    status:String,
    quantity:Number
})

const orders = mongoose.model('orders', OrdersSchema)
module.exports = orders;