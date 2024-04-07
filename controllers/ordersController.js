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
            return res.status(200).json([])
        }       
        res.json(getOrderList);
    } catch (error) {
        console.log('Error fetching orders', error)
        res.status(500).json({message: 'Internal Server Error 500'})
    }
}

const deleteOrder = async (req , res) => {
    try {
        const orderId = req.params.userId;
       // const deletedOrder = await orders.findOneAndDelete({ orderId: orderId }); 
       const isorderId = await orders.findById(orderId);
       if(isorderId) {
        isorderId.status = "Cancelled"
        const savedOrder = await isorderId.save();                 
       }
       res.json();
       //const deletedOrder = await orders.findOneAndDelete({ orderId: orderId }); 
    //    res.status(500).json({message: 'Internal Server Error 500'})
  
      
    } catch (error) {
        console.log('Error cancelled orders', error)
        res.status(500).json({message: 'Internal Server Error 500'})
    }
}

const permanentDeleteOrder = async (req , res) => {
    try {
        const orderId = req.params.orderId;
        const deletedOrder = await orders.findOneAndDelete({ _id: orderId }); 
        console.log('Deleted document:', deletedOrder);
        res.json();
    } catch (error) {
        console.log('Error cancelled orders', error)
        res.status(500).json({message: 'Internal Server Error 500'})
    }
}

module.exports = {saveOrders, getOrders, deleteOrder, permanentDeleteOrder};