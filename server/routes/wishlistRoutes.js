const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
} = require('../controllers/wishlistController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlist);
router.delete('/:id', protect, removeWishlistItem);

module.exports = router;