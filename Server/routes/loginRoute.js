const express = require('express');
const router = express.Router();
const l_Data=require('../models/login')
const bodyParser = require("body-parser");
const {generateBill}=require('./helper')

router.post('/login', async (req, res) => {
    const { uname, password } = req.body;
    console.log(req.body);
    const user = await l_Data.findOne({ uname });
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    res.status(200).json(user);
  });
  


module.exports = router;
