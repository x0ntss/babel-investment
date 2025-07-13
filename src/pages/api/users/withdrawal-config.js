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
    
    const vipCapital = user.vipCapital || 0;
    const balance = user.balance || 0;
    const maxWithdrawalAmount = Math.max(0, balance - vipCapital);
    
    res.json({
      maxWithdrawalAmount: Number(maxWithdrawalAmount.toFixed(2)),
      currentBalance: Number(balance.toFixed(2)),
      vipCapital: Number(vipCapital.toFixed(2)),
      withdrawalTaxPercentage: 15, // 15% tax
      minWithdrawalAmount: 10, // Minimum withdrawal amount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 