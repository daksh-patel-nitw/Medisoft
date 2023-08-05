const room = require('../models/room');
const r_C = require('../models/room_category');
const {generateBill}=require('./billAndHelper')
const pdf = require('html-pdf');

//------Book new Room Category
exports.newroomcategory=async(body)=>{
    console.log(body);
    const newRC= new r_C({
        type:body.type,
        beds:body.beds,
        price:body.price,
        sofa:body.sofa,
        tv:body.tv,
        refrigator:body.refrigator,
        bathroom:body.bathroom,
        other:body.other
    });

    await newRC.save();
    return(newRC);
};

//------Send all Room Categories
exports.roomcategory=async ()=>{
    try {
        const rc = await r_C.find({},'type price');
        //   console.log("Route is working");
        return(rc);
    } catch (err) {
        console.log(err);
        return(err);
    } 
}

//------Make new Room
exports.newroom=async (body)=>{
    const newR=new room({
        type:body.type,
        dep:body.dep,
        floor:body.floor,
        room_no:body.room_no,
        price:body.price
    })
    await newR.save();
    return(newR);
};

//------Get All Rooms
exports.getRooms=async(value)=>{
    try {
        const rooms = value === 'No'
        ? await room.find({ occupied: 'No' }, 'type dep floor room_no price occupied')
        : await room.find({ occupied: 'Yes' });
        return(rooms);
    } catch (err) {
        console.log(err);
       return(err);
    } 
};

//number of rooms
exports.roomcount=async (req,res)=>{
    try {
        const count = await room.countDocuments();
        console.log(count);
        return({ count });
    } catch (err) {
        console.log(err);
        return(err);
    } 
};

//Book Room 
exports.admitroom=async(body)=>{
    console.log("This is room:",body)
    const updatedRoom = await room.findOneAndUpdate(
    { room_no: body.room,dep:body.dep },
    { mobile:body.mobile,did: body.did, pid: body.pid,aid:body._id, pname: body.pname, occupied: "Yes" },
    { new: true ,useFindAndModify: false });
    return("Successful."+updatedRoom);
};

//Free or discharge room
exports.dischargeipd=async(room,dep)=>{
    const par=req.params;
    const updatedRoom = await room.findOneAndUpdate(
        { room_no: room,dep: dep },
        { did:"", pid:"", pname:"",mobile:"", occupied: "No" },
        { new: true , useFindAndModify: false });
        return(updatedRoom);
        //***********************************************ADD BILL
};

module.exports = router;