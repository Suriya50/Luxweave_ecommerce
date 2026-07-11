import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiHeart, FiShoppingBag, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductCard = ({ product, compact = false }) => {
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const liked = isInWishlist(product._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    liked ? removeItem(product._id) : addItem(product._id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    addToCart(product._id);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    navigate('/checkout', { state: { buyNow: product, quantity: 1 } });
  };

  // 🔹 Compact mode (small)
  if (compact) {
    return (
      <motion.div whileHover={{ y: -2 }} className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden h-full">
        <Link to={`/product/${product._id}`}>
          <div className="relative bg-gray-50 flex items-center justify-center p-2">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/200'}
              alt={product.name}
              className="w-full h-28 sm:h-36 object-contain" // ✅ full image visible
            />
            <button
              onClick={handleWishlist}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
            >
              <FiHeart className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'} size={12} />
            </button>
            {product.discount && (
              <span className="absolute bottom-1 left-1 bg-red-500 text-white text-[7px] px-1 py-0.5 rounded">
                {product.discount}% OFF
              </span>
            )}
          </div>
          <div className="p-1.5 sm:p-2">
            <h3 className="font-semibold text-[8px] sm:text-xs truncate leading-tight">{product.name}</h3>
            <p className="text-gray-500 text-[6px] sm:text-[8px] truncate">{product.category?.name || ''}</p>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[10px] sm:text-sm font-bold gold-text">₹{product.price}</span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through text-[6px] sm:text-[8px]">₹{product.oldPrice}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="mt-1 w-full bg-gold-500 text-white text-[7px] sm:text-[10px] py-0.5 rounded hover:bg-gold-600 transition flex items-center justify-center gap-0.5 font-medium"
            >
              <FiShoppingBag size={10} /> Add
            </button>
          </div>
        </Link>
      </motion.div>
    );
  }

  // 🔹 Default – full image, elegant buttons
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden h-full group">
      <Link to={`/product/${product._id}`}>
        <div className="relative bg-gray-50 flex items-center justify-center p-3">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-48 sm:h-56 object-contain" // ✅ full image visible
          />
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:shadow-md transition"
          >
            <FiHeart className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'} size={16} />
          </button>
          {product.discount && (
            <span className="absolute bottom-2 left-2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-sm sm:text-base truncate">{product.name}</h3>
          <p className="text-gray-500 text-xs sm:text-sm truncate">{product.category?.name || ''}</p>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-lg sm:text-xl font-bold gold-text">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-xs sm:text-sm">₹{product.oldPrice}</span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1.5 bg-gold-500 text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 rounded-lg hover:bg-gold-600 transition duration-200"
            >
              <FiShoppingBag size={14} /> <span>Add</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-1.5 bg-black text-white text-xs sm:text-sm font-medium py-1.5 sm:py-2 rounded-lg hover:bg-gray-800 transition duration-200"
            >
              <FiZap size={14} /> <span>Buy</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;