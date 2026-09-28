import React, { useRef, useState,useEffect } from "react";
import { Heart, Star, ArrowRight, ChevronLeft, ChevronRight,ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {API_URL} from "../../utils/config";

const TrendingProducts = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/products/trending`);
            const data = await response.json();
            setProducts(data.data);
            console.log("Fetched products:", data.data);
        } catch (error) {   
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    
    }, []);


    return (
        <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-[600px] -translate-x-1/2 rounded-full bg-blue-50/70 blur-3xl" />
            <div className="container relative mx-auto">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#3d55d9]">
                            Trending Now
                        </p>
                        {/* <h2 className="text-2xl font-extrabold tracking-tight text-[#101a3a] sm:text-3xl">
                            Handpicked Favorites for You
                        </h2> */}

<h2 className="text-3xl font-extrabold tracking-tight text-[#111a3a] sm:text-4xl md:text-5xl lg:text-[52px]">
Handpicked 
            <b className="ml-2 bg-gradient-to-r from-[#3048d8] via-[#4059ee] to-[#1f35c8] bg-clip-text text-transparent">
            Favorites
            </b>
            &nbsp;for You
          </h2>
                    </div>
                    <button
                        type="button"
                        className="group hidden items-center gap-2 text-sm font-semibold text-[#3048d8] sm:flex"
                    >
                        View All

                        <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </button>
                </div>
                <div className="relative">
                    <button
                        ref={prevRef}
                        type="button"
                        aria-label="Previous products"
                        className="
              absolute left-0 top-1/2 z-20
              flex h-10 w-10
              -translate-x-1/2
              -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-slate-200
              bg-white
              text-slate-700
              shadow-lg
              transition-all duration-300
              hover:bg-[#3048d8]
              hover:text-black
              hover:shadow-xl
            "
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={2}
                        loop={true}
                        speed={600}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },

                            480: {
                                slidesPerView: 2,
                                spaceBetween: 12,
                            },

                            640: {
                                slidesPerView: 3,
                                spaceBetween: 14,
                            },

                            768: {
                                slidesPerView: 4,
                                spaceBetween: 16,
                            },

                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 16,
                            },

                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 18,
                            },
                        }}
                        className=""
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>


                    <button
                        ref={nextRef}
                        type="button"
                        aria-label="Next products"
                        className="
              absolute right-0 top-1/2 z-20
              flex h-10 w-10
              translate-x-1/2
              -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-slate-200
              bg-white
              text-slate-700
              shadow-lg
              transition-all duration-300
              hover:bg-[#3048d8]
              hover:text-black
              hover:shadow-xl
            "
                    >
                        <ChevronRight size={20} />
                    </button>

                </div>


                <div className="mt-6 flex justify-center sm:hidden">
                    <button
                        type="button"
                        className="flex items-center gap-2 text-sm font-semibold text-[#3048d8]"
                    >
                        View All
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
};

const ProductCard = ({ product }) => {
    const isWishlisted = false; // Replace with actual logic to determine if the product is wishlisted
    const productId = product._id;
    const productName = product.name;
    const stockLabel = product.stock <= 0 ? 'Out of Stock' : '';
    const stockClass = product.stock <= 0 ? 'bg-red-500 text-white' : '';
    return (

<article
                  key={product._id}
                  className="group relative overflow-hidden rounded-2xl border border-[#e9e2d9] bg-white shadow-sm"
                >
                  <div className="relative text-center overflow-hidden pt-3">
                    <Link to={`/product/${product._id}`}>
                      {product.image ? (

                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-72 m-auto transition duration-500 group-hover:scale-105"
                        />

                      ) : (
                        <div className="flex h-72 items-center justify-center bg-[#f9f5f0] text-[#5d4e3f]">
                          No image
                        </div>
                      )}
                      {product.stock <= 0 && (
                      <div className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] shadow-lg ${stockClass}`}>
                        {stockLabel}
                      </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"></div></Link>
                  </div>

                  <div className="space-y-4 p-6">
                    <Link to={`/product/${productId}`} className="text-lg font-semibold text-[#1c1c1c] hover:text-[#4254bf]">
                      {productName}
                    </Link>
                    <p className="text-sm text-[#5d4e3f]">{product.brand || product.category || 'Gift basket'}</p>
                    <div className="text-2xl font-bold text-[#1aa184]">
                      <div className='flex justify-between'>
                        <span className="text-sm font-bold text-4xl text-[#1aa184]">  {product.price != null ? `₹${Number(product.price).toLocaleString('en-IN')}` : '₹0.00'}</span>
                        <Link to={`/product/${productId}`} className="inline-block text-right rounded-full bg-[#4254bf] px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-[#3546ae]">
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>

    //     <article
    //         className="
    //     group relative h-full overflow-hidden
    //     rounded-2xl
    //     border border-slate-100
    //     bg-white
       
    //     transition-all duration-300
    //     hover:-translate-y-1
    //     hover:border-blue-100
    //     hover:shadow-[0_0px_5px_rgba(48,72,216,0.13)]
    //   "
    //     >

    //         <div className="relative aspect-square overflow-hidden bg-[#f8fafc]">

    //             <img
    //                c
    //                 loading="lazy"
    //                 className="
    //         h-full w-full
    //         object-cover
    //         transition-transform duration-500
    //         group-hover:scale-105
    //       "
    //             />


    //             <button
    //                 type="button"
    //                 aria-label={`Add ${product.name} to wishlist`}
    //                 className="
    //         absolute right-2.5 top-2.5
    //         flex h-8 w-8
    //         items-center justify-center
    //         rounded-full
    //         bg-white/95
    //         text-[#26365f]
    //         shadow-sm
    //         backdrop-blur
    //         transition-all duration-300
    //         hover:bg-[#3048d8]
    //         hover:text-white
    //       "
    //             >
    //                 <Heart size={15} strokeWidth={1.8} />
    //             </button>
    //         </div>


    //         <div className="p-3">


    //             <p className="mb-1 text-[9px] font-medium text-slate-400">
    //                 {product.category}
    //             </p>


    //             <h3 className="min-h-[34px] overflow-hidden text-[11px] font-medium leading-[17px] text-slate-700">
    //                 {product.name}
    //             </h3>


    //             <div className="mt-2 flex items-center gap-1">

    //                 <Star
    //                     size={13}
    //                     fill="currentColor"
    //                     className="text-amber-400"
    //                 />

    //                 <span className="text-[11px] font-semibold text-slate-700">
    //                     {product.rating}
    //                 </span>

    //                 <span className="text-[10px] text-slate-400">
    //                     ({product.reviews})
    //                 </span>
    //             </div>


    //             <div className="mt-2 flex flex-wrap items-center gap-1.5">

    //                 <span className="text-sm font-bold text-[#111a3a]">
    //                     {product.price}
    //                 </span>

    //                 <span className="text-[10px] text-slate-400 line-through">
    //                     {product.oldPrice}
    //                 </span>
    //             </div>


    //             <div className="mt-2">
    //                 <span
    //                     className="
    //           inline-flex rounded-full
    //           bg-emerald-50
    //           px-2 py-1
    //           text-[9px]
    //           font-bold
    //           text-emerald-600
    //         "
    //                 >
    //                     {product.discount}
    //                 </span>
    //             </div>
    //         </div>
    //     </article>
    );
};

export default TrendingProducts;