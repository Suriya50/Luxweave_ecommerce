const Order = require('../models/Order');
const Cart = require('../models/Cart');

// ─── Create Order ──────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, items, total, paymentMethod } = req.body;
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      total,
      paymentMethod: paymentMethod || 'COD',
      status: 'Pending',
      cancellationReason: '',
      cancelledAt: null,
      cancelledBy: null,
    });
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Get User Orders (customer) ──────────────────────────────
// ✅ RETURNS ONLY ORDERS BELONGING TO THE LOGGED-IN USER
exports.getUserOrders = async (req, res) => {
  try {
    console.log('👤 [getUserOrders] User ID:', req.user._id); // debug – check backend logs
    const orders = await Order.find({ user: req.user._id }) // 🔥 KEY FILTER
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Get All Orders (admin only) ──────────────────────────────
// ✅ RETURNS ALL ORDERS – NO USER FILTER
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Single Order ──────────────────────────────────────────
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isAdmin = req.user.role === 'admin';
    const isOwner = order.user._id.toString() === req.user._id.toString();
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Order Status (admin) ──────────────────────────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      order.cancelledAt = new Date();
      order.cancelledBy = 'admin';
      if (!order.cancellationReason) order.cancellationReason = 'Cancelled by admin';
    }
    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Pending Orders Count (admin badge) ──────────────────────
exports.getPendingCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: 'Pending' });
    res.json({ count });
  } catch (error) {
    console.error('Get pending count error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Cancel Order (customer or admin) ─────────────────────────
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: 'Please provide a cancellation reason' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isAdmin = req.user.role === 'admin';
    const isOwner = order.user.toString() === req.user._id.toString();
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    order.status = 'Cancelled';
    order.cancellationReason = reason.trim();
    order.cancelledAt = new Date();
    order.cancelledBy = isAdmin ? 'admin' : 'user';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: error.message });
  }
};