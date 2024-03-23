const mongoose = require('mongoose');
const orders = require('../models/ordersModel');

const saveOrders = async (req , res) => {
    try {
        const order = req.body;
      //  const duplicateUser = await orders.find({ "email": user.email });   

        // if(duplicateUser.length > 0) {
        //     return res.status(422).json({message: 'User ID already exists.'})
        // }
        const newOrder = new orders({...order})
        const savedOrder = await newOrder.save();
        res.json();
    } catch (error) {
        console.log('Error creating order', error)
        res.status(500).json({message: 'Internal Server Error 500'})
    }
}

const getOrders = async (req , res) => {
    try {
        const orderId = req.params.userId;
       const getOrderList = await orders.find({ "userId": orderId });   

        if(!getOrderList.length) {
            return res.status(422).json({message: 'No Orders found'})
        }       
        res.json(getOrderList);
    } catch (error) {
        console.log('Error fetching orders', error)
        res.status(500).json({message: 'Internal Server Error 500'})
    }
}

module.exports = {saveOrders, getOrders};