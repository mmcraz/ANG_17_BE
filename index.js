const express = require('express')
const bodyParser = require('body-parser');
const { dbConnection, mongoose } = require('./server');
const cors = require('cors');

const multer = require('multer');
const Grid = require('gridfs-stream');
const axios = require('axios');

const { GridFSBucket } = require('mongodb');

require("dotenv").config();
const { updateData, user, getUsersData } = require('./controllers/updateController');
const { screenCount, mostViewedPage } = require('./controllers/mostViewed');
const { mostClickedActions } = require('./controllers/mostClicked');
const { mapData, getAllMapData } = require('./controllers/mapDataController');
const { saveDeviceData, getAllUserDeviceData } = require('./controllers/deviceDataController');
const { clientData, getUsersByClientName } = require('./controllers/dashboardController');
const { getUserEvents, dateFilter, getweeklyData, getmonthlyData } = require('./controllers/dateController');
const { signUpUser, getUserDetails, verifyRecaptcha } = require('./controllers/signUpController');
const { saveOrders, getOrders, getNewOrders, updateStatus, deleteOrder, permanentDeleteOrder }= require('./controllers/ordersController');
const { saveUploads, getImage } = require('./controllers/uploadsController');

const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(bodyParser.json());
app.use(cors()); 


//Database connection
//dbConnection()



let gfs, bucket;

const initGridFS = async () => {
  try {
    const db = await dbConnection();
    gfs = Grid(db, mongoose.mongo); // Initialize Grid with the db and mongoose.mongo
    gfs.collection('uploads');
    bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    console.log("GridFS initialized successfully");
  } catch (error) {
    console.error('Failed to initialize GridFS:', error);
    process.exit(1); // Exit if initialization fails
  }
};

// Initialize GridFS
initGridFS();

// Create storage engine
const storage = multer.memoryStorage();
const upload = multer({ storage });


//main api 
app.post('/login', user) 
app.post('/signUp', signUpUser)
app.get('/getUser/:userId', getUserDetails)

app.post('/saveOrders', saveOrders)
app.get('/getOrdersList/:userId', getOrders)
app.get('/getNewOrdersList', getNewOrders)
app.put('/updateStatus', updateStatus)

app.delete('/delete/:userId', deleteOrder)
app.delete('/rm/:orderId', permanentDeleteOrder)

app.post('/updateUserEvents/:userId', updateData)  
app.get('/getUsersData', getUsersData)

// Upload endpoint
app.post('/upload', upload.single('image'), saveUploads);

// Serve images
app.get('/image/:filename', getImage);

app.post('/verifyCaptcha', verifyRecaptcha)


//Starting the server
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
 
module.exports = {gfs};