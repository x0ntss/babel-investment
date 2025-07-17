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

    // Get the user's direct team members
    const user = await User.findById(req.user._id).populate('teamMembers', 'username balance registrationDate transactions');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const teamMembers = user.teamMembers || [];
    const totalTeamBalance = teamMembers.reduce((sum, m) => sum + (m.balance || 0), 0);
    const totalMembers = teamMembers.length;

    // Special members: those who have at least one deposit transaction
    const specialMembers = teamMembers
      .filter(m => Array.isArray(m.transactions) && m.transactions.some(t => t.type === 'deposit' && t.status === 'completed'))
      .map(m => ({
        _id: m._id,
        username: m.username,
        balance: m.balance || 0,
        registrationDate: m.registrationDate ? m.registrationDate.toISOString().slice(0, 10) : '',
      }));

    // Regular members: those who have no deposit transactions
    const regularMembers = teamMembers
      .filter(m => !Array.isArray(m.transactions) || !m.transactions.some(t => t.type === 'deposit' && t.status === 'completed'))
      .map(m => ({
        _id: m._id,
        username: m.username,
        balance: m.balance || 0,
        registrationDate: m.registrationDate ? m.registrationDate.toISOString().slice(0, 10) : '',
      }));

    res.json({
      totalTeamBalance,
      totalMembers,
      specialMembers,
      regularMembers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 