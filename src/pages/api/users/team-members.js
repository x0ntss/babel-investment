import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import { protect } from '../lib/auth.js';

// Helper function to mask username
function maskUsername(username) {
  if (!username) return '';
  if (username.length <= 2) return username[0] + '*';
  return username.slice(0, 2) + '*'.repeat(Math.max(0, username.length - 2));
}

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

    const user = await User.findById(req.user._id).populate('teamMembers', 'username email balance registrationDate');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', user._id);
    console.log('Team members array:', user.teamMembers);
    console.log('Team members length:', user.teamMembers ? user.teamMembers.length : 0);
    
    const team = (user.teamMembers || []).map(member => ({
      _id: member._id,
      username: maskUsername(member.username),
      email: maskEmail(member.email),
      balance: member.balance || 0,
      registrationDate: member.registrationDateFormatted,
    }));
    
    console.log('Processed team data:', team);
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 