import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiTag, FiUsers, FiShoppingBag } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const Sidebar = () => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const { data } = await api.get('/orders/pending-count');
        setPendingCount(data.count);
      } catch (error) {
        console.error('Failed to fetch pending orders count', error);
      }
    };
    fetchPending();
    // refresh every 30 seconds
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { to: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/admin/products', icon: <FiBox />, label: 'Products' },
    { to: '/admin/categories', icon: <FiTag />, label: 'Categories' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { 
      to: '/admin/orders', 
      icon: <FiShoppingBag />, 
      label: 'Orders',
      badge: pendingCount > 0 ? pendingCount : null,
    },
  ];

  return (
    <aside className="w-64 bg-white h-screen shadow-sm sticky top-0">
      <div className="p-6">
        <h2 className="text-2xl font-display font-bold gold-text">Admin</h2>
      </div>
      <nav className="mt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gold-50 transition ${
                isActive ? 'bg-gold-50 border-r-4 border-gold-500 text-gold-600' : ''
              }`
            }
          >
            <div className="flex items-center gap-3">
              {link.icon}
              {link.label}
            </div>
            {link.badge && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;