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

  // 🔹 COMPACT (mobile) – small cards for home page
  if (compact) {
    return (
      <motion.div whileHover={{ y: -2 }} className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden h-full">
        <Link to={`/product/${product._id}`}>
          <div className="relative">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/200'}
              alt={product.name}
              className="w-full h-28 sm:h-36 object-cover"
            />
            <button
              onClick={handleWishlist}
              className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm"
            >
              <FiHeart className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'} size={11} />
            </button>
            {product.discount && (
              <span className="absolute bottom-1 left-1 bg-red-500 text-white text-[7px] px-1 py-0.5 rounded">
                {product.discount}% OFF
              </span>
            )}
          </div>
          <div className="p-1">
            <h3 className="font-semibold text-[9px] truncate leading-tight">{product.name}</h3>
            <p className="text-gray-500 text-[7px] truncate">{product.category?.name || ''}</p>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs font-bold gold-text">₹{product.price}</span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through text-[7px]">₹{product.oldPrice}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="mt-1 w-full bg-gold-500 text-white text-[8px] py-0.5 rounded hover:bg-gold-600 transition flex items-center justify-center gap-0.5"
            >
              <FiShoppingBag size={9} /> Add
            </button>
          </div>
        </Link>
      </motion.div>
    );
  }

  // 🔹 MEDIUM (default) – for Shop page
  return (
    <motion.div whileHover={{ y: -3 }} className="card group relative bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden h-full">
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-40 sm:h-52 object-cover group-hover:scale-105 transition duration-500"
          />
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition"
          >
            <FiHeart className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'} size={14} />
          </button>
          {product.discount && (
            <span className="absolute bottom-2 left-2 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <div className="p-2 md:p-3">
          <h3 className="font-semibold text-xs sm:text-sm truncate">{product.name}</h3>
          <p className="text-gray-500 text-[8px] sm:text-xs">{product.category?.name || ''}</p>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-sm sm:text-lg font-bold gold-text">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-[8px] sm:text-sm">₹{product.oldPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-1.5 w-full bg-gold-500 text-white text-[10px] sm:text-sm py-1 sm:py-1.5 rounded hover:bg-gold-600 transition flex items-center justify-center gap-1"
          >
            <FiShoppingBag size={12} /> Add to Cart
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;