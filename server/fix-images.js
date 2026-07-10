const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const fixImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      let changed = false;
      if (product.images && product.images.length > 0) {
        const newImages = product.images.map(img => {
          // If it's already an absolute URL (starts with http), skip
          if (img.startsWith('http')) return img;
          // If it starts with /uploads, make it absolute
          if (img.startsWith('/uploads')) {
            changed = true;
            return `http://localhost:5000${img}`;
          }
          // If it's a relative path without /uploads, add it
          if (!img.startsWith('http') && !img.startsWith('/')) {
            changed = true;
            return `http://localhost:5000/uploads/${img}`;
          }
          return img;
        });
        if (changed) {
          product.images = newImages;
          await product.save();
          updatedCount++;
        }
      }
    }

    console.log(`✅ Updated ${updatedCount} products with absolute image URLs.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixImages();