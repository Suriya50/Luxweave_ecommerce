const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const cloudinary = require('./config/cloudinary');
const fs = require('fs');
const path = require('path');

dotenv.config();

const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const products = await Product.find({});
  let uploaded = 0;
  let totalImages = 0;

  for (const product of products) {
    if (!product.images || product.images.length === 0) continue;

    const newImages = [];
    for (const img of product.images) {
      totalImages++;
      
      // Already on Cloudinary
      if (img.includes('cloudinary.com')) {
        newImages.push(img);
        console.log(`⏭️ Already on Cloudinary: ${img}`);
        continue;
      }

      // Extract filename from full URL or path
      let filename = img;
      
      // If it's a full URL like http://localhost:5000/uploads/123.jpg
      if (filename.includes('localhost:5000/uploads/')) {
        filename = filename.split('/uploads/')[1];
      }
      // If it's a path like /uploads/123.jpg
      else if (filename.startsWith('/uploads/')) {
        filename = filename.replace('/uploads/', '');
      }
      // If it's just a filename
      else {
        // Keep as is - assume it's just the filename
      }

      const localPath = path.join(__dirname, 'uploads', filename);

      if (!fs.existsSync(localPath)) {
        console.log(`⚠️ File not found: ${localPath}`);
        newImages.push(img);
        continue;
      }

      try {
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'luxweave/products',
        });
        newImages.push(result.secure_url);
        console.log(`✅ Uploaded: ${result.secure_url}`);
        uploaded++;
      } catch (err) {
        console.error(`❌ Error uploading ${img}:`, err.message);
        newImages.push(img);
      }
    }

    if (newImages.join() !== product.images.join()) {
      product.images = newImages;
      await product.save();
      console.log(`📝 Updated product: ${product.name}`);
    }
  }

  console.log(`✅ Done. ${uploaded} out of ${totalImages} images uploaded to Cloudinary.`);
  process.exit(0);
};

migrate().catch(err => { console.error(err); process.exit(1); });