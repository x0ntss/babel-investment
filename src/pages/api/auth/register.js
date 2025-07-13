import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { username, email, phone, password, code } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      phone,
      password,
      code
    });

    if (user) {
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        referralCode: user.referralCode,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 