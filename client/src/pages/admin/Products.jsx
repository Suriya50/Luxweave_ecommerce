import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../api/endpoints';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="text-center py-10 text-sm">Loading...</div>;

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-3xl font-display font-bold gold-text">Products</h1>
        <Link to="/admin/products/new" className="btn-primary text-sm px-4 py-1.5 flex items-center gap-1.5">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Product Cards - Mobile friendly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-3 sm:p-4">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/60'}
                alt={product.name}
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base truncate">{product.name}</p>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-xs sm:text-sm font-bold gold-text">₹{product.price}</span>
                  <span className="text-[10px] sm:text-xs text-gray-400">Stock: {product.stock || 0}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Link
                  to={`/admin/products/edit/${product._id}`}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                >
                  <FiEdit size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">No products added yet</div>
      )}
    </div>
  );
};

export default Products;