import React, { useRef } from "react";
import {
  Quote,
  Star,
  BadgeCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const testimonials = [
  {
    name: "Sheri Bruneau",
    role: "Verified Customer",
    initials: "SB",
    rating: 5,
    text: "Beautifully packed products, quick support, and every recipient has been delighted.",
  },
  {
    name: "Sandeep Singh",
    role: "Verified Customer",
    initials: "SS",
    rating: 5,
    text: "Excellent customer service and a polished shopping experience from start to finish.",
  },
  {
    name: "Janard Stanton",
    role: "Verified Customer",
    initials: "JS",
    rating: 5,
    text: "Fast turnaround and thoughtful custom options for all our gifting needs.",
  },
];

const Testimonials = () => {
  const swiperRef = useRef(null);

  return (
    <section className="relative overflow-hidden bg-[#e7ebef] py-10 sm:py-10 lg:py-15">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-purple-100/50 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#111a3a] sm:text-4xl md:text-5xl lg:text-[52px]"> What Our<b className="ml-2 bg-gradient-to-r from-[#3048d8] via-[#4059ee] to-[#1f35c8] bg-clip-text text-transparent">Customer</b> Say</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            Real experiences from customers who shop, discover and
            celebrate with Vyason.
          </p>
        </div>
        <div className="mt-14">
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            slidesPerView={1}
            spaceBetween={20}
            loop
            speed={500}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="!overflow-visible"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={`${testimonial.name}-${testimonial.initials}`} className="">
                <article
                  className="group relative h-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-100 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)] sm:p-8"
                >

                  {/* Top accent */}
                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Quote icon */}
                  <div className="absolute right-7 top-7 text-indigo-50 transition-colors duration-300 group-hover:text-indigo-100">
                    <Quote
                      size={52}
                      strokeWidth={1.2}
                      fill="currentColor"
                    />
                  </div>

                  {/* Rating */}
                  <div className="relative flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="relative mt-6 min-h-[90px] text-[15px] leading-7 text-gray-600">
                    “{testimonial.text}”
                  </p>

                  {/* Divider */}
                  <div className="my-6 h-px bg-gray-100" />

                  {/* Customer */}
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      {/* Avatar */}
                      <div className="flex h-5 w-11 min-h-[40px] items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                        {testimonial.initials}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm  truncate font-bold text-gray-900">
                            {testimonial.name}
                          </h3>

                          <BadgeCheck
                            size={15}
                            className="fill-indigo-600 text-white "
                          />
                        </div>

                        <p className="mt-0.5 text-xs text-gray-500 ">
                          {testimonial.role}
                        </p>
                      </div>

                    </div>

                    <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 sm:flex">
                      <Quote size={16} />
                    </div>

                  </div>

                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={15}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <p className="text-sm text-gray-500">
              Trusted by our growing community
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">

            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => swiperRef.current?.slidePrev()}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200  text-[#4254bf]  shadow-sm transition-colors hover:border-[#4254bf] hover:bg-[#4254bf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4254bf]"
            >
              <ArrowLeft size={17} className="transition-colors group-hover:text-white" />
            </button>

            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => swiperRef.current?.slideNext()}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200  text-[#4254bf]  shadow-sm transition-colors hover:border-[#4254bf] hover:bg-[#4254bf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4254bf]"
            >
              <ArrowRight size={17} className="transition-colors group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;