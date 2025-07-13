import jwt from 'jsonwebtoken';
import User from './User.js';

// Environment variable validation
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
}

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  // In a real application, you'd likely have an 'isAdmin' field on the User model
  // For this example, let's assume admin credentials are hardcoded or a specific user ID
  if (req.body.password === process.env.ADMIN_PASSWORD && req.body.email === process.env.ADMIN_EMAIL) { // Or check a dedicated `isAdmin` field
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export const verifyAdminJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.admin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}; 