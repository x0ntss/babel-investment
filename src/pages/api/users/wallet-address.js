import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import { protect } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
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

    const { walletAddress } = req.body;
    
    // TRON address validation
    if (!walletAddress || !/^T[a-zA-Z0-9]{33}$/.test(walletAddress)) {
      return res.status(400).json({ message: 'Invalid TRON wallet address. Must start with T and be 34 characters.' });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.walletAddress) {
      return res.status(400).json({ message: 'Wallet address cannot be changed once set.' });
    }
    
    user.walletAddress = walletAddress;
    await user.save();
    
    res.json({ message: 'Wallet address set successfully', walletAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 