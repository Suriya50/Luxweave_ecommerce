import api from './axios';

// ─── Auth ───
export const registerUser = (data) => api.post('/register', data);
export const loginUser = (data) => api.post('/login', data);
export const getProfile = () => api.get('/profile');

// ─── Products ───
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ─── Categories ───
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ─── Cart ───
export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart', data);
export const updateCartItem = (id, data) => api.put(`/cart/${id}`, data);
export const removeCartItem = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete('/cart');

// ─── Wishlist ───
export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (data) => api.post('/wishlist', data);
export const removeWishlistItem = (id) => api.delete(`/wishlist/${id}`);

// ─── Orders ───
// Customer: get ONLY current user's orders
export const getOrders = () => api.get('/orders');
// Admin: get all orders (admin only)
export const getAllOrders = () => api.get('/orders/all');
// Admin: get pending orders count
export const getPendingOrdersCount = () => api.get('/orders/pending-count');
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}`, data);
export const cancelOrder = (id, data) => api.put(`/orders/${id}/cancel`, data);

// ─── Admin Users ───
export const getUsers = () => api.get('/users');
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const blockUser = (id) => api.put(`/users/${id}/block`);