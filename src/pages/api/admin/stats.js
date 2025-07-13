import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import { verifyAdminJWT } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Apply admin authentication middleware
    await new Promise((resolve, reject) => {
      verifyAdminJWT(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Get statistics
    const totalUsers = await User.countDocuments();
    const totalBalance = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);
    const totalTasks = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$completedTasks' } } }
    ]);

    const stats = {
      totalUsers,
      totalBalance: totalBalance[0]?.total || 0,
      totalTasks: totalTasks[0]?.total || 0,
    };
    
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 