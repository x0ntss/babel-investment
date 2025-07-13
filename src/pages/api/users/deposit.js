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

    const { amount, proofImage } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Add transaction to user
    user.transactions.push({
      type: 'deposit',
      amount: parseFloat(amount),
      proofImage: proofImage || null,
      status: 'pending'
    });

    await user.save();

    res.json({
      message: 'Deposit request submitted successfully',
      transaction: user.transactions[user.transactions.length - 1]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 