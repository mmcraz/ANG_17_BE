const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
        fileName:String,
        blob: Object,
        userId: Number,
})


const uploads = mongoose.model('uploads', UploadSchema)
module.exports = uploads;