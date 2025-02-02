import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
    
    const token = req.cookies.jwt;
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const { mId, uname } = decoded;
       
        if (req.headers.mid && req.headers.uname) {
            
            if (mId === req.headers.mid && uname === req.headers.uname) {
                return next();
            } else {
                return res.status(403).json({ error: 'Forbidden: Invalid user data' });
            }
        } else {
            return res.status(400).json({ error: 'mId and uname must be sent in headers' });
        }
    } catch (err) {
        console.error('Token Verification Error:', err);  // Log the error
        return res.status(403).json({ error: 'Invalid token.' });
    }
};

export default authenticate;

