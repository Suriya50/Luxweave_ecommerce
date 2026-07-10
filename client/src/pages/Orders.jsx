import { useEffect, useState } from 'react';
import { getOrders } from '../api/endpoints';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display">No orders yet</h2>
        <p className="text-gray-500 mt-2">Start shopping to see orders here.</p>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-xl p-6 shadow-sm">
            <div className="flex flex-wrap justify-between items-center">
              <div>
                <p className="font-bold">Order #{order._id.slice(-6)}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-medium bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                {order.status}
              </span>
              <p className="font-bold gold-text">₹{order.total}</p>
            </div>
            <div className="mt-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 border-t py-2">
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/50'}
                    alt={item.product?.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} × ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm">
              <p>Shipping: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm overflow-x-auto">
              {['Pending','Confirmed','Packed','Shipped','Delivered'].map((status, idx) => (
                <div key={status} className="flex items-center whitespace-nowrap">
                  <div className={`w-3 h-3 rounded-full ${order.status === status ? 'bg-gold-500' : 'bg-gray-300'}`} />
                  <span className="ml-1">{status}</span>
                  {idx < 4 && <span className="w-8 h-px bg-gray-300 mx-1" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;