import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/common/ProductCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { items, loading } = useWishlist();

  if (loading) return <LoadingSkeleton />;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-display">Wishlist is empty</h2>
        <Link to="/shop" className="btn-primary inline-block mt-4">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          // items are product objects directly, so pass product={product}
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;