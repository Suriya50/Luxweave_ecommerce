const express = require('express');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getPendingCount,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/auth');
const router = express.Router();

// ─── Customer routes ──────────────────────────────────────────
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);               // ✅ user's own orders
router.put('/:id/cancel', protect, cancelOrder);

// ─── Admin routes – SPECIFIC PATHS FIRST ──────────────────────
router.get('/all', protect, admin, getAllOrders);          // ✅ all orders
router.get('/pending-count', protect, admin, getPendingCount);

// ─── Dynamic routes (must come LAST) ─────────────────────────
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;