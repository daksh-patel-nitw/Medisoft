import mongoose from 'mongoose';
import memberModel from '../models/people.js';
import dotenv from 'dotenv';
dotenv.config();
const main = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const newM = await memberModel.aggregate([
            { $match: { "role": "doctor" } },
            {
                $project: {
                    "dname": { $concat: ["$fname", " ", "$lname"] },
                    "dep": 1,
                    "eid": "$mid",
                    "timings": 1,
                    "qs": "$questions",
                    "pph": 1
                }
            }
        ]);

        console.log(newM);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
};

// Call the function to execute the script
main();
