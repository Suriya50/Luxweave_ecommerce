import { Link } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductCard = ({ product, compact = false }) => {
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { user } = useAuth();
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

  // 🔹 Compact (small) – for dense grids, not used in Shop
  if (compact) {
    return (
      <motion.div whileHover={{ y: -2 }} className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden h-full">
        <Link to={`/product/${product._id}`}>
          <div className="relative bg-gray-50">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/200'}
              alt={product.name}
              className="w-full h-28 sm:h-36 object-cover group-hover:scale-105 transition duration-300"
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

  // 🔹 DEFAULT – Large, gallery‑style image (for Shop page)
  return (
    <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 overflow-hidden h-full group">
      <Link to={`/product/${product._id}`}>
        <div className="relative bg-gray-50 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-64 sm:h-80 lg:h-96 object-cover group-hover:scale-105 transition duration-500"
          />
          {/* Wishlist heart */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
          >
            <FiHeart className={liked ? 'fill-red-500 text-red-500' : 'text-gray-600'} size={20} />
          </button>
          {/* Discount badge */}
          {product.discount && (
            <span className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-semibold text-base sm:text-lg truncate">{product.name}</h3>
          <p className="text-gray-500 text-sm sm:text-base truncate">{product.category?.name || ''}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl sm:text-2xl font-bold gold-text">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-sm sm:text-base">₹{product.oldPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-gold-500 text-white text-sm sm:text-base py-2.5 rounded-xl hover:bg-gold-600 transition flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
          >
            <FiShoppingBag size={18} /> Add to Cart
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;