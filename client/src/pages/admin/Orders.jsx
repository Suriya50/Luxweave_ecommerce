import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../../api/endpoints';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await getOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
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

  if (loading) return <div className="text-center py-10 text-sm">Loading...</div>;

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-3xl font-display font-bold mb-4 sm:mb-6 gold-text">Orders</h1>

      <div className="space-y-3 sm:space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 p-3 sm:p-5"
          >
            {/* Header - Order ID & Status */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-gray-600">#{order._id.slice(-8)}</span>
                <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <span className="text-sm sm:text-lg font-bold gold-text">₹{order.total}</span>
            </div>

            {/* Customer */}
            <div className="mt-2 text-xs sm:text-sm text-gray-600">
              <span className="font-medium">{order.user?.name || 'Unknown'}</span>
              <span className="mx-1">·</span>
              <span className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Items preview */}
            <div className="mt-2 flex flex-wrap gap-1">
              {order.items.slice(0, 3).map((item, idx) => (
                <span key={idx} className="text-[10px] sm:text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                  {item.product?.name || 'Item'} × {item.quantity}
                </span>
              ))}
              {order.items.length > 3 && (
                <span className="text-[10px] sm:text-xs text-gray-400">+{order.items.length - 3} more</span>
              )}
            </div>

            {/* Status Update */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label className="text-[10px] sm:text-xs font-medium text-gray-500">Update Status:</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border rounded-lg p-1 text-[10px] sm:text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </motion.div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">No orders yet</div>
      )}
    </div>
  );
};

export default AdminOrders;