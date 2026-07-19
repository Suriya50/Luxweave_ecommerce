import { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatsCard from '../../components/admin/StatsCard';
import { FiUsers, FiBox, FiShoppingBag, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FaRupeeSign } from 'react-icons/fa';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#d4a017', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#f59e0b'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    todayRevenue: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, todayRes, monthlyRes, dailyRes, statusRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/orders/today-revenue'),
          api.get('/orders/monthly-revenue'),
          api.get('/orders/daily-revenue?days=7'), // last 7 days
          api.get('/orders/status-counts'),
        ]);

        setStats({
          ...statsRes.data,
          todayRevenue: todayRes.data.todayRevenue || 0,
        });
        setMonthlyRevenue(monthlyRes.data || []);
        setDailyRevenue(dailyRes.data || []);
        setStatusCounts(statusRes.data || []);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
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

  const hasOrders = stats.orders > 0;

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold gold-text">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Admin! Here's your store overview.</p>
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

      {/* Today's Revenue & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        {/* Today's Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-1 bg-gradient-to-br from-gold-50 to-white rounded-2xl shadow-sm border border-gold-100/50 p-5 sm:p-6 flex flex-col justify-center"
        >
          <p className="text-sm font-medium text-gray-500">Today's Revenue</p>
          <p className="text-3xl sm:text-4xl font-bold gold-text mt-1">₹{stats.todayRevenue}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
            {hasOrders ? 'From delivered orders today' : 'No delivered orders today'}
          </p>
          <div className="mt-3 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 self-start">
            <FiTrendingUp className="text-gold-500" size={20} />
            <span className="text-sm font-medium text-gray-700">
              {stats.todayRevenue > 0 ? 'Today\'s revenue' : 'Start selling!'}
            </span>
          </div>
        </motion.div>

        {/* Order Status Doughnut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Order Status</h3>
          {hasOrders ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusCounts}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {statusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [`${value} orders`, props.payload.status]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                {statusCounts.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                    <span className="text-xs text-gray-600">{item.status}: {item.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
              No orders yet – start selling!
            </div>
          )}
        </motion.div>

        {/* Monthly Revenue Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Monthly Revenue</h3>
          {hasOrders && monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#d4a017" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
              No revenue data yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Daily Revenue (last 7 days) - NEW */}
      <div className="mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-gold-500" /> Daily Revenue (Last 7 Days)
          </h3>
          {hasOrders && dailyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#d4a017" strokeWidth={2} dot={{ fill: '#d4a017' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400 text-sm">
              No daily revenue data yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Orders & Top Customers */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiShoppingBag className="text-gold-500" /> Recent Orders
          </h3>
          {hasOrders ? (
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
          ) : (
            <p className="text-sm text-gray-400">No recent orders.</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiUsers className="text-gold-500" /> Top Customers
          </h3>
          {hasOrders ? (
            <div className="space-y-2">
              {['Surya', 'Priya', 'Rahul'].map((name, i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                  <p className="text-sm font-medium text-gray-800">{name}</p>
                  <p className="text-xs text-gray-400">{3 - i} orders</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No customer data yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;