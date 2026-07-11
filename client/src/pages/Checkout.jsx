import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { createOrder } from '../api/endpoints';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiUser, FiMapPin, FiPhone, FiShoppingBag, FiCheckCircle, FiSave } from 'react-icons/fi';
import api from '../api/axios';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we came from "Buy Now"
  const buyNow = location.state?.buyNow || null;
  const buyQuantity = location.state?.quantity || 1;
  const buySize = location.state?.selectedSize || null;

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const [form, setForm] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    paymentMethod: 'COD',
  });

  // ─── Fetch user profile on mount to get latest address ────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        // Update the user context with the latest profile
        if (updateUser) {
          updateUser(data);
        }
        // If address exists, auto-fill the form
        if (data.address) {
          setForm((prev) => ({
            ...prev,
            address: data.address.street || '',
            city: data.address.city || '',
            state: data.address.state || '',
            pincode: data.address.pincode || '',
            phone: data.address.phone || '',
          }));
          setSaveAddress(true); // auto-check if address exists
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [updateUser]);

  // ─── Build order items ──────────────────────────────────────
  useEffect(() => {
    if (buyNow) {
      const productWithSize = {
        ...buyNow,
        selectedSize: buySize,
      };
      setItems([{ product: productWithSize, quantity: buyQuantity }]);
      setTotal(buyNow.price * buyQuantity);
    } else if (cartItems.length > 0) {
      const mapped = cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
      }));
      setItems(mapped);
      setTotal(totalPrice);
    } else {
      navigate('/cart');
    }
  }, [buyNow, cartItems, totalPrice, navigate, buyQuantity, buySize]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.address || !form.city || !form.state || !form.pincode || !form.phone) {
      toast.error('Please fill all shipping details');
      return;
    }
    if (form.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    if (items.length === 0) {
      toast.error('No items to order');
      return;
    }

    setLoading(true);
    try {
      // Save address if checked
      if (saveAddress) {
        const addressData = {
          street: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          phone: form.phone,
        };
        await api.put('/profile', { address: addressData });
        if (updateUser) {
          updateUser({ address: addressData });
        }
        toast.success('Address saved to your profile');
      }

      const orderData = {
        items: items.map(({ product, quantity }) => ({
          product: product._id,
          quantity,
          price: product.price,
        })),
        shippingAddress: {
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          phone: form.phone,
        },
        total: total,
        paymentMethod: form.paymentMethod,
      };

      await createOrder(orderData);
      toast.success('Order placed successfully! 🎉');
      setOrderPlaced(true);

      if (!buyNow) {
        clearCart();
      }

      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading state ──────────────────────────────────────────
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-500 mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Loading your details...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display">Cart is empty</h2>
        <Link to="/shop" className="btn-primary inline-block mt-4">Shop now</Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-3xl font-display font-bold gold-text">Order Placed! 🎉</h2>
          <p className="text-gray-500 mt-2">Your order has been placed successfully.</p>
          <p className="text-sm text-gray-400 mt-1">Redirecting to orders...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10 max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-display font-bold mb-6 sm:mb-8 gold-text">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Shipping Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex-1 bg-white rounded-xl shadow-luxury p-4 sm:p-6 border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <FiMapPin className="gold-text" /> Shipping Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Address *</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Street address, apartment, etc."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition bg-gray-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="Chennai"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition bg-gray-50/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  placeholder="Tamil Nadu"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition bg-gray-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                  placeholder="600001"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Save Address Checkbox */}
            <div className="flex items-center gap-3 p-3 bg-gold-50 rounded-lg border border-gold-200">
              <input
                type="checkbox"
                id="saveAddress"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                className="w-4 h-4 text-gold-500 rounded border-gray-300 focus:ring-gold-500"
              />
              <label htmlFor="saveAddress" className="text-sm font-medium text-gray-700 flex items-center gap-1.5 cursor-pointer">
                <FiSave size={16} className="text-gold-500" /> Save this address to my profile
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 transition bg-gray-50/50"
              >
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 rounded-lg font-medium text-sm hover:shadow-lg hover:shadow-gold-500/30 transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiShoppingBag size={18} /> Place Order
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Order Summary */}
        <motion.div
          className="lg:w-80 xl:w-96 bg-gray-50 p-4 sm:p-6 rounded-xl h-fit sticky top-24 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
            <FiShoppingBag className="gold-text" /> Order Summary
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {items.map((item, idx) => {
              const product = item.product;
              const size = product.selectedSize || null;
              return (
                <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-2 shadow-sm">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/50'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                      {size && <span className="text-xs text-gold-500 ml-1">({size})</span>}
                    </p>
                    <p className="text-xs text-gray-500">{item.quantity} × ₹{product.price}</p>
                  </div>
                  <span className="text-sm font-bold gold-text">₹{product.price * item.quantity}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t-2 border-gold-500">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-base">Total</span>
              <span className="text-xl font-bold gold-text">₹{total}</span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 flex items-center gap-1">
              <FiCheckCircle size={14} /> Free delivery • Cash on Delivery available
            </p>
          </div>

          <Link
            to="/cart"
            className="block text-center text-sm text-gray-400 hover:text-gold-500 mt-4 transition"
          >
            ← Back to Cart
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;