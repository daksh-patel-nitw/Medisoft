const express = require('express');
const router = express.Router();
const room = require('../models/room');
const r_C = require('../models/room_category');
const bodyParser = require("body-parser");
const {generateBill}=require('./helper')

//------Book new Room Category
router.post("/newroomcategory",async (req,res)=>{
    const body = req.body;
    console.log(req.body);
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
    res.send(newRC);
})

//------Send all Room Categories
router.get('/roomcategory',async (req,res)=>{
    try {
        const rc = await r_C.find({},'type price');
        //   console.log("Route is working");
        res.send(rc);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    } 
})

//------Make new Room
router.post('/newroom',async (req,res)=>{
    const body =req.body;

    const newR=new room({
        type:body.type,
        dep:body.dep,
        floor:body.floor,
        room_no:body.room_no,
        price:body.price
    })
    await newR.save();
    res.send(newR);
})

//------Get All Rooms
router.get('/rooms',async (req,res)=>{
    try {
        const rooms = await room.find({occupied:'No'}, 'type dep floor room_no price occupied');
        res.send(rooms);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    } 
})

router.get('/roomcount',async (req,res)=>{
    try {
        const count = await room.countDocuments();
        console.log(count);
        res.send({ count });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    } 
});

//Book Room 
router.post('/admitroom',async(req,res)=>{
    const body=req.body;
    console.log("This is room:",body)
    const updatedRoom = await room.findOneAndUpdate(
    { room_no: body.room,dep:body.dep },
    { mobile:body.mobile,did: body.did, pid: body.pid,aid:body._id, pname: body.pname, occupied: "Yes" },
    { new: true ,useFindAndModify: false });
    res.send("Successful."+updatedRoom);
})

//Free or discharge room
router.get('/dischargeipd/:room/:dep',async(req,res)=>{
    const par=req.params;
    const updatedRoom = await room.findOneAndUpdate(
        { room_no: par.room,dep: par.dep },
        { did:"", pid:"", pname:"",mobile:"", occupied: "No" },
        { new: true , useFindAndModify: false });
        res.send(updatedRoom);
        //***********************************************ADD BILL
});

//Get all occupied rooms
router.get('/occupiedroom',async(req,res)=>{
    try {
        const rooms = await room.find({occupied:"Yes"});
        //   console.log("Route is working");
        res.send(rooms);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    } 
});

module.exports = router;