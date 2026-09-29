import React, { useRef, useState, useEffect } from "react";
import { Heart, Star, ArrowRight, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { API_URL } from "../../utils/config";
import { addItem } from "../../store/cartSlice";
import { useToast } from "../../components/ToastProvider";

const extractProducts = (response) => {
    if (Array.isArray(response)) return response;
    const candidates = [
        response?.products,
        response?.items,
        response?.data?.products,
        response?.data?.items,
        response?.data,
        response?.result?.products,
        response?.result,
    ];
    return candidates.find(Array.isArray) || [];
};

const getProductId = (product) => product?._id || product?.id || product?.productId || '';

const TrendingProducts = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        try {

            const response = await fetch(`${API_URL}/api/products/trending`);
            if (!response.ok) throw new Error(`Trending products request failed (${response.status})`);
            const data = await response.json();
            let productList = extractProducts(data);
            if (productList.length < 4) {
                const catalogResponse = await fetch(`${API_URL}/api/products`);
                if (catalogResponse.ok) {
                    const catalog = extractProducts(await catalogResponse.json());
                    const knownIds = new Set(productList.map(getProductId).filter(Boolean).map(String));
                    productList = [
                        ...productList,
                        ...catalog.filter((product) => {
                            const id = getProductId(product);
                            if (!id || knownIds.has(String(id))) return false;
                            knownIds.add(String(id));
                            return true;
                        }),
                    ];
                }
            }

            const uniqueProducts = new Map();
            productList.forEach((product) => {
                const id = getProductId(product);
                if (!id || `${product.status || 'active'}`.trim().toLowerCase() === 'inactive') return;
                if (!uniqueProducts.has(String(id))) uniqueProducts.set(String(id), product);
            });
            setProducts(Array.from(uniqueProducts.values()));
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
                    <Link to="/products"
                        type="button"
                        className="group hidden items-center gap-2 text-sm font-semibold text-[#3048d8] sm:flex"
                    >
                        View All

                        <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
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
                        loop={products.length > 4}
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
                            <SwiperSlide key={getProductId(product)}>
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
    const dispatch = useDispatch();
    const { addToast } = useToast();
    const productId = getProductId(product);
    const productName = product.name || product.title || 'Product';
    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
    const stockLabel = product.stock <= 0 ? 'Out of Stock' : '';
    const stockClass = product.stock <= 0 ? 'bg-red-500 text-white' : '';

    const handleAddToCart = () => {
        if (hasVariants) {
            addToast('Choose a product variant before adding it to your cart.', 'error');
            return;
        }
        if (product.stock != null && Number(product.stock) <= 0) {
            addToast('Sorry, this product is out of stock.', 'error');
            return;
        }

        dispatch(addItem({
            id: String(productId),
            productId: String(productId),
            key: String(productId),
            name: productName,
            title: productName,
            image: product.image || product.imageUrl || product.image_url || '',
            price: Number(product.price) || 0,
            basePrice: Number(product.price) || 0,
            quantity: 1,
            stock: product.stock != null ? Number(product.stock) : Infinity,
            brand: typeof product.brand === 'string' ? product.brand : product.brand?.name || '',
            category: typeof product.category === 'string' ? product.category : product.category?.name || product.category?.title || '',
            sku: product.sku || '',
            hsnCode: product.hsnCode || '',
            gstRate: Number(product.gstRate) || 0,
            priceIncludesGST: product.priceIncludesGST === true,
        }));
        addToast(`${productName} added to cart.`, 'success');
    };

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
                <p className="text-sm mb-0 text-[#5d4e3f]"><small>{(typeof product.brand === 'string' ? product.brand : product.brand?.name) || (typeof product.category === 'string' ? product.category : product.category?.name) || 'Gift basket'}</small></p>
                <Link title={productName} to={`/product/${productId}`} className="text-lg truncate font-semibold text-[#1c1c1c] hover:text-[#4254bf]">
                    {productName}
                </Link>

                <div className="text-2xl font-bold text-[#1aa184]">
                    <div className='flex justify-between'>
                        <span className="text-sm font-bold text-4xl text-[#1aa184]">  {product.price != null ? `₹${Number(product.price).toLocaleString('en-IN')}` : '₹0.00'}</span>
                        <div className="flex flex-wrap justify-end gap-2">
                            <Link to={`/product/${productId}`} className="inline-block rounded-full bg-[#4254bf] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-[#3546ae]">
                                Buy Now
                            </Link>
                            {/* {!hasVariants && (
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#4254bf] bg-white px-4 py-2 text-sm font-semibold text-[#4254bf] transition hover:bg-[#4254bf] hover:text-white"
                                >
                                    <ShoppingCart size={16} /> Add
                                </button>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
        </article>

    );
};

export default TrendingProducts;