import dbConnect from '../../../../lib/db.js';
import User from '../../../../lib/User.js';
import { verifyAdminJWT } from '../../../../lib/auth.js';

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

    const { userId, transactionId } = req.query;
    const { status, reason } = req.body;

    if (!status || !['completed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "completed" or "rejected"' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transaction = user.transactions.id(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: `Transaction already ${transaction.status}` });
    }

    if (status === 'completed') {
      if (transaction.type === 'deposit') {
        // Check if this is the first completed deposit EXCLUDING current transaction
        const isFirstDeposit = user.transactions.filter(t =>
          t._id.toString() !== transaction._id.toString() &&
          t.type === 'deposit' &&
          t.status === 'completed'
        ).length === 0;

        // Process referral bonus before marking this transaction as completed
        if (isFirstDeposit && user.code) {
          const referrer = await User.findOne({ referralCode: user.code });
          if (referrer) {
            const bonus = transaction.amount * 0.10;
            referrer.balance += bonus;
            await referrer.save();
            console.log(`✅ Referral bonus of ${bonus} added to ${referrer.username}`);
          }
        }

        // Credit the user's deposit
        user.balance += transaction.amount;

        // Set vipCapital to the correct VIP level minimum if balance qualifies
        const LEVELS = [
          { level: 12, min: 30000, max: Infinity },
          { level: 11, min: 15000, max: 29999.99 },
          { level: 10, min: 8000, max: 14999.99 },
          { level: 9, min: 5000, max: 7999.99 },
          { level: 8, min: 3000, max: 4999.99 },
          { level: 7, min: 1500, max: 2999.99 },
          { level: 6, min: 800, max: 1499.99 },
          { level: 5, min: 500, max: 799.99 },
          { level: 4, min: 300, max: 499.99 },
          { level: 3, min: 150, max: 299.99 },
          { level: 2, min: 50, max: 149.99 },
          { level: 1, min: 25, max: 49.99 },
        ];
        let matchedLevel = LEVELS.find(lvl => user.balance >= lvl.min && user.balance <= lvl.max);
        if (matchedLevel) {
          user.vipCapital = matchedLevel.min;
        } else {
          user.vipCapital = 0;
        }
      }
      if (transaction.type === 'withdrawal') {
        // Check for valid amount and sufficient balance
        if (user.balance < transaction.amount) {
          return res.status(400).json({ message: 'Insufficient balance for withdrawal.' });
        }
        user.balance -= transaction.amount;
      }
    }

    if (status === 'rejected') {
      transaction.rejectionReason = reason || 'No reason provided';
    }

    // Set transaction status
    transaction.status = status;

    await user.save();

    res.json({
      message: `Transaction ${transaction.type} ${status} successfully`,
      transaction
    });

  } catch (error) {
    console.error('❌ reviewTransaction error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
} 