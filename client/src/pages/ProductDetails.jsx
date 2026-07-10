import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../api/endpoints';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ProductCard from '../components/common/ProductCard';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
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
    addToCart(id, quantity);
  };

  if (loading) return <LoadingSkeleton />;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={product.images?.[activeImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
            <button
              onClick={handleWishlist}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
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

        <div className="md:w-1/2">
          <h1 className="text-3xl font-display font-bold">{product.name}</h1>
          <p className="text-gray-500 mt-1">{product.category?.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold gold-text">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-400 line-through">₹{product.oldPrice}</span>
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
          <p className="mt-4 text-gray-600">{product.description}</p>
          {product.specifications && (
            <div className="mt-4">
              <h3 className="font-semibold">Specifications</h3>
              <ul className="list-disc list-inside text-gray-600">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <li key={key}><strong>{key}:</strong> {val}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-6">
            <label className="block font-medium">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="border px-3 py-1 rounded"
              >
                -
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="border px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2">
              <FiShoppingBag /> Add to Cart
            </button>
            <button onClick={handleWishlist} className="btn-outline flex items-center gap-2">
              <FiHeart className={liked ? 'fill-red-500' : ''} /> {liked ? 'In Wishlist' : 'Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-display font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;