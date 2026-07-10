import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getProductById, createProduct, updateProduct, getCategories } from '../../api/endpoints';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api from '../../api/axios';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      discount: '',
      category: '',
      brand: '',
      gender: '',
      sizes: '',
      colors: '',
      stock: '',
      rating: '',
      isFeatured: false,
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch categories from API
        const cats = await getCategories();
        setCategories(cats.data || []);
        setCategoryLoading(false);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback categories if API fails
        const fallbackCategories = [
          { _id: 'men', name: 'Men' },
          { _id: 'women', name: 'Women' },
          { _id: 'unisex', name: 'Unisex' },
          { _id: 'accessories', name: 'Accessories' },
          { _id: 'footwear', name: 'Footwear' },
        ];
        setCategories(fallbackCategories);
        toast.warning('Using fallback categories. Please check your backend.');
        setCategoryLoading(false);
      }

      if (isEditing) {
        try {
          const { data } = await getProductById(id);
          reset({
            name: data.name || '',
            description: data.description || '',
            price: data.price || '',
            oldPrice: data.oldPrice || '',
            discount: data.discount || '',
            category: data.category?._id || '',
            brand: data.brand || '',
            gender: data.gender || '',
            sizes: data.sizes?.join(', ') || '',
            colors: data.colors?.join(', ') || '',
            stock: data.stock || '',
            rating: data.rating || '',
            isFeatured: data.isFeatured || false,
          });
          setExistingImages(data.images || []);
        } catch (error) {
          toast.error('Failed to load product details');
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id, isEditing, reset]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setNewFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    e.target.value = '';
  };

  const removeNewFile = (index) => {
    URL.revokeObjectURL(previews[index]);
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price);
    formData.append('oldPrice', data.oldPrice || '');
    formData.append('discount', data.discount || '');
    formData.append('category', data.category);
    formData.append('brand', data.brand || '');
    formData.append('gender', data.gender || '');
    const sizesArr = data.sizes ? data.sizes.split(',').map(s => s.trim()).filter(Boolean) : [];
    const colorsArr = data.colors ? data.colors.split(',').map(c => c.trim()).filter(Boolean) : [];
    formData.append('sizes', JSON.stringify(sizesArr));
    formData.append('colors', JSON.stringify(colorsArr));
    formData.append('stock', data.stock || '0');
    formData.append('rating', data.rating || '');
    formData.append('isFeatured', data.isFeatured ? 'true' : 'false');

    if (existingImages.length > 0) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }
    newFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      if (isEditing) {
        await api.put(`/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
      console.error(error);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-luxury space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Product Name *</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full border rounded p-2"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Brand</label>
            <input {...register('brand')} className="w-full border rounded p-2" placeholder="e.g. Nike" />
          </div>
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea {...register('description')} rows="3" className="w-full border rounded p-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Price (₹) *</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { required: 'Price is required', min: 0 })}
              className="w-full border rounded p-2"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block font-medium">Old Price (₹)</label>
            <input type="number" step="0.01" {...register('oldPrice')} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block font-medium">Discount (%)</label>
            <input type="number" {...register('discount')} className="w-full border rounded p-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Category *</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full border rounded p-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            {categories.length === 0 && !categoryLoading && (
              <p className="text-yellow-500 text-sm mt-1">No categories found. Please add categories first.</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Gender</label>
            <select {...register('gender')} className="w-full border rounded p-2">
              <option value="">Select</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Stock</label>
            <input type="number" {...register('stock')} className="w-full border rounded p-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Sizes (comma separated)</label>
            <input {...register('sizes')} className="w-full border rounded p-2" placeholder="S, M, L, XL" />
          </div>
          <div>
            <label className="block font-medium">Colors (comma separated)</label>
            <input {...register('colors')} className="w-full border rounded p-2" placeholder="Black, White, Red" />
          </div>
        </div>

        {/* Image upload section */}
        <div>
          <label className="block font-medium">Images</label>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100"
            />
            <p className="text-xs text-gray-400 mt-1">You can select multiple images.</p>

            {existingImages.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600">Current Images:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {existingImages.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative border p-1 rounded">
                      <img src={url} alt={`product-${idx}`} className="w-16 h-16 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previews.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600">New Images:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {previews.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative border p-1 rounded">
                      <img src={url} alt={`new-${idx}`} className="w-16 h-16 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Rating</label>
            <input type="number" {...register('rating')} className="w-full border rounded p-2" step="0.1" min="0" max="5" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" {...register('isFeatured')} id="isFeatured" className="w-5 h-5" />
            <label htmlFor="isFeatured" className="font-medium">Featured Product</label>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="btn-primary">
            {isEditing ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;