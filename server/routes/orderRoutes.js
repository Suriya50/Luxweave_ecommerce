const express = require('express');
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/auth');
const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.put('/:id', protect, admin, updateOrderStatus); // admin only

module.exports = router;