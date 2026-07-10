import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiTag, FiUsers, FiShoppingBag } from 'react-icons/fi';

const Sidebar = () => {
  const links = [
    { to: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/admin/products', icon: <FiBox />, label: 'Products' },
    { to: '/admin/categories', icon: <FiTag />, label: 'Categories' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { to: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
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
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gold-50 transition ${
                isActive ? 'bg-gold-50 border-r-4 border-gold-500 text-gold-600' : ''
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;