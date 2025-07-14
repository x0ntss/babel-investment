import dbConnect from './lib/db.js';
import Banner from './lib/Banner.js';
import { verifyAdminJWT } from './lib/auth.js';
import { upload } from './lib/upload.js';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (_result) => {
      if (_result instanceof Error) {
        return reject(_result);
      }
      return resolve(_result);
    });
  });
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
      return res.status(200).json(banners);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to fetch banners', error: err.message });
    }
  }

  // Admin-only for POST, PUT, DELETE
  try {
    await runMiddleware(req, res, verifyAdminJWT);
  } catch (err) {
    console.log(err);
    
    return res.status(401).json({ message: 'Not authorized as admin' });
  }

  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res, upload.single('image'));
      const { title, text, order, autoplay, active } = req.body;
      let imageUrl = req.body.imageUrl;
      if (req.file) {
        imageUrl = `/api/uploads/${req.file.filename}`;
      }
      if (!imageUrl) return res.status(400).json({ message: 'Image is required' });
      const banner = new Banner({ imageUrl, title, text, order, autoplay, active });
      await banner.save();
      return res.status(201).json(banner);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to create banner', error: err.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      await runMiddleware(req, res, upload.single('image'));
      const { id, title, text, order, autoplay, active } = req.body;
      let update = { title, text, order, autoplay, active };
      if (req.file) {
        update.imageUrl = `/api/uploads/${req.file.filename}`;
      }
      const banner = await Banner.findByIdAndUpdate(id, update, { new: true });
      if (!banner) return res.status(404).json({ message: 'Banner not found' });
      return res.status(200).json(banner);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to update banner', error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      const banner = await Banner.findByIdAndDelete(id);
      if (!banner) return res.status(404).json({ message: 'Banner not found' });
      // Optionally delete image file
      if (banner.imageUrl && banner.imageUrl.startsWith('/api/uploads/')) {
        const filePath = `src/pages${banner.imageUrl}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(200).json({ message: 'Banner deleted' });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to delete banner', error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 