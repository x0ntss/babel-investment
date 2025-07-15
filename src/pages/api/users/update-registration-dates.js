import dbConnect from '../lib/db.js';
import User from '../lib/User.js';
import { protect } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

    // Find all users who don't have a registrationDate set
    const usersWithoutRegistrationDate = await User.find({
      $or: [
        { registrationDate: { $exists: false } },
        { registrationDate: null }
      ]
    });

    console.log(`Found ${usersWithoutRegistrationDate.length} users without registration date`);

    if (usersWithoutRegistrationDate.length === 0) {
      return res.json({ 
        message: 'All users already have registration dates set',
        updatedCount: 0 
      });
    }

    // Set registration date to 2025-07-15 for all users without it
    const defaultRegistrationDate = new Date('2025-07-15');
    
    const updateResult = await User.updateMany(
      {
        $or: [
          { registrationDate: { $exists: false } },
          { registrationDate: null }
        ]
      },
      {
        $set: { registrationDate: defaultRegistrationDate }
      }
    );

    console.log(`Updated ${updateResult.modifiedCount} users with registration date`);

    res.json({
      message: `Successfully updated ${updateResult.modifiedCount} users with registration date`,
      updatedCount: updateResult.modifiedCount,
      defaultDate: defaultRegistrationDate.toISOString()
    });

  } catch (error) {
    console.error('Error updating registration dates:', error);
    res.status(500).json({ message: 'Server error' });
  }
} 