import timingModel from "../models/timings"
import mongoose from "mongoose";

export const getTimings=(data)=>{
    return (new Date(Number(data))).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric'  })
}

export const getDocTimings=async(did,date)=>{
    const data=timingModel.find({did:did,date:date});
    if (!data || data.length === 0) {
        return null;
    }
    return data;
}


export const addTimings = async (date, did, time, count) => {
    const session = await mongoose.startSession(); // Start a transaction session
    session.startTransaction();

    try {
        const data = await timingModel.findOne({ did, date, timing: time }).session(session);
        
        if (data) {
            data.count = count;
            await data.save({ session });
        } else {
            const newTiming = new timingModel({ did, date, timing: time, count });
            await newTiming.save({ session });
        }

        await session.commitTransaction(); // Commit the transaction
        session.endSession(); // End session
        return data;
    } catch (error) {
        await session.abortTransaction(); // Rollback on failure
        session.endSession();
        console.error("Error updating timings:", error);
        throw error;
    }
};

