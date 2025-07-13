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
    
    if (user.lastTaskDate && user.lastTaskDate >= today) {
      return res.status(400).json({ message: 'Task already completed for today.' });
    }
    
    user.lastTaskDate = now;
    await user.save();
    
    res.json({ message: 'Task marked as completed for today.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 