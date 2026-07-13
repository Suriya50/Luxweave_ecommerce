import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, FreeMode } from 'swiper/modules';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { motion } from 'framer-motion';
import {
  FaTshirt,
  FaFemale,
  FaStar,
  FaTag,
  FaShoppingBag,
  FaTruck,
  FaGem,
  FaUndoAlt,
  FaShieldAlt,
  FaHeadset,
  FaArrowRight,
  FaGlasses,
} from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // ─── 6 Categories ─────────────────────────────────────────────
  const categories = [
    { name: 'Men', icon: FaTshirt, link: '/shop?gender=Men', color: 'from-blue-500/20 to-blue-500/5' },
    { name: 'Women', icon: FaFemale, link: '/shop?gender=Women', color: 'from-pink-500/20 to-pink-500/5' },
    { name: 'New Arrivals', icon: FaStar, link: '/shop?sort=newest', color: 'from-gold-500/20 to-gold-500/5' },
    { name: 'Collections', icon: FaTag, link: '/shop', color: 'from-purple-500/20 to-purple-500/5' },
    { name: 'Sale', icon: FaShoppingBag, link: '/shop?discount=10', color: 'from-red-500/20 to-red-500/5' },
    { name: 'Accessories', icon: FaGlasses, link: '/shop?category=Accessories', color: 'from-green-500/20 to-green-500/5' },
  ];

  // ─── 6 Features ───────────────────────────────────────────────
  const features = [
    { icon: FaTruck, label: 'Free Shipping', desc: '₹999+' },
    { icon: FaGem, label: 'Premium Fabrics', desc: 'Luxury feel' },
    { icon: FaUndoAlt, label: 'Easy Returns', desc: '7 days' },
    { icon: FaShieldAlt, label: 'Secure', desc: '100%' },
    { icon: FaHeadset, label: '24/7 Support', desc: 'Help' },
    { icon: FaStar, label: 'Trendy Styles', desc: 'Seasonal' },
  ];

  // ─── Best Sellers (dress name only, no price) ──────────────
  const products = [
    { name: 'Classic Shirt', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop' },
    { name: 'Salwar Suit', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop' },
    { name: 'T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
    { name: 'Party Dress', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop' },
    { name: 'Leather Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop' },
    { name: 'Chudidhar', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=400&fit=crop' },
  ];

  // ─── Promotional Carousel – Updated to 2026 ─────────────────
  const promoSlides = [
    {
      title: 'New Collection 2026',
      subtitle: 'Define your style',
      bg: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80',
    },
    {
      title: 'Summer Essentials 2026',
      subtitle: 'Cool & comfortable',
      bg: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    },
    {
      title: 'Winter Warmers 2026',
      subtitle: 'Cozy & chic',
      bg: 'https://images.unsplash.com/photo-1602810319428-019690571b5b?w=800&q=80',
    },
  ];

  // ─── Brand Ticker ─────────────────────────────────────────────
  const brandTicker = [
    'LuxWeave Exclusive',
    'Free Shipping on ₹999+',
    'New Arrivals Weekly',
    'Premium Quality',
    'Easy Returns',
    '24/7 Support',
    'Best Prices',
    'Ethical Fashion',
  ];

  // ─── Hero Slides (4 slides) ──────────────────────────────────
  const heroSlides = [
    {
      title: 'Define Your Style',
      subtitle: 'New Season · New Style',
      description: 'Premium quality clothing for men & women crafted for comfort, style and confidence.',
      cta1: 'Shop Men',
      cta2: 'Shop Women',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80',
      badge: 'ELEVATE YOUR STYLE',
    },
    {
      title: 'Up to 50% OFF',
      subtitle: 'On Selected Styles',
      description: 'Elevate your wardrobe with our exclusive collection – limited time only.',
      cta1: 'Explore Now',
      cta2: 'View Sale',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80',
      badge: 'FLASH SALE',
    },
    {
      title: 'Summer Collection',
      subtitle: 'Refresh Your Look',
      description: 'Trendy, breathable, and stylish – perfect for the season.',
      cta1: 'Shop Summer',
      cta2: 'New Arrivals',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1400&q=80',
      badge: 'NEW ARRIVALS',
    },
    {
      title: 'Exclusive Collection',
      subtitle: 'Limited Edition',
      description: 'Discover our handpicked selection of premium styles, curated just for you.',
      cta1: 'Explore',
      cta2: 'Shop Now',
      image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=1400&q=80',
      badge: 'EXCLUSIVE',
    },
  ];

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="overflow-x-hidden bg-white">
      {/* ─── HERO CAROUSEL ───────────────────────────────────────── */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop
        className="h-[55vh] md:h-[85vh] w-full"
      >
        {heroSlides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="relative w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
                <div className="container mx-auto px-4 md:px-12 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-2xl"
                  >
                    <h1 className="text-3xl md:text-5xl font-display font-bold tracking-wider gold-text drop-shadow-lg">
                      LUXWEAVE
                    </h1>
                    <span className="inline-block bg-gold-500 text-black text-[8px] md:text-sm font-bold px-2 md:px-4 py-0.5 md:py-1.5 rounded-full uppercase tracking-wider mt-2 md:mt-4">
                      {slide.badge}
                    </span>
                    <h2 className="text-xs md:text-4xl font-light tracking-widest uppercase mt-2">
                      {slide.subtitle}
                    </h2>
                    <h3 className="text-xl md:text-7xl font-display font-bold mt-1 md:mt-2 leading-tight">
                      {slide.title}
                    </h3>
                    <p className="max-w-lg mt-1 md:mt-4 text-gray-200 text-[10px] md:text-base leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-2 md:gap-4 mt-2 md:mt-6">
                      <Link
                        to="/shop"
                        className="bg-gold-500 text-black px-3 md:px-8 py-1 md:py-3 rounded-md font-medium hover:bg-gold-400 transition flex items-center gap-1 text-[8px] md:text-sm uppercase tracking-wider"
                      >
                        {slide.cta1} <FaArrowRight className="text-[8px] md:text-base" />
                      </Link>
                      <Link
                        to="/shop"
                        className="border border-white text-white px-3 md:px-8 py-1 md:py-3 rounded-md font-medium hover:bg-white hover:text-black transition text-[8px] md:text-sm uppercase tracking-wider"
                      >
                        {slide.cta2}
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ─── CATEGORIES ──────────────────────────────────────────── */}
      <section className="container mx-auto px-3 py-6 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-4xl font-display font-bold text-center">Shop by Category</h2>
          <p className="text-center text-gray-500 text-xs md:text-sm mb-4 md:mb-8">Find what you love</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-br ${cat.color} rounded-xl shadow-sm hover:shadow-lg transition p-3 md:p-6 text-center border border-gray-100`}
              >
                <Link to={cat.link} className="flex flex-col items-center">
                  <cat.icon className="text-2xl md:text-4xl gold-text mb-1" />
                  <span className="font-semibold text-[10px] md:text-base mt-0.5">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── PROMO CAROUSEL ──────────────────────────────────────── */}
      <section className="container mx-auto px-3 py-4 md:py-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-center text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-3 md:mb-6 font-semibold">
            Exclusive Offers
          </h3>
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="h-48 md:h-72 rounded-xl overflow-hidden"
          >
            {promoSlides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="w-full h-full bg-cover bg-center flex items-center justify-center"
                  style={{ backgroundImage: `url(${slide.bg})` }}
                >
                  <div className="bg-black/40 backdrop-blur-sm p-4 md:p-8 rounded-lg text-center text-white">
                    <h4 className="text-lg md:text-4xl font-display font-bold">{slide.title}</h4>
                    <p className="text-sm md:text-xl mt-1">{slide.subtitle}</p>
                    <Link
                      to="/shop"
                      className="inline-block mt-3 bg-gold-500 text-black px-4 md:px-6 py-1 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-gold-400 transition"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </section>

      {/* ─── BRAND TICKER ────────────────────────────────────────── */}
      <section className="bg-gold-500/10 py-2 border-y border-gold-200/30 overflow-hidden">
        <div className="container mx-auto px-3">
          <div className="flex whitespace-nowrap animate-marquee">
            {brandTicker.map((text, idx) => (
              <span key={idx} className="mx-4 text-xs md:text-sm font-medium text-gray-700">
                • {text}
              </span>
            ))}
            {brandTicker.map((text, idx) => (
              <span key={idx + brandTicker.length} className="mx-4 text-xs md:text-sm font-medium text-gray-700">
                • {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BEST SELLERS ────────────────────────────────────────── */}
      <section className="container mx-auto px-3 py-6 md:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-center text-xs md:text-sm uppercase tracking-widest text-gray-400 mb-3 md:mb-6 font-semibold">
            Best Sellers
          </h3>
          <Swiper
            modules={[Autoplay, FreeMode]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            freeMode
            loop
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 10 },
              640: { slidesPerView: 3, spaceBetween: 15 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 6, spaceBetween: 25 },
            }}
            className="py-2"
          >
            {products.map((product, idx) => (
              <SwiperSlide key={idx}>
                <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 md:h-56 object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300" />
                  </div>
                  <div className="p-3 text-center">
                    <p className="font-medium text-sm truncate">{product.name}</p>
                    <Link
                      to="/shop"
                      className="mt-2 inline-block w-full bg-gold-500 text-white text-xs font-medium py-1.5 rounded-md hover:bg-gold-600 transition"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-4 md:py-8 border-t border-gray-100">
        <div className="container mx-auto px-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="text-center group flex flex-col items-center"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 bg-gold-50 rounded-full flex items-center justify-center group-hover:bg-gold-100 transition">
                <feat.icon className="text-lg md:text-3xl gold-text" />
              </div>
              <h4 className="font-semibold text-[10px] md:text-base mt-1">{feat.label}</h4>
              <p className="text-[8px] md:text-sm text-gray-500 leading-tight">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;