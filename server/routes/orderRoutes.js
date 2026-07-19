const express = require('express');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getPendingCount,
  cancelOrder,
  getTodayRevenue,
  getMonthlyRevenue,
  getDailyRevenue,
  getOrderStatusCounts,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/auth');
const router = express.Router();

// ─── Customer routes ──────────────────────────────────────────
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.put('/:id/cancel', protect, cancelOrder);

// ─── Admin routes – SPECIFIC PATHS FIRST ─────────────────────
router.get('/all', protect, admin, getAllOrders);
router.get('/pending-count', protect, admin, getPendingCount);
router.get('/today-revenue', protect, admin, getTodayRevenue);
router.get('/monthly-revenue', protect, admin, getMonthlyRevenue);
router.get('/daily-revenue', protect, admin, getDailyRevenue);
router.get('/status-counts', protect, admin, getOrderStatusCounts);
router.put('/:id', protect, admin, updateOrderStatus);

// ─── Dynamic routes (must come LAST) ─────────────────────────
router.get('/:id', protect, getOrderById);   // ⚠️ Keep this at the end

module.exports = router;