const mongoose = require('mongoose');
const signUp = require('../models/signUp');
const axios = require('axios');

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

const verifyRecaptcha = async (req , res) => {

    try {
    console.log("req.body", req)
    const token = req.body.token;
    const secretKey = '6LeXLS4qAAAAAAsPy8WPEDK5O2sQZeNZY1A0nRZ4'; // Replace with your actual secret key

    const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`);

    const { success } = response.data;
    if (success) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Failed captcha verification' });
      }
  
} catch (error) { 
    res.json({ success: false, message: 'Failed captcha verification' });
}
}


module.exports = {signUpUser, getUserDetails, verifyRecaptcha};