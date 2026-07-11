import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, cancelOrder } from '../../api/endpoints';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMapPin, FiPhone, FiPackage, FiX, FiAlertCircle } from 'react-icons/fi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await getAllOrders(); // ✅ uses /api/orders/all
      setOrders(data || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error(error.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, { status: newStatus });
      toast.success('Status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
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
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Confirmed: 'bg-blue-100 text-blue-800',
      Packed: 'bg-indigo-100 text-indigo-800',
      Shipped: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const isNewOrder = (createdAt) => {
    return (Date.now() - new Date(createdAt).getTime()) < 3600000;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-500 mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-3xl font-display font-bold mb-6 gold-text">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage className="mx-auto text-gray-300 text-5xl mb-4" />
          <p className="text-gray-400 text-sm">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 border-b">
                <div className="flex items-center gap-3 flex-wrap">
                  <FiPackage className="text-gray-400" size={20} />
                  <span className="font-mono text-sm font-bold text-gray-700">
                    #{order._id.slice(-8)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  {order.status === 'Pending' && isNewOrder(order.createdAt) && (
                    <span className="bg-yellow-300 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                      NEW
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold gold-text">₹{order.total}</span>
                  <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b">
                <div className="flex items-center gap-2">
                  <FiUser className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm font-medium">{order.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{order.user?.email || 'No email'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-gray-400" size={16} />
                  <p className="text-sm">{order.shippingAddress?.phone || 'N/A'}</p>
                </div>
                <div className="flex items-start gap-2">
                  <FiMapPin className="text-gray-400 mt-0.5" size={16} />
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                      <img
                        src={item.product?.images?.[0] || 'https://via.placeholder.com/40'}
                        alt={item.product?.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product?.name || 'Product'}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancellation Reason (if cancelled) */}
              {order.status === 'Cancelled' && order.cancellationReason && (
                <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    <span className="font-semibold">Cancelled:</span> {order.cancellationReason}
                    {order.cancelledBy && (
                      <span className="text-xs text-gray-400 ml-2">
                        (by {order.cancelledBy === 'admin' ? 'Admin' : 'Customer'})
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Status Update + Cancel Button */}
              <div className="p-4 bg-gray-50 border-t flex flex-wrap items-center gap-3">
                <label className="text-xs font-medium text-gray-600">Update Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                {order.status === 'Pending' && (
                  <button
                    onClick={() => setCancelModal(order._id)}
                    className="ml-auto text-sm text-red-500 hover:text-red-700 transition font-medium flex items-center gap-1"
                  >
                    <FiX size={16} /> Cancel Order
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
                Please enter the reason for cancelling this order (this will be shown to the customer).
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Out of stock, Customer requested, etc."
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

export default AdminOrders;