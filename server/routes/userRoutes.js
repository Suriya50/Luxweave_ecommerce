const express = require('express');
const {
  getUsers,
  deleteUser,
  blockUser,
  getStats,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/auth');
const router = express.Router();

router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/block', protect, admin, blockUser);
router.get('/admin/stats', protect, admin, getStats);

module.exports = router;