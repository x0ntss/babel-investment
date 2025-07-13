import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import { protect } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Apply authentication middleware
    await new Promise((resolve, reject) => {
      protect(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { email, phone, password, oldPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (email) {
      // Check if email is already taken
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }

    if (phone) {
      user.phone = phone;
    }

    if (password) {
      // Verify old password
      if (!oldPassword || !(await user.matchPassword(oldPassword))) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      balance: updatedUser.balance,
      referralCode: updatedUser.referralCode,
      completedTasks: updatedUser.completedTasks,
      lastTaskDate: updatedUser.lastTaskDate,
      lastRewardDate: updatedUser.lastRewardDate,
      lastRewardAmount: updatedUser.lastRewardAmount,
      walletAddress: updatedUser.walletAddress,
      vipCapital: updatedUser.vipCapital,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 