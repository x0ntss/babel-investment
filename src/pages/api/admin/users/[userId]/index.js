import dbConnect from '../../../lib/db.js';
import User from '../../../lib/User.js';
import { verifyAdminJWT } from '../../../lib/auth.js';

// Inline password generator
function generatePatternPassword() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  // Randomly pick a pattern type 0 or 1
  const patternType = Math.floor(Math.random() * 2);

  if (patternType === 0) {
    // Pattern 1: repeated letters + repeated numbers (length 6 to 8)
    const letter = letters.charAt(Math.floor(Math.random() * letters.length));
    const number = numbers.charAt(Math.floor(Math.random() * numbers.length));

    // Ensure total length between 6 and 8
    // For example, letterRepeat + numberRepeat >= 6 and <= 8
    let letterRepeat = Math.floor(Math.random() * 3) + 2; // 2 to 4
    let numberRepeat = Math.floor(Math.random() * 3) + 2; // 2 to 4

    // Adjust if sum < 6
    while (letterRepeat + numberRepeat < 6) {
      // Increase randomly letterRepeat or numberRepeat (max 4)
      if (letterRepeat < 4 && (Math.random() < 0.5 || numberRepeat === 4)) {
        letterRepeat++;
      } else if (numberRepeat < 4) {
        numberRepeat++;
      }
    }

    return letter.repeat(letterRepeat) + number.repeat(numberRepeat);
  } else {
    // Pattern 2: alternating letter and number (length 6 fixed)
    let pwd = '';
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
      } else {
        pwd += letters.charAt(Math.floor(Math.random() * letters.length));
      }
    }
    return pwd;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Verify admin access
    await new Promise((resolve, reject) => {
      verifyAdminJWT(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { userId } = req.query;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only generate once
    if (!user.adminGeneratedPassword) {
      user.adminGeneratedPassword = generatePatternPassword(8); // or use 6
      await user.save();
    }

    const userObj = user.toObject();
    userObj.adminPassword = user.adminGeneratedPassword;

    res.json(userObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
