import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String },
  text: { type: String },
  order: { type: Number, default: 0 },
  autoplay: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
}, {
  timestamps: true // adds createdAt and updatedAt
});

export default mongoose.models.Banner || mongoose.model('Banner', bannerSchema); 