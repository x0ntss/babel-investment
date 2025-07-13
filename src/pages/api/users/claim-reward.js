import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import { protect } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!user.lastTaskDate || user.lastTaskDate < today) {
      return res.status(400).json({ message: 'You must complete today\'s task before claiming the reward.' });
    }
    
    if (user.lastRewardDate && user.lastRewardDate >= today) {
      return res.status(400).json({ message: 'Reward already claimed for today.' });
    }
    
    // Generate random bonus (1% to 2%)
    const bonusPercentage = Math.random() * (0.02 - 0.01) + 0.01;
    const bonusAmount = user.balance * bonusPercentage;
    user.balance += bonusAmount;
    user.completedTasks = (user.completedTasks || 0) + 1;
    user.lastRewardDate = now;
    user.lastRewardAmount = bonusAmount;
    await user.save();
    
    res.json({
      message: 'Daily reward claimed successfully!',
      newBalance: Number(user.balance).toFixed(2),
      bonusEarned: bonusAmount.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 