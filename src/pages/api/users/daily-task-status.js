import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import { protect } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskCompleted = user.lastTaskDate && user.lastTaskDate >= today;
    const rewardClaimed = user.lastRewardDate && user.lastRewardDate >= today;
    
    res.json({
      taskCompleted,
      rewardClaimed,
      lastRewardAmount: user.lastRewardAmount || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 