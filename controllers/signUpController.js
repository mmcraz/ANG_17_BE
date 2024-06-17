const mongoose = require('mongoose');
const signUp = require('../models/signUp');

const signUpUser = async (req , res) => {
    try {
        const user = req.body;
        const duplicateUser = await signUp.find({ "email": user.email });   

        if(duplicateUser.length > 0) {
            return res.status(422).json({message: 'User ID already exists.'})
        }
        const newUser = new signUp({...user})
        const savedUser = await newUser.save();
        res.json();
    } catch (error) {
        console.log('Error creating user', error)
        res.status(500).json({message: 'Internal Server Error 500'})
    }
}

const getUserDetails = async (req , res) => {
    try {
        const orderId = req.params.userId;
        const userData = await signUp.findById({ _id: orderId });       
        res.status(200).json(userData);

    } catch (error) {
        console.log('Error while fetching data', error)
        res.status(500).json({message: 'Internal Server Error 500'})
    }
}
module.exports = {signUpUser, getUserDetails};