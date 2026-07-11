import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, cancelOrder } from '../api/endpoints'; // ✅ user's orders
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { FiX, FiAlertCircle, FiPackage, FiMapPin, FiPhone } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await getOrders(); // ✅ ONLY current user's orders
      console.log('📦 Orders fetched:', data.length); // debug
      setOrders(data);
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!cancelReason.trim()) {
      toast.error('Please enter a reason for cancellation');
      return;
    }
    setSubmitting(true);
    try {
      await cancelOrder(orderId, { reason: cancelReason });
      toast.success('Order cancelled successfully');
      setCancelModal(null);
      setCancelReason('');
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const map = {
      Pending: 'yellow',
      Confirmed: 'blue',
      Packed: 'indigo',
      Shipped: 'purple',
      Delivered: 'green',
      Cancelled: 'red',
    };
    return map[status] || 'gray';
  };

  if (loading) return <LoadingSkeleton />;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display">No orders yet</h2>
        <p className="text-gray-500 mt-2">Start shopping to see orders here.</p>
        <Link to="/shop" className="btn-primary inline-block mt-4">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-4 bg-gray-50 border-b flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-3 flex-wrap">
                <FiPackage className="text-gray-400" size={20} />
                <span className="font-mono text-sm font-bold text-gray-700">
                  #{order._id.slice(-6)}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                  {order.status}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold gold-text">₹{order.total}</span>
              </div>
            </div>

            {/* Order Body */}
            <div className="p-4 space-y-4">
              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-3 border-b border-gray-100 pb-2 last:border-0">
                      <img
                        src={item.product?.images?.[0] || 'https://via.placeholder.com/50'}
                        alt={item.product?.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product?.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity} × ₹{item.price}</p>
                      </div>
                      <span className="text-sm font-bold gold-text">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-gray-50 rounded-lg p-3 text-sm flex flex-col sm:flex-row gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <FiMapPin className="text-gray-400 mt-0.5" size={16} />
                  <p className="text-gray-600">
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-gray-400" size={16} />
                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Cancellation reason */}
              {order.status === 'Cancelled' && order.cancellationReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    <span className="font-semibold">Cancelled:</span> {order.cancellationReason}
                    {order.cancelledBy && (
                      <span className="text-xs text-gray-400 ml-2">(by {order.cancelledBy === 'admin' ? 'Admin' : 'You'})</span>
                    )}
                  </p>
                </div>
              )}

              {/* Cancel Button */}
              {order.status === 'Pending' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setCancelModal(order._id)}
                    className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition border border-red-200"
                  >
                    <FiX size={16} /> Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCancelModal(null)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="text-red-500 text-xl" />
                </div>
                <h3 className="text-lg font-bold">Cancel Order</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Please tell us why you want to cancel this order.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Wrong item, changed mind, etc."
                className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 min-h-[80px]"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleCancel(cancelModal)}
                  disabled={submitting}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  {submitting ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
                <button
                  onClick={() => setCancelModal(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;