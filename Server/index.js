import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import labRoutes from './routes/laboratoryRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes';

// Load environment variables
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

// Enable all CORS requests
app.use(cors());

// Use the APIs
app.use('/api', authRoutes);
app.use('/pharmacy', medicineRoutes);
app.use('/lab', labRoutes);
app.use('/room', roomRoutes);
app.use('/member', memberRoutes);
app.use('/appointment', appointmentRoutes);


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
