import dbConnect from '../lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { email, password } = req.body;

    // Check admin credentials
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Generate admin JWT token
      const token = jwt.sign(
        { 
          admin: true, 
          email: process.env.ADMIN_EMAIL 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
      );

      res.json({
        token,
        message: 'Admin login successful'
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 