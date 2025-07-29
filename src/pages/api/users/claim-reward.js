import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import { protect } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Authenticate user
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

    if (!user.lastTaskDate || user.lastTaskDate < today) {
      return res.status(400).json({ message: 'You must complete today\'s task before claiming the reward.' });
    }

    if (user.lastRewardDate && user.lastRewardDate >= today) {
      return res.status(400).json({ message: 'Reward already claimed for today.' });
    }

    // VIP level thresholds and reward ranges
    const vipLevels = [
      { level: 12, minBalance: 30000, rewardRange: [300, 600] },
      { level: 11, minBalance: 15000, rewardRange: [150, 300] },
      { level: 10, minBalance: 8000, rewardRange: [80, 160] },
      { level: 9,  minBalance: 5000, rewardRange: [50, 100] },
      { level: 8,  minBalance: 3000, rewardRange: [30, 60] },
      { level: 7,  minBalance: 1500, rewardRange: [15, 30] },
      { level: 6,  minBalance: 800, rewardRange: [8, 16] },
      { level: 5,  minBalance: 500, rewardRange: [5, 10] },
      { level: 4,  minBalance: 300, rewardRange: [3, 6] },
      { level: 3,  minBalance: 150, rewardRange: [1.5, 3] },
      { level: 2,  minBalance: 50, rewardRange: [0.5, 1] },
      { level: 1,  minBalance: 25, rewardRange: [0.25, 0.5] },
    ];

    // Determine VIP level based on balance
    const vip = vipLevels.find(v => user.balance >= v.minBalance);
    if (!vip) {
      return res.status(400).json({ message: 'Insufficient balance for VIP level. Minimum 25 USDT required.' });
    }

    const [min, max] = vip.rewardRange;
    const bonusAmount = parseFloat((Math.random() * (max - min) + min).toFixed(2));

    // Update user data
    user.balance += bonusAmount;
    user.completedTasks = (user.completedTasks || 0) + 1;
    user.lastRewardDate = now;
    user.lastRewardAmount = bonusAmount;

    user.transactions.push({
      type: 'reward',
      amount: bonusAmount,
      status: 'completed',
      createdAt: now
    });

    await user.save();

    res.json({
      message: `VIP ${vip.level} reward claimed successfully!`,
      vipLevel: vip.level,
      bonusEarned: bonusAmount.toFixed(2),
      newBalance: Number(user.balance).toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
