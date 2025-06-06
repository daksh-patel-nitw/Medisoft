import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import loginModel from '../models/login.js';
import dotenv from 'dotenv';
import { SignUp} from '../utils/authData.js';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

//login
export const validateUser = async (req, res) => {
  try {
      const { uname, password } = req.body;

      // Find user by username
      const user = await loginModel.findOne({ uname });
      if (!user) {
          return res.status(401).json({ message: "User not found" });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create access token
      const accessToken = jwt.sign({ name: user.name, id:user.mid }, SECRET_KEY, { expiresIn: '1h' });

      // Create refresh token
      const refreshToken = jwt.sign({ mid:user.mid, name: user.name }, REFRESH_SECRET_KEY, { expiresIn: '12h' });

      // Store refresh token in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
          maxage: 43200000,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict', 
      });
      
      res.cookie('jwt',accessToken,{
            maxage: 10800000,
            httpOnly:true,
            sameSite:'strict',
            secure: process.env.NODE_ENV === 'production',
      })
      
      // Send access token in response body
      return res.status(200).json({
          message: "Login successful",
          user: {
              name: user.name,
              panel: user.panel,
              mid: user.mid,
          },
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred" });
  }
};

//signup
export const makeNewLogin = async (req, res) => {
    try {
        const {mid, name, panel, dep, mobile}=req.body;
        console.log(req.body);
        // mid, name, role, password, security_phrase, dep
        const newLogin=await SignUp(mid, name, panel, mobile, mobile, dep);

        console.log(newLogin);
        return res.status(201).json({ message: "User created successfully", newLogin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while creating the login" });
    }
};

//refreshToken
export const refreshToken = async (req, res) => {
  console.log(req.cookies);
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    

    const newAccessToken = jwt.sign(
      { mId: decoded.mId, uname: decoded.uname }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// Controller function for deleting a login record by id
export const deleteLogin = async (req, res) => {
    try {
        
        const mId = req.params.id; 
        
        // restrict deletion of own account and other account.

        
        const deletedUser = await loginModel.findOneAndDelete({ mId: mId });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while deleting the user' });
    }
};

