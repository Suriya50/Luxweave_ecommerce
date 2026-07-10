import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/endpoints';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', image: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory(editing, form);
        toast.success('Category updated');
      } else {
        await createCategory(form);
        toast.success('Category created');
      }
      setForm({ name: '', image: '' });
      setEditing(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat._id);
    setForm({ name: cat.name, image: cat.image || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="text-center py-10 text-sm">Loading...</div>;

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-3xl font-display font-bold mb-4 sm:mb-6 gold-text">Categories</h1>

      {/* Form - Full width on mobile */}
      <form onSubmit={handleSubmit} className="bg-white p-3 sm:p-5 rounded-xl shadow-luxury mb-5 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block font-medium text-xs sm:text-sm text-gray-600 mb-0.5">Category Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="e.g. Men"
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium text-xs sm:text-sm text-gray-600 mb-0.5">Image URL</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary text-sm px-4 py-2 whitespace-nowrap flex items-center gap-1.5">
              <FiPlus size={16} /> {editing ? 'Update' : 'Add'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setForm({ name: '', image: '' }); }}
                className="text-gray-400 hover:text-gray-600 text-sm px-3 py-2"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>
        {editing && <p className="text-xs text-gold-500 mt-1">Editing: {form.name}</p>}
      </form>

      {/* Category Cards - Mobile friendly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((cat) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                  {cat.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base truncate">{cat.name}</p>
              <p className="text-[10px] sm:text-xs text-gray-400">ID: {cat._id.slice(-6)}</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={() => handleEdit(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                <FiEdit size={16} />
              </button>
              <button onClick={() => handleDelete(cat._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                <FiTrash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {categories.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">No categories added yet</div>
      )}
    </div>
  );
};

export default Categories;