import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import heroImage1 from "../../assets/slider1.png";
import heroImage2 from "../../assets/slider2.png";
import heroImage3 from "../../assets/slider3.png";
const slides = [
  {
    title: 'Fresh styles for every time',
    subtitle: 'Discover new arrivals and curated collections',
    button: 'Shop Now',
    image: heroImage1,
  },
  {
    title: 'Best deals on top brands',
    subtitle: 'Save big on your favorite products',
    button: 'Browse Offers',
   image: heroImage2,
  },
  {
    title: 'Fast delivery across India',
    subtitle: 'Get your order delivered quickly & safely',
    button: 'Explore Delivery',
   image: heroImage3,
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
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation={true}
          pagination={{ clickable: true }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative overflow-hidden  min-h-[360px] shadow-xl">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/10 to-slate-950/80" />
                <div className="relative z-10 flex min-h-[360px] items-center p-8 md:p-16 text-white">
                  <div className="max-w-2xl">
                    <span className="inline-block mb-4 rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.25em] text-white/90">
                      Featured
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/90 mb-8">
                      {slide.subtitle}
                    </p>
                    <button className="inline-flex items-center justify-center rounded-full bg-[#fffdfa] px-8 py-3 text-sm font-semibold text-[#1c1c1c] shadow-lg shadow-slate-900/10 transition hover:bg-[#f4e9d7]">
                      {slide.button}
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

    </section>
  )
}

export default MainSlider
