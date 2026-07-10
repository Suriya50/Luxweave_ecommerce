import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    title: 'New Collection 2024',
    subtitle: 'Elevate Your Style With LuxWeave',
    description: 'Discover the latest trends in fashion. Premium quality, stylish designs and perfect comfort.',
    button: 'SHOP NOW',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200',
  },
  // more slides can be dynamic from backend
];

const HeroSlider = () => {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 5000 }}
      pagination={{ clickable: true }}
      navigation
      className="h-[70vh] md:h-[80vh]"
    >
      {slides.map((slide, idx) => (
        <SwiperSlide key={idx}>
          <div
            className="relative w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-4xl md:text-6xl font-display font-bold">{slide.title}</h1>
              <p className="text-xl md:text-3xl mt-2">{slide.subtitle}</p>
              <p className="max-w-lg mt-4 text-gray-200">{slide.description}</p>
              <button className="btn-primary mt-6">{slide.button}</button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;