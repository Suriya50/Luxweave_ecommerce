const Wishlist = require('../models/Wishlist');

// Helper: get or create wishlist
const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await getWishlist(req.user._id);
    res.json(wishlist.products); // returns array of product objects
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    await wishlist.populate('products');
    res.json(wishlist.products); // returns array of product objects
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
exports.removeWishlistItem = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== req.params.id
    );
    await wishlist.save();
    await wishlist.populate('products');
    res.json(wishlist.products); // returns array of product objects
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};