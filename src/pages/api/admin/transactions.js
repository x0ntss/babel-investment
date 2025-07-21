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

    // Get all users with their transactions
    let allTransactions = [];
    const { userId } = req.query;
    if (userId) {
      const user = await User.findById(userId).select('username email transactions');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      allTransactions = user.transactions.map(transaction => ({
        ...transaction.toObject(),
        username: user.username,
        email: user.email,
        userId: user._id
      }));
    } else {
      const users = await User.find({}).select('username email transactions').sort({ createdAt: -1 });
      users.forEach(user => {
        user.transactions.forEach(transaction => {
          allTransactions.push({
            ...transaction.toObject(),
            username: user.username,
            email: user.email,
            userId: user._id
          });
        });
      });
    }
    // Sort by creation date (newest first)
    allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 