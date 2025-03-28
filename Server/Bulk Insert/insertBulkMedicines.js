import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        insertMedicineBulkData();
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);  // Exit the process with failure
    });

// Medicine Model (Assuming it's already created)
import Medicine from '../models/medicineInventory.js'; // Adjust path if needed

// Dummy Medicines Data
const bulkMedicines = Array.from({ length: 50 }, (_, i) => ({
    name: `Medicine ${i + 1}`,
    price: (Math.random() * 20).toFixed(2), // Random price between 0-20
    ps: Math.floor(Math.random() * 50) + 1, // Random pack size 1-50
    ps_c: Math.floor(Math.random() * 10),  // Random ps_c value
    ps_u: Math.floor(Math.random() * 5) + 1, // Random ps_u value 1-5
    t: ["Pain Reliever", "Antibiotic", "Antiseptic", "Anti-inflammatory", "Fever Reducer"][
        Math.floor(Math.random() * 5)
    ], // Random type
}));

// Insert data into MongoDB
export const insertMedicineBulkData = async () => {
    try {
        await Medicine.insertMany(bulkMedicines);
        console.log('✅ Bulk Insert Successful');
        mongoose.connection.close(); // Close the connection after insert
    } catch (error) {
        console.error('❌ Error inserting data:', error);
    }
};
