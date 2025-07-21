import dbConnect from '../../../lib/db.js';
import User from '../../../lib/User.js';
import { verifyAdminJWT } from '../../../lib/auth.js';

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

    const { userId } = req.query;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 