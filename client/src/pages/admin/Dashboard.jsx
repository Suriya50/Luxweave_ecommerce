import { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatsCard from '../../components/admin/StatsCard';
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-3xl font-display font-bold mb-4 sm:mb-6 gold-text">Dashboard</h1>
      
      {loading ? (
        <div className="text-center py-10 text-sm text-gray-400">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatsCard icon={<FiUsers size={18} />} label="Total Users" value={stats.users} />
          <StatsCard icon={<FiBox size={18} />} label="Total Products" value={stats.products} />
          <StatsCard icon={<FiShoppingBag size={18} />} label="Total Orders" value={stats.orders} />
          <StatsCard icon={<FiDollarSign size={18} />} label="Revenue" value={`₹${stats.revenue}`} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;