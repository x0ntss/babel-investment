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

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      return res.json({
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
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('❌ Login API Error:', error);

    return res.status(500).json({
      error: true,
      message: 'Server error',
      debug: {
        errorMessage: error.message,
        errorStack: error.stack,
        env: {
          JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
          MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Missing',
          NODE_ENV: process.env.NODE_ENV,
        },
      },
    });
  }
}
