import { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatsCard from '../../components/admin/StatsCard';
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FaRupeeSign } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        // In a real app, you'd have separate endpoints for these
        // For now we use one endpoint and add mock computed values
        const { data } = await api.get('/admin/stats');
        // Mock extra stats – in real app fetch from backend
        setStats({
          ...data,
          todayRevenue: Math.round(data.revenue * 0.4), // mock 40% today
          pendingOrders: Math.round(data.orders * 0.3),
          deliveredOrders: Math.round(data.orders * 0.6),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold gold-text">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, Admin! Here's your store overview.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <FiCalendar className="text-gold-500" size={18} />
          <span className="text-sm font-medium text-gray-600">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatsCard
          icon={<FiUsers size={24} />}
          label="Total Users"
          value={stats.users}
          color="blue"
          trend={5}
          trendLabel="this month"
        />
        <StatsCard
          icon={<FiBox size={24} />}
          label="Total Products"
          value={stats.products}
          color="purple"
          trend={2}
          trendLabel="this week"
        />
        <StatsCard
          icon={<FiShoppingBag size={24} />}
          label="Total Orders"
          value={stats.orders}
          color="pink"
          trend={8}
          trendLabel="this week"
        />
        <StatsCard
          icon={<FaRupeeSign size={24} />}
          label="Total Revenue"
          value={`₹${stats.revenue}`}
          color="green"
          trend={12}
          trendLabel="this month"
        />
      </div>

      {/* Extra Row – Today’s Revenue & Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-1 md:col-span-2 bg-gradient-to-br from-gold-50 to-white rounded-2xl shadow-sm border border-gold-100/50 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
            <p className="text-3xl sm:text-4xl font-bold gold-text mt-1">
              ₹{stats.todayRevenue}
            </p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
              Up from yesterday
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <FiTrendingUp className="text-gold-500" size={20} />
            <span className="text-sm font-medium text-gray-700">+12% growth</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-6 w-full justify-around">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.pendingOrders}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</p>
              <p className="text-xs text-gray-500">Delivered</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.orders}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions / Recent Activity (optional) */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiShoppingBag className="text-gold-500" /> Recent Orders
          </h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">Order #ORD-{1000 + i}</p>
                  <p className="text-xs text-gray-400">2 items • ₹{600 + i * 200}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiUsers className="text-gold-500" /> Top Customers
          </h3>
          <div className="space-y-2">
            {['Surya', 'Priya', 'Rahul'].map((name, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                <p className="text-sm font-medium text-gray-800">{name}</p>
                <p className="text-xs text-gray-400">{3 - i} orders</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;