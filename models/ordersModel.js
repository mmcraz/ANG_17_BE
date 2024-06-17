const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
        pcolor:String,
        pattern: String,
        size: String,
        text1: String,
        text2: String,
        settings: Object,
        userId: String,
        date: String,
        status:String,
        quantity:Number,
        product:String,
        template:String,
        price:Number
})


const orders = mongoose.model('orders', OrdersSchema)
module.exports = orders;