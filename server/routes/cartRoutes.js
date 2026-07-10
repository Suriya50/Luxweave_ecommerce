const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeCartItem); // expects cart item ID (sub‑document)
router.delete('/', protect, clearCart);

module.exports = router;