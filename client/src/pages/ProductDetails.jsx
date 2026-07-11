import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../api/endpoints';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ProductCard from '../components/common/ProductCard';
import { FiHeart, FiShoppingBag, FiStar, FiZap, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const { addItem: addToCart } = useCart();
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const { user } = useAuth();
  const liked = isInWishlist(id);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getProductById(id);
        setProduct(data);
        if (data.category) {
          const relatedRes = await getProducts({ category: data.category._id, limit: 4 });
          setRelated(relatedRes.data.products.filter((p) => p._id !== id));
        }
        // Set default size if product has sizes
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    if (liked) {
      removeItem(id);
    } else {
      addItem(id);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    // Check if size is required and selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(id, quantity);
  };

  // 🚀 Buy Now – go directly to checkout
  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }
    // Check if size is required and selected
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    // Pass product, quantity, and selected size to checkout
    navigate('/checkout', {
      state: {
        buyNow: product,
        quantity: quantity,
        selectedSize: selectedSize,
      },
    });
  };

  if (loading) return <LoadingSkeleton />;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Images */}
        <div className="md:w-1/2">
          <div className="relative overflow-hidden rounded-xl bg-gray-50">
            <img
              src={product.images?.[activeImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-[400px] md:h-[500px] object-contain"
            />
            <button
              onClick={handleWishlist}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
            >
              <FiHeart className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'} size={24} />
            </button>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    idx === activeImage ? 'border-gold-500' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-display font-bold">{product.name}</h1>
          <p className="text-gray-500 text-sm md:text-base mt-1">{product.category?.name}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-bold gold-text">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through text-lg">₹{product.oldPrice}</span>
            )}
            {product.discount && (
              <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={i < (product.rating || 0) ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
          </div>

          <p className="mt-4 text-gray-600 text-sm md:text-base">{product.description}</p>

          {/* 📏 Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-4">
              <label className="block font-medium text-sm mb-2">Select Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                      selectedSize === size
                        ? 'bg-gold-500 text-white border-gold-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gold-500'
                    }`}
                  >
                    {size}
                    {selectedSize === size && <FiCheck className="inline ml-1" size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.specifications && (
            <div className="mt-4">
              <h3 className="font-semibold text-sm">Specifications</h3>
              <ul className="list-disc list-inside text-gray-600 text-sm">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {val}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <label className="block font-medium text-sm mb-1">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="border px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                -
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="border px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gold-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-600 transition flex items-center justify-center gap-2"
            >
              <FiShoppingBag size={20} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              <FiZap size={20} /> Buy Now
            </button>
            <button
              onClick={handleWishlist}
              className="px-4 py-3 rounded-lg border border-gray-300 hover:border-gold-500 transition flex items-center justify-center"
            >
              <FiHeart className={liked ? 'fill-red-500 text-red-500' : 'text-gray-500'} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-display font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-display font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-sm">{review.user?.name || 'Anonymous'}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;