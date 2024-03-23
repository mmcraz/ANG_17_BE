const mongoose = require('mongoose');

const signUpUserSchema = new mongoose.Schema({
    firstName:String,
    lastName: String,
    email: String,
    password: String,
    confirmPassword: String,
    phone: Number
})

const signUpUser = mongoose.model('signUpUser', signUpUserSchema)
module.exports = signUpUser;