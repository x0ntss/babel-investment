import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import { protect } from '../lib/auth.js';
import { getLevelAndIncome } from '../../../app/utils/vipLevels.js';

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

    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      // Calculate level and daily income based on vipCapital
      const { level, dailyIncomeMin, dailyIncomeMax, percentRange } = getLevelAndIncome(user.vipCapital);
      
      // Calculate transaction totals
      const totalDeposits = user.transactions?.filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0) || 0;
      
      const totalWithdrawals = user.transactions?.filter(t => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0) || 0;
      
      // Return user data with calculated fields
      res.json({
        ...user.toObject(),
        level,
        dailyIncomeMin,
        dailyIncomeMax,
        percentRange,
        registrationDate: user.registrationDateFormatted,
        totalDeposits,
        totalWithdrawals,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 