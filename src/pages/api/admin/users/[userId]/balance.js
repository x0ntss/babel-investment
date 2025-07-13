import dbConnect from '../../../lib/db.js';
import User from '../../../lib/User.js';
import { verifyAdminJWT } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
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

    const { userId } = req.query;
    const { action, amount } = req.body;

    if (!action || !amount || !['add', 'subtract'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action or amount' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update balance
    if (action === 'add') {
      user.balance += parseFloat(amount);
    } else if (action === 'subtract') {
      user.balance = Math.max(0, user.balance - parseFloat(amount));
    }

    await user.save();

    res.json({
      message: 'Balance updated successfully',
      newBalance: user.balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 