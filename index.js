const express = require('express')
const bodyParser = require('body-parser');
const { dbConnection } = require('./server');
const cors = require('cors');
require("dotenv").config();
const { updateData, user, getUsersData } = require('./controllers/updateController');
const { screenCount, mostViewedPage } = require('./controllers/mostViewed');
const { mostClickedActions } = require('./controllers/mostClicked');
const { mapData, getAllMapData } = require('./controllers/mapDataController');
const { saveDeviceData, getAllUserDeviceData } = require('./controllers/deviceDataController');
const { clientData, getUsersByClientName } = require('./controllers/dashboardController');
const { getUserEvents, dateFilter, getweeklyData, getmonthlyData } = require('./controllers/dateController');
const { signUpUser } = require('./controllers/signUpController');
const { saveOrders, getOrders, getNewOrders, updateStatus, deleteOrder, permanentDeleteOrder }= require('./controllers/ordersController');

const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(bodyParser.json());
app.use(cors()); 

//Database connection
dbConnection()

//main api 
app.post('/login', user) 
app.post('/signUp', signUpUser)
app.post('/saveOrders', saveOrders)
app.get('/getOrdersList/:userId', getOrders)
app.get('/getNewOrdersList', getNewOrders)
app.put('/updateStatus', updateStatus)

app.delete('/delete/:userId', deleteOrder)
app.delete('/rm/:orderId', permanentDeleteOrder)

app.post('/updateUserEvents/:userId', updateData)  
app.get('/getUsersData', getUsersData)

//admin page charts data collection api
app.get('/screenCount', screenCount)
app.get('/mostViewedPages/:clientName', mostViewedPage)
app.get('/mostClickedActions/:clientName', mostClickedActions)

//new development
app.post('/saveMapData',mapData)
app.get('/getAllMapData/:clientName', getAllMapData)

app.post('/saveDeviceData',saveDeviceData)
app.get('/getAllDeviceData/:clientName', getAllUserDeviceData)
  
app.get('/getAllClients',clientData);
app.get('/getUsersByClientName/:clientName', getUsersByClientName)

//date  
app.get('/getDates/:userId', dateFilter)
app.get('/getUserEvents/:userId/:date', getUserEvents)
app.get('/getWeeklyData/:userId', getweeklyData)
app.get('/getMonthlyData/:userId', getmonthlyData)

//Starting the server
app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});
