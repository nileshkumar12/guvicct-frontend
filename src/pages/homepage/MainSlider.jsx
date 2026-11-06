import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Link } from "react-router-dom";

import heroImage1 from "../../assets/slider1.png";
import heroImage2 from "../../assets/slider2.png";
import heroImage3 from "../../assets/slider3.png";
const slides = [
  {
    // title: 'Fresh styles for every time',
    // subtitle: 'Discover new arrivals and curated collections',
    // button: 'Shop Now',
    image: heroImage1,
    link: '/products',
  },
  {
    // title: 'Best deals on top brands',
    // subtitle: 'Save big on your favorite products',
    button: 'Browse Offers',
   image: heroImage2,
   link: '/products',
  },
  {
    // title: 'Fast delivery across India',
    // subtitle: 'Get your order delivered quickly & safely',
    button: 'Explore Delivery',
   image: heroImage3,
   link: '/products',
  },
]

const MainSlider = () => {
  return (
    <section className="bg-[#fffdfa]">

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoHeight={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation={true}
          pagination={{ clickable: true }}
          className="home-hero-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="overflow-hidden shadow-xl">
                <Link to={slide.link} aria-label={`View featured products, slide ${index + 1}`} className="block">
                  <img
                    src={slide.image}
                    alt={`Featured products, slide ${index + 1}`}
                    className="block h-auto w-full"
                  />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

    </section>
  )
}

export default MainSlider
