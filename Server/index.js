import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { insertData } from './utils/addSetupData.js';

import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import labRoutes from './routes/laboratoryRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import fileUpload from 'express-fileupload';

// Load environment variables
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 1000 * 1024 }, // 1MB
    abortOnLimit: true,
    responseOnLimit: 'File too large',
  }));

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
    .then(() => {
        console.log('Connected to MongoDB')
        insertData();
    })
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

// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

// app.post("/create-checkout-session", async (req, res)=>{
//     try{
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types:["card"],
//             mode:"payment",
//             line_items: req.body.items.map(item => {
//                 return{
//                     price_data:{
//                         currency:"inr",
//                         product_data:{
//                             name: item.name
//                         },
//                         unit_amount: (item.price)*100,

//                     },
//                     quantity: item.quantity
//                 }
//             }),
//             success_url: 'http://127.0.0.1:5173/success',
//             cancel_url: 'http://127.0.0.1:5173/cancel'
//         })

//         res.json({url: session.url})

//     }catch(e){
//         console.error(e);
//      res.status(500).json({error:e.message})
//     }
// })

// Get port from .env (default to 5000 if not set)
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
