import timingModel from "../models/timings.js"
import mongoose from "mongoose";

// export const getTimings=(data)=>{
//     return (new Date(Number(data))).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric'  })
// }

export const getDocTimings=async(did,date)=>{
    
    const data=timingModel.find({did:did,date:date});
    
    if (!data || data.length === 0) {
        return null;
    }
    return data;
}


export const addTimings = async (date, did, time, count, session) => {
  
    try {
        const data = await timingModel.findOne({ did, date, timing: time }).session(session);
        
        if (data) {
            data.count = count;
            await data.save({ session });
        } else {
            const newTiming = new timingModel({ did, date, timing: time, count });
            await newTiming.save({ session });
        }

        return true;
    } catch (error) {
        console.error("Error updating timings:", error);
        throw error;
    }
};

export const removeTimings =async (date, did, time,session) => {
    try {
        const data = await timingModel.findOne({ did, date, timing: time }).session(session);
        
        if (data) {
            data.count = data.count + 1;
            await data.save({ session });
        }

        return true;
    } catch (error) {
        console.error("Error updating timings:", error);
        throw error;
    }
}