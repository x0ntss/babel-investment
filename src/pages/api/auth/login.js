import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        referralCode: user.referralCode,
        completedTasks: user.completedTasks,
        lastTaskDate: user.lastTaskDate,
        lastRewardDate: user.lastRewardDate,
        lastRewardAmount: user.lastRewardAmount,
        walletAddress: user.walletAddress,
        vipCapital: user.vipCapital,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('❌ Login API Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Environment check - JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');
    console.error('Environment check - MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Missing');
res.status(500).json({
  error: true,
  message: 'Login API Error',
  env: process.env
});  }
} 
