import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import cookieParser from 'cookie-parser';

// import testRoute from './routes/patientRoutes.js';
// import labMedicine from './routes/lab_medicine.js';
// import room from './routes/roomRoutes.js';
// import doc from './routes/doctorRoutes.js';
// import ap from './routes/appointmentRoutes.js';
// import helper from './routes/helper.js';

// Load environment variables
dotenv.config();

const app = express();

app.use(cookieParser);
app.use(express.json());

// Enable all CORS requests
app.use(cors());

// Use the APIs
app.use('/api', authRoutes);
// app.use('/api', testRoute);
// app.use('/api', labMedicine);
// app.use('/api', room);
// app.use('/api', doc);
// app.use('/api', ap);

// app.use('/api', helper);


// Connecting to mongoose Database using MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);  // Exit the process with failure
    });

// Just for testing purpose
app.get('/', (req, res) => {
    res.status(500);
    res.json({
        message: "Welcome To the REST API",
    });
});

// Get port from .env (default to 5000 if not set)
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
