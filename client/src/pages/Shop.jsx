import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api/endpoints';
import ProductCard from '../components/common/ProductCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchQuery, 250);

  // Filter state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    gender: searchParams.get('gender') || '',
    sizes: searchParams.get('sizes') ? searchParams.get('sizes').split(',') : [],
    colors: searchParams.get('colors') ? searchParams.get('colors').split(',') : [],
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || '',
  });

  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // Memoized options
  const sizeOptions = useMemo(() => ['S', 'M', 'L', 'XL', 'XXL'], []);
  const colorOptions = useMemo(() => ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Navy', 'Brown', 'Gray'], []);
  const genderOptions = useMemo(() => ['Men', 'Women', 'Unisex'], []);
  const ratingOptions = useMemo(() => [
    { value: '4', label: '4★ & above' },
    { value: '3', label: '3★ & above' },
    { value: '2', label: '2★ & above' },
  ], []);
  const sortOptions = useMemo(() => [
    { value: 'newest', label: 'Newest First' },
    { value: 'priceAsc', label: 'Price: Low → High' },
    { value: 'priceDesc', label: 'Price: High → Low' },
    { value: 'popular', label: 'Most Popular' },
  ], []);
  const pricePresets = useMemo(() => [
    { min: 0, max: 100, label: 'Under ₹100' },
    { min: 100, max: 500, label: '₹100 – ₹500' },
    { min: 500, max: 1000, label: '₹500 – ₹1000' },
    { min: 1000, max: 2000, label: '₹1000 – ₹2000' },
    { min: 2000, max: 5000, label: '₹2000 – ₹5000' },
    { min: 5000, max: 10000, label: '₹5000 – ₹10000' },
  ], []);

  // Memoized updateFilters
  const updateFilters = useCallback((key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value, page: 1 };
      // Update URL params
      const urlParams = { ...newFilters };
      Object.keys(urlParams).forEach(k => {
        if (urlParams[k] === '' || urlParams[k] === null || urlParams[k] === undefined) {
          delete urlParams[k];
        }
        if (Array.isArray(urlParams[k]) && urlParams[k].length === 0) {
          delete urlParams[k];
        }
      });
      setSearchParams(urlParams);
      return newFilters;
    });
  }, [setSearchParams]);

  // Update search filter when debouncedSearch changes
  useEffect(() => {
    updateFilters('search', debouncedSearch);
  }, [debouncedSearch, updateFilters]);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { ...filters };
        if (params.sizes && params.sizes.length > 0) {
          params.sizes = params.sizes.join(',');
        } else {
          delete params.sizes;
        }
        if (params.colors && params.colors.length > 0) {
          params.colors = params.colors.join(',');
        } else {
          delete params.colors;
        }
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key];
          }
        });

        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(params),
          getCategories(),
        ]);
        setProducts(productsRes.data.products || []);
        setPagination(productsRes.data.pagination || { total: 0, pages: 1 });
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const toggleArrayFilter = useCallback((key, value) => {
    setFilters(prev => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      const newFilters = { ...prev, [key]: updated, page: 1 };
      const urlParams = { ...newFilters };
      Object.keys(urlParams).forEach(k => {
        if (urlParams[k] === '' || urlParams[k] === null || urlParams[k] === undefined) {
          delete urlParams[k];
        }
        if (Array.isArray(urlParams[k]) && urlParams[k].length === 0) {
          delete urlParams[k];
        }
      });
      setSearchParams(urlParams);
      return newFilters;
    });
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setFilters({
      category: '',
      brand: '',
      gender: '',
      sizes: [],
      colors: [],
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: 'newest',
      page: 1,
      limit: 12,
      search: '',
    });
    setSearchQuery('');
    setSearchParams({});
  }, [setSearchParams]);

  const handleSearchInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const applyPricePreset = useCallback((min, max) => {
    updateFilters('minPrice', min);
    updateFilters('maxPrice', max);
  }, [updateFilters]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="flex max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search products..."
            className="flex-1 border border-r-0 rounded-l-lg p-2 sm:p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all duration-200"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="bg-gold-500 text-white px-4 sm:px-6 rounded-r-lg hover:bg-gold-600 transition flex items-center gap-1 sm:gap-2 text-sm flex-shrink-0"
          >
            <FiSearch className="text-sm" /> <span className="hidden xs:inline">Search</span>
          </button>
        </form>
        {searchQuery && (
          <p className="text-xs text-gray-400 mt-1 text-center">
            Showing results for: <span className="text-gold-500 font-medium">"{searchQuery}"</span>
          </p>
        )}
      </div>

      {/* Gender Quick Filters */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 justify-center">
        <button
          onClick={() => updateFilters('gender', '')}
          className={`px-3 py-1.5 text-xs rounded-full border transition ${
            !filters.gender ? 'bg-gold-500 text-white border-gold-500' : 'bg-white text-gray-700 border-gray-300 hover:border-gold-500'
          }`}
        >
          All
        </button>
        {genderOptions.map((gender) => (
          <button
            key={gender}
            onClick={() => updateFilters('gender', gender)}
            className={`px-3 py-1.5 text-xs rounded-full border transition ${
              filters.gender === gender ? 'bg-gold-500 text-white border-gold-500' : 'bg-white text-gray-700 border-gray-300 hover:border-gold-500'
            }`}
          >
            {gender}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div>
          <h1 className="text-lg sm:text-3xl font-display font-bold">Shop</h1>
          <p className="text-[10px] sm:text-sm text-gray-500">{pagination.total} products</p>
        </div>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden btn-outline flex items-center gap-1.5 text-sm px-3 py-1.5"
        >
          <FiFilter className="text-sm" /> Filters
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-sm">Filters</h2>
                  <div className="flex items-center gap-3">
                    <button onClick={clearFilters} className="text-xs text-gold-500">Clear All</button>
                    <button onClick={() => setFiltersOpen(false)}><FiX className="text-lg" /></button>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block font-medium text-xs mb-0.5">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => updateFilters('category', e.target.value)}
                      className="w-full border rounded p-1.5 text-sm"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-xs mb-0.5">Brand</label>
                    <input
                      type="text"
                      value={filters.brand}
                      onChange={(e) => updateFilters('brand', e.target.value)}
                      className="w-full border rounded p-1.5 text-sm"
                      placeholder="e.g. Nike"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-xs mb-0.5">Size</label>
                    <div className="flex flex-wrap gap-1.5">
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleArrayFilter('sizes', size)}
                          className={`px-2.5 py-1 text-xs rounded border transition ${
                            filters.sizes.includes(size)
                              ? 'bg-gold-500 text-white border-gold-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gold-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium text-xs mb-0.5">Color</label>
                    <div className="flex flex-wrap gap-1.5">
                      {colorOptions.slice(0, 6).map((color) => (
                        <button
                          key={color}
                          onClick={() => toggleArrayFilter('colors', color)}
                          className={`px-2.5 py-1 text-xs rounded border transition ${
                            filters.colors.includes(color)
                              ? 'bg-gold-500 text-white border-gold-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gold-500'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium text-xs mb-0.5">Price Range</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => updateFilters('minPrice', e.target.value)}
                        placeholder="Min"
                        className="w-1/2 border rounded p-1.5 text-sm"
                      />
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => updateFilters('maxPrice', e.target.value)}
                        placeholder="Max"
                        className="w-1/2 border rounded p-1.5 text-sm"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pricePresets.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => applyPricePreset(preset.min, preset.max)}
                          className="text-[8px] px-2 py-0.5 bg-gray-100 rounded hover:bg-gold-100 transition"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium text-xs mb-0.5">Rating</label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => updateFilters('rating', '')}
                        className={`px-2.5 py-1 text-xs rounded border transition ${
                          filters.rating === '' ? 'bg-gold-500 text-white border-gold-500' : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        All
                      </button>
                      {ratingOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateFilters('rating', opt.value)}
                          className={`px-2.5 py-1 text-xs rounded border transition ${
                            filters.rating === opt.value ? 'bg-gold-500 text-white border-gold-500' : 'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium text-xs mb-0.5">Sort By</label>
                    <select
                      value={filters.sort}
                      onChange={(e) => updateFilters('sort', e.target.value)}
                      className="w-full border rounded p-1.5 text-sm"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block w-64 bg-white p-4 rounded-xl shadow-luxury h-fit sticky top-20 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-sm">Filters</h2>
            <button onClick={clearFilters} className="text-xs text-gold-500 hover:underline">Clear All</button>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block font-medium text-xs text-gray-600 mb-0.5">Category</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilters('category', e.target.value)}
                className="w-full border rounded p-1.5 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-xs text-gray-600 mb-0.5">Brand</label>
              <input
                type="text"
                value={filters.brand}
                onChange={(e) => updateFilters('brand', e.target.value)}
                className="w-full border rounded p-1.5 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="e.g. Nike"
              />
            </div>

            <div>
              <label className="block font-medium text-xs text-gray-600 mb-0.5">Size</label>
              <div className="flex flex-wrap gap-1.5">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleArrayFilter('sizes', size)}
                    className={`px-2.5 py-1 text-xs rounded border transition ${
                      filters.sizes.includes(size)
                        ? 'bg-gold-500 text-white border-gold-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gold-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-xs text-gray-600 mb-0.5">Color</label>
              <div className="flex flex-wrap gap-1.5">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleArrayFilter('colors', color)}
                    className={`px-2.5 py-1 text-xs rounded border transition ${
                      filters.colors.includes(color)
                        ? 'bg-gold-500 text-white border-gold-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gold-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-xs text-gray-600 mb-0.5">Price Range</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updateFilters('minPrice', e.target.value)}
                  placeholder="Min"
                  className="w-1/2 border rounded p-1.5 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilters('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="w-1/2 border rounded p-1.5 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {pricePresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPricePreset(preset.min, preset.max)}
                    className="text-[8px] px-2 py-0.5 bg-gray-100 rounded hover:bg-gold-100 transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-xs text-gray-600 mb-0.5">Rating</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => updateFilters('rating', '')}
                  className={`px-2.5 py-1 text-xs rounded border transition ${
                    filters.rating === '' ? 'bg-gold-500 text-white border-gold-500' : 'bg-white text-gray-700 border-gray-300 hover:border-gold-500'
                  }`}
                >
                  All
                </button>
                {ratingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateFilters('rating', opt.value)}
                    className={`px-2.5 py-1 text-xs rounded border transition ${
                      filters.rating === opt.value ? 'bg-gold-500 text-white border-gold-500' : 'bg-white text-gray-700 border-gray-300 hover:border-gold-500'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-xs text-gray-600 mb-0.5">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => updateFilters('sort', e.target.value)}
                className="w-full border rounded p-1.5 text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-base font-semibold text-gray-600">No products found</h3>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your filters.</p>
              <button onClick={clearFilters} className="btn-primary mt-3 text-sm px-4 py-1.5">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {/* ✅ Use the default medium card */}
                  <ProductCard product={product} compact={false} />
                </motion.div>
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center mt-6 gap-1.5 flex-wrap">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateFilters('page', i + 1)}
                  className={`px-3 py-1 text-sm rounded ${
                    filters.page === i + 1
                      ? 'bg-gold-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;