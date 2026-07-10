import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cartItems, updateItem, removeItem, clearCart, totalPrice, totalItems } = useCart();

  const handleQuantity = (id, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) {
      removeItem(id);
      return;
    }
    updateItem(id, newQty);
  };

  if (cartItems.length === 0) {
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
          {cartItems.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border-b border-gray-100 py-4 group hover:bg-gray-50/50 rounded-lg px-2 sm:px-3 transition"
            >
              <Link 
                to={`/product/${item.product._id}`}
                className="flex-shrink-0 block hover:opacity-80 transition"
              >
                <img
                  src={item.product.images?.[0] || 'https://via.placeholder.com/100'}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition"
                />
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/product/${item.product._id}`}
                  className="font-semibold text-sm sm:text-base hover:text-gold-500 transition flex items-center gap-1.5 group/link"
                >
                  <span className="truncate">{item.product.name}</span>
                  <FiEye size={14} className="text-gray-400 group-hover/link:text-gold-500 transition flex-shrink-0" />
                </Link>
                <p className="text-gold-500 font-bold text-sm sm:text-base mt-0.5">₹{item.product.price}</p>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1 border rounded-lg p-1 bg-white shadow-sm">
                  <button
                    onClick={() => handleQuantity(item._id, item.quantity, -1)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gold-500"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantity(item._id, item.quantity, 1)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gold-500"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => {
                    console.log('Removing item with ID:', item._id); // debug
                    removeItem(item._id);
                  }}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  aria-label="Remove item"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
          
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button 
              onClick={clearCart} 
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition border border-red-200"
            >
              <FiTrash2 size={16} /> Clear Cart
            </button>
            <span className="text-xs text-gray-400">{cartItems.length} items in cart</span>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:w-80 bg-gray-50 p-4 sm:p-6 rounded-xl h-fit sticky top-24 shadow-sm border border-gray-100">
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
    </div>
  );
};

export default Cart;