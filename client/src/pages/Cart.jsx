import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const Cart = () => {
  const { cartItems, updateItem, removeItem, clearCart, totalPrice, totalItems } = useCart();

  // ✅ Filter out any cart items that have null product or missing _id
  const validItems = cartItems.filter(item => item && item.product && item._id);

  const handleQuantity = (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) {
      removeItem(id);
      return;
    }
    updateItem(id, newQty);
  };

  if (validItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-bold">Your Cart is Empty</h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2">Start shopping now!</p>
        <Link to="/shop" className="btn-primary inline-block mt-6">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <h1 className="text-xl sm:text-3xl font-display font-bold mb-4 sm:mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          {validItems.map((item) => (
            <motion.div
              key={item._id} // ✅ safe now
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-row items-center gap-4 sm:gap-5 border-b border-gray-100 py-4 hover:bg-gray-50/50 rounded-lg px-3 transition"
            >
              {/* Product Image */}
              <Link 
                to={`/product/${item.product._id}`}
                className="flex-shrink-0 block hover:opacity-80 transition"
              >
                <img
                  src={item.product.images?.[0] || 'https://via.placeholder.com/120'}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/product/${item.product._id}`}
                  className="font-medium text-sm sm:text-base hover:text-gold-500 transition flex items-center gap-1 group/link"
                >
                  <span className="truncate">{item.product.name}</span>
                  <FiEye size={14} className="text-gray-400 group-hover/link:text-gold-500 transition flex-shrink-0" />
                </Link>
                <p className="text-gold-500 font-bold text-sm sm:text-base mt-0.5">₹{item.product.price}</p>
              </div>

              {/* Quantity & Remove */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="flex items-center gap-1 border rounded-lg p-1 bg-white shadow-sm">
                  <button
                    onClick={() => handleQuantity(item._id, item.quantity, -1)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gold-500"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantity(item._id, item.quantity, 1)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gold-500"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  aria-label="Remove item"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button 
              onClick={clearCart} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition border border-red-200"
            >
              <FiTrash2 size={14} /> Clear Cart
            </button>
            <span className="text-xs text-gray-400">{validItems.length} items</span>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-72 bg-gray-50 p-4 sm:p-6 rounded-xl h-fit sticky top-24 shadow-sm border border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Cart Summary</h2>
          <div className="space-y-2 text-sm sm:text-base">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Total Items</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Delivery</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gold-500">
              <span className="font-bold text-base sm:text-lg">Grand Total</span>
              <span className="font-bold text-base sm:text-lg gold-text">₹{totalPrice}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Coupon Code"
              className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            <button className="btn-primary rounded-lg px-4 py-2 text-sm whitespace-nowrap">Apply</button>
          </div>

          <Link to="/checkout">
            <button className="btn-primary w-full mt-4 py-2.5 sm:py-3 text-sm sm:text-base">
              Proceed to Checkout
            </button>
          </Link>

          <Link 
            to="/shop" 
            className="block text-center text-sm text-gray-400 hover:text-gold-500 mt-3 transition"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>

      {/* Optional: Related Products Carousel – with loop fix */}
      {validItems.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">You may also like</h2>
          <Swiper
            modules={[Autoplay, FreeMode]}
            autoplay={{ delay: 3000, disableOnInteraction: true }}
            freeMode={true}
            loop={validItems.length >= 4} // ✅ disable loop if not enough slides
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 3, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            className="py-4"
          >
            {validItems.map((item) => (
              <SwiperSlide key={item._id}>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <img
                    src={item.product.images?.[0] || 'https://via.placeholder.com/150'}
                    alt={item.product.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-gold-500 font-bold">₹{item.product.price}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Cart;