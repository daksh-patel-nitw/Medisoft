const Express = require('express');
const mongoose = require('mongoose');
const mongoDB = "mongodb://localhost:27017/medisoft";
const testRoute = require('./routes/patientRoutes');
const labMedicine = require('./routes/lab_medicine');
const room = require('./routes/roomRoutes');
const doc = require('./routes/doctorRoutes');
const ap = require('./routes/appointmentRoutes');
const login = require('./routes/loginRoute');
const helper = require('./routes/helper');
const cors = require('cors');
const app = Express();

// Enable all CORS requests
app.use(cors());

//using the apis
app.use('/api', testRoute);
app.use('/api', labMedicine);
app.use('/api', room);
app.use('/api', doc);
app.use('/api', ap);
app.use('/api', login);
app.use('/api', helper);

//mongoose options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  
//connecting to mongoose Database
mongoose.connect(mongoDB,options,(err)=>{
    if(err){
        console.log("Error in connecting",err);
    }
    else{
        console.log("connected to MongoDB");
    }
})

//Just for testing purpose
app.get('/', (req, res) =>
{
    res.status(500);
    res.json({
        message: "Welcome To the rest api",
    });

})


app.listen(5000, () =>
{
    console.log("Server is running");
})