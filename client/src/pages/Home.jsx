import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, FreeMode } from 'swiper/modules'; // ⬅️ removed Navigation
import { getProducts } from '../api/endpoints';
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
} from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categoryCarousel = [
    { name: 'Men', image: 'https://images.unsplash.com/photo-1602810319428-019690571b5b?w=400&h=400&fit=crop&crop=face', link: '/shop?gender=Men' },
    { name: 'Women', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60ba?w=400&h=400&fit=crop&crop=face', link: '/shop?gender=Women' },
    { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop&crop=center', link: '/shop?category=Shirts' },
    { name: 'Trousers', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop&crop=center', link: '/shop?category=Trousers' },
    { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center', link: '/shop?category=T-Shirts' },
    { name: 'Dresses', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop&crop=center', link: '/shop?category=Dresses' },
    { name: 'Chudhi', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop&crop=center', link: '/shop?category=Chudhi' },
  ];

  const categories = [
    { name: 'Men', icon: FaTshirt, link: '/shop?gender=Men', color: 'from-blue-500/20 to-blue-500/5' },
    { name: 'Women', icon: FaFemale, link: '/shop?gender=Women', color: 'from-pink-500/20 to-pink-500/5' },
    { name: 'New Arrivals', icon: FaStar, link: '/shop?sort=newest', color: 'from-gold-500/20 to-gold-500/5' },
    { name: 'Collections', icon: FaTag, link: '/shop', color: 'from-purple-500/20 to-purple-500/5' },
    { name: 'Sale', icon: FaShoppingBag, link: '/shop?discount=10', color: 'from-red-500/20 to-red-500/5' },
  ];

  const features = [
    { icon: FaTruck, label: 'Free Shipping', desc: '₹999+' },
    { icon: FaGem, label: 'Premium', desc: 'Finest' },
    { icon: FaUndoAlt, label: 'Returns', desc: '7 days' },
    { icon: FaShieldAlt, label: 'Secure', desc: '100%' },
    { icon: FaHeadset, label: '24/7 Help', desc: 'Support' },
  ];

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
  ];

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="overflow-x-hidden">
      {/* Hero Carousel – NO ARROWS */}
      <Swiper
        modules={[Autoplay, Pagination]} // ⬅️ Navigation removed
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop
        className="h-[50vh] md:h-[85vh] w-full"
      >
        {heroSlides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="relative w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                <div className="container mx-auto px-4 md:px-12 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-2xl"
                  >
                    <span className="inline-block bg-gold-500 text-black text-[8px] md:text-sm font-bold px-2 md:px-4 py-0.5 md:py-1.5 rounded-full uppercase tracking-wider mb-2 md:mb-4">
                      {slide.badge}
                    </span>
                    <h2 className="text-xs md:text-4xl font-light tracking-widest uppercase">
                      {slide.subtitle}
                    </h2>
                    <h1 className="text-xl md:text-7xl font-display font-bold mt-1 md:mt-2 leading-tight">
                      {slide.title}
                    </h1>
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

      {/* Categories Grid – compact */}
      <section className="container mx-auto px-3 py-3 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-base md:text-3xl font-display font-bold text-center">Shop by Category</h2>
          <p className="text-center text-gray-500 text-[8px] md:text-sm mb-2 md:mb-6">Find what you love</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                className={`bg-gradient-to-br ${cat.color} rounded-lg shadow p-2 md:p-4 text-center`}
              >
                <Link to={cat.link} className="flex flex-col items-center">
                  <cat.icon className="text-lg md:text-3xl gold-text" />
                  <span className="font-semibold text-[8px] md:text-sm mt-0.5">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Discount Banner */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="container mx-auto px-3 mb-2 md:mb-6"
      >
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-gold-500 to-orange-400 shadow">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="relative flex flex-col md:flex-row items-center justify-between py-1.5 md:py-4 px-3 md:px-6">
            <div className="text-center md:text-left">
              <span className="inline-block bg-white/20 text-white text-[6px] md:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Limited Time</span>
              <h3 className="text-sm md:text-3xl font-display font-bold text-white">Up to 50% OFF</h3>
              <p className="text-white/90 text-[8px] md:text-sm">Don't miss out!</p>
            </div>
            <Link to="/shop" className="bg-white text-gold-600 px-3 md:px-6 py-0.5 md:py-1.5 rounded font-semibold hover:bg-gray-100 transition text-[8px] md:text-sm uppercase shadow">
              Shop Now
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Trending Categories */}
      <section className="container mx-auto px-2 py-3 md:py-8 border-t border-gray-200">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-center text-[8px] md:text-xs uppercase tracking-widest text-gray-400 mb-2 md:mb-4 font-semibold">
            Trending Categories
          </h3>
          <Swiper
            modules={[Autoplay, FreeMode]}
            autoplay={{ delay: 2500 }}
            freeMode
            loop
            breakpoints={{
              320: { slidesPerView: 2.5, spaceBetween: 6 },
              480: { slidesPerView: 3.5, spaceBetween: 8 },
              640: { slidesPerView: 4.5, spaceBetween: 10 },
              768: { slidesPerView: 5.5, spaceBetween: 12 },
              1024: { slidesPerView: 6.5, spaceBetween: 14 },
            }}
            className="py-1"
          >
            {categoryCarousel.map((cat, idx) => (
              <SwiperSlide key={idx} className="flex justify-center">
                <Link
                  to={cat.link}
                  className="group flex flex-col items-center bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden w-16 md:w-24 border border-gray-100"
                >
                  <div className="w-full h-14 md:h-20 overflow-hidden bg-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex items-center justify-center bg-gold-100 text-gold-600 font-bold text-sm';
                        fallback.textContent = cat.name.charAt(0);
                        parent.appendChild(fallback);
                      }}
                    />
                  </div>
                  <span className="text-[8px] md:text-xs font-medium text-gray-700 py-0.5 px-1 text-center w-full bg-white truncate">
                    {cat.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-2 md:py-4 border-t">
        <div className="container mx-auto px-3 grid grid-cols-2 md:grid-cols-5 gap-1 md:gap-3">
          {features.map((feat, idx) => (
            <div key={idx} className="text-center group flex flex-col items-center">
              <div className="w-6 h-6 md:w-9 md:h-9 bg-gold-50 rounded-full flex items-center justify-center group-hover:bg-gold-100 transition">
                <feat.icon className="text-xs md:text-lg gold-text" />
              </div>
              <h4 className="font-semibold text-[7px] md:text-xs mt-0.5">{feat.label}</h4>
              <p className="text-[5px] md:text-[9px] text-gray-500 leading-tight">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;