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

// ─── Get User Orders ──────────────────────────────────────────
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Get All Orders (Admin) ──────────────────────────────────
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

// ─── Get Single Order ─────────────────────────────────────────
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

// ─── Update Order Status (Admin) ─────────────────────────────
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

// ─── Pending Orders Count ────────────────────────────────────
exports.getPendingCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: 'Pending' });
    res.json({ count });
  } catch (error) {
    console.error('Get pending count error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Cancel Order ─────────────────────────────────────────────
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

// ─── Today's Revenue (only Delivered orders) ────────────────
exports.getTodayRevenue = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: 'Delivered'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' }
        }
      }
    ]);

    const todayRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    res.json({ todayRevenue });
  } catch (error) {
    console.error('Get today revenue error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Monthly Revenue (last 6 months) ─────────────────────────
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = result.map(item => ({
      month: months[item._id.month - 1] + ' ' + item._id.year.toString().slice(2),
      revenue: item.revenue
    }));

    res.json(data);
  } catch (error) {
    console.error('Get monthly revenue error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Daily Revenue (last N days) ────────────────────────────
exports.getDailyRevenue = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'Delivered'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Build a map of all dates in the range
    const dateMap = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      dateMap[key] = 0;
    }

    result.forEach(item => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2,'0')}-${String(item._id.day).padStart(2,'0')}`;
      if (dateMap.hasOwnProperty(key)) {
        dateMap[key] = item.revenue;
      }
    });

    const data = Object.keys(dateMap).sort().map(key => ({
      date: key,
      revenue: dateMap[key]
    }));

    res.json(data);
  } catch (error) {
    console.error('Get daily revenue error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ─── Order Status Breakdown ──────────────────────────────────
exports.getOrderStatusCounts = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const data = result.map(item => ({
      status: item._id || 'Unknown',
      count: item.count
    }));

    if (data.length === 0) {
      return res.json([
        { status: 'Pending', count: 0 },
        { status: 'Confirmed', count: 0 },
        { status: 'Packed', count: 0 },
        { status: 'Shipped', count: 0 },
        { status: 'Delivered', count: 0 },
        { status: 'Cancelled', count: 0 },
      ]);
    }
    res.json(data);
  } catch (error) {
    console.error('Get order status counts error:', error);
    res.status(500).json({ message: error.message });
  }
};