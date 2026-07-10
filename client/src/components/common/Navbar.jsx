import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import {
  FiShoppingBag,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Wishlist', path: '/wishlist' },
    ...(user ? [{ name: 'Orders', path: '/orders' }] : []),
    ...(user ? [{ name: 'Profile', path: '/profile' }] : []),
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin/dashboard' }] : []),
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-display font-bold gold-text tracking-tight hover:scale-105 transition-transform duration-200"
            >
              LuxWeave
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gold-500 transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>

          {/* Right: Icons + User */}
          <div className="flex-shrink-0 flex items-center space-x-3 sm:space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-gray-700 hover:text-gold-500 transition-colors duration-200"
            >
              <FiHeart size={22} className="hover:scale-110 transition-transform" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-gold-500 transition-colors duration-200"
            >
              <FiShoppingBag size={22} className="hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User / Logout */}
            {user ? (
              <div className="flex items-center gap-2">
               
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-500 transition-colors duration-200"
                >
                  <FiLogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-gold-500 transition-colors duration-200"
              >
                <FiUser size={22} className="hover:scale-110 transition-transform" />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 hover:text-gold-500 transition-colors duration-200 p-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-700 hover:text-gold-500 transition-colors duration-200 font-medium text-base py-2 border-b border-gray-50 last:border-0"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200 font-medium text-base py-2 border-b border-gray-50"
                >
                  <FiLogOut size={18} /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;