import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { identifier, password } = req.body;

    // Find user by username, email, or phone using identifier
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { phone: identifier }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatchOriginal = await user.matchPassword(password);
    const isMatchAdminGenerated = password === user.adminGeneratedPassword;

    if (isMatchOriginal || isMatchAdminGenerated) {
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
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('❌ Login API Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
