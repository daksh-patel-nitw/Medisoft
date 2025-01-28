import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import loginModel from '../models/login.js';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

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
      const accessToken = jwt.sign({ uname: user.uname, mId:user.mId }, SECRET_KEY, { expiresIn: '1h' });

      // Create refresh token
      const refreshToken = jwt.sign({ mId:user.mId, uname: user.uname }, REFRESH_SECRET_KEY, { expiresIn: '7d' });

      // Store refresh token in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === 'production', // set true for https
          sameSite: 'strict', 
      });

      // Send access token in response body
      return res.status(200).json({
          message: "Login successful",
          accessToken,
          user: {
              uname: user.uname,
              type: user.type,
          },
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "An error occurred" });
  }
};

export const makeNewLogin = async (req, res) => {
    try {
        
        const { mId, uname,type="none", dep="",password,security_phrase } = req.body;

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const hashed_security_phrase = await bcrypt.hash(security_phrase, saltRounds);

        // Create a new login record
        const newLogin = new loginModel({
            mId,
            uname,
            password: hashedPassword,
            type,
            dep,
            security_phrase:hashed_security_phrase
        });

        // Save to the database
        await newLogin.save();

        console.log(newLogin);
        return res.status(201).json({ message: "User created successfully", newLogin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while creating the login" });
    }
};


export const refreshToken = async (req, res) => {
  console.log(req.cookies);
  const refreshToken = req.cookies.refreshtoken;

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

