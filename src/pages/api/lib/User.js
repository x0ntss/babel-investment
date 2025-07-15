import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['deposit', 'withdrawal', 'reward'], required: true },
  amount: { type: Number, required: true },
  proofImage: { type: String }, // For deposit only
  status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  code: { type: String }, // Referral code used during registration
  balance: { type: Number, default: 0 }, // Admin-controlled only
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  transactions: [transactionSchema],
  referralCode: { type: String, unique: true }, // Auto-generated unique code
  completedTasks: { type: Number, default: 0 },
  lastTaskDate: { type: Date },
  lastRewardDate: { type: Date }, // Track the date when reward was last claimed
  lastRewardAmount: { type: Number, default: 0 }, // Amount of last reward claimed
  walletAddress: { type: String, default: null },
  vipCapital: { type: Number, default: 0 }, // Frozen VIP investment amount
  registrationDate: { type: Date, default: Date.now }, // Registration date
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate referral code before saving for new users
userSchema.pre('save', function(next) {
  if (this.isNew && !this.referralCode) {
    this.referralCode = uuidv4().slice(0, 8); // Simple unique code
  }
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema); 