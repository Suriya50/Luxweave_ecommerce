import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCartItems(data);
    } catch (error) {
      console.error('Cart fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId, quantity = 1) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      setCartItems(data);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding to cart');
    }
  };

  const updateItem = async (id, quantity) => {
    try {
      const { data } = await api.put(`/cart/${id}`, { quantity });
      setCartItems(data);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const removeItem = async (id) => {
    try {
      const { data } = await api.delete(`/cart/${id}`);
      setCartItems(data);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Remove failed');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Clear failed');
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);