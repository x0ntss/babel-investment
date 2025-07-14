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
    
    // Sum all completed reward transactions
    const totalRewards = user.transactions
      .filter(tx => tx.type === 'reward' && tx.status === 'completed')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    // Optionally, subtract total withdrawn if you want to limit to unwithdrawn rewards only
    // For now, just use totalRewards
    const maxWithdrawalAmount = Math.max(0, totalRewards);
    
    res.json({
      maxWithdrawalAmount: Number(maxWithdrawalAmount.toFixed(2)),
      currentBalance: Number(user.balance.toFixed(2)),
      vipCapital: Number(user.vipCapital.toFixed(2)),
      withdrawalTaxPercentage: 15, // 15% tax
      minWithdrawalAmount: 10, // Minimum withdrawal amount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 