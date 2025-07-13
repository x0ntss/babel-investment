import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import { protect } from '../lib/auth.js';

// Helper function to mask email
function maskEmail(email) {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (!domain) return email;
  const maskedName = name.length <= 2 ? name[0] + '*' : name.slice(0, 2) + '*'.repeat(Math.max(0, name.length - 2));
  const domainParts = domain.split('.');
  const maskedDomain = domainParts[0][0] + '*'.repeat(Math.max(0, domainParts[0].length - 1));
  const maskedTLD = domainParts.length > 1 ? domainParts[1][0] + '*'.repeat(Math.max(0, domainParts[1].length - 1)) : '';
  return `${maskedName}@${maskedDomain}.${maskedTLD}`;
}

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

    const user = await User.findById(req.user._id).populate('teamMembers', 'username email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const team = (user.teamMembers || []).map(member => ({
      fullName: member.username,
      email: maskEmail(member.email),
      _id: member._id,
    }));
    
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 