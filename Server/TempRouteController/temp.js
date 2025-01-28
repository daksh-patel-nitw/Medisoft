import express from 'express';
import jwt from 'jsonwebtoken';


const app = express();
const SECRET_KEY = 'your_secret_key'; // Keep this secret and secure


// Dummy user data for demonstration
const users = [
  { id: 1, username: 'admin', password: 'password123', role: 'admin' },
  { id: 2, username: 'user', password: 'userpass', role: 'user' },
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the dummy database
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: '1h' } // Token valid for 1 hour
  );

  res.json({
    message: 'Login successful',
    token,
  });
});




