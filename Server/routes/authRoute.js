import express from 'express';
import { deleteLogin, validateUser, makeNewLogin, refreshToken } from '../controllers/authController.js';
import authenticate from '../middlewares/authenticate.js'; 

const router = express.Router();

// Route for validating the user login
router.post('/login', validateUser);

// Route for registering a user
router.post('/signup', makeNewLogin);

// Route for refreshing the access token using the refresh token
router.get('/refresh', refreshToken);


// Route for deleting a login by id
router.delete('/deleteLogin/:id', deleteLogin);


router.get('/profile', authenticate, (req, res) => {
    res.status(200).json({
        message: 'Profile information',
     // You can access the authenticated user's data here
    });
});

export default router;


// --------------------------Bill-----------------------------

// router.get('/getBill/:id', async (req, res) => {
//   const allT = await bill.find({pid:req.params.id});
  
//   res.send(allT)
// })
// router.get('/getallBills', async (req, res) => {
//   const allT = await bill.find({status:false});
//   const allT1 = await bill.find({status:true});
//   arr=[[...allT],[...allT1]]
//   res.send(arr)
// })

