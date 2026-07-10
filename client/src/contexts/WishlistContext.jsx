import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      // data is an array of product objects (populated)
      setItems(data || []);
    } catch (error) {
      console.error('Wishlist fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addItem = async (productId) => {
    try {
      const { data } = await api.post('/wishlist', { productId });
      setItems(data); // data is the updated array of products
      toast.success('Added to wishlist ❤️');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding to wishlist');
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await api.delete(`/wishlist/${productId}`);
      setItems(data); // data is the updated array of products
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Remove failed');
    }
  };

  // ✅ FIX: check product._id directly (items are product objects)
  const isInWishlist = (productId) => {
    return items.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ items, loading, fetchWishlist, addItem, removeItem, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);