const { mongoose, ObjectId } = require('mongoose');
const uploads = require('../models/uploads');
const gfs = require('../index')

const saveUploads = 
    async (req, res) => {
        try {

          const id =  req.body.userId;
          const file =  req.body.fileName;
          const imageUrl = req.file;
          
      
          const upload = {
            userId: id,
            fileName:file,
            blob: imageUrl
          }
          
          const newUpload = new uploads({...upload})
          const savedOrder = await newUpload.save();
        //   res.json({ file: req.file });

          res.send({ success: true, data: "success" });
        } catch (error) {
          console.error('Error uploading image or sending to WhatsApp:', error);
          res.status(500).send({ success: false, error: error.message });
        }
      }

      const getImage =   async (req, res) => {
        try {
          const file = await gfs.files.findOne({ fileName: req.params.fileName });
          if (!file || file.length === 0) {
            return res.status(404).send('File not found');
          }
          const readstream = gfs.createReadStream(file.fileName);
          readstream.pipe(res);
        } catch (error) {
          console.error('Error retrieving image:', error);
          res.status(500).send('Error retrieving image');
        }
      }
 
module.exports = {saveUploads, getImage};