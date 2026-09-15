import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { API_URL, getImageUrl } from '../../utils/config'
import { useSelector, useDispatch } from 'react-redux'
import { Heart, Search, ShoppingCart } from 'lucide-react'
import { addToWishlist, removeFromWishlist } from '../../store/wishlistSlice'
import { addItem } from '../../store/cartSlice'
import { useToast } from '../../components/ToastProvider.jsx'


const Products = () => {
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(false)   
    const wishlistItems = useSelector((state) => state.wishlist.items)

    const dispatch = useDispatch()
    const { addToast } = useToast()


    useEffect(() => {
        setLoading(true)
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products`)

                if (!response.ok) {
                    throw new Error('Failed to fetch products')
                }

                const data = await response.json()
                const activeProducts = (data.data || []).filter(
                    (item) => `${item.status || 'active'}`.trim().toLowerCase() !== 'inactive'
                )
                setProduct(activeProducts)
                console.log(data.data)
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
        console.log(product);
    }, [])

    const addToCart = (product) => {
        console.log('Adding product to cart:', product);
        if (!product) {
            addToast('Product not found.', 'error')
            return
        }

        const productId =
            product._id ||
            product.id ||
            product.sku

        if (!productId) {
            console.error(
                'Product ID missing:',
                product
            )

            addToast(
                'Unable to add product. Product ID is missing.',
                'error'
            )

            return
        }

        const stock =
            product.stock != null
                ? Number(product.stock)
                : 0

        if (product.stock == null || stock <= 0) {
            addToast(
                'Sorry, this product is out of stock.',
                'error'
            )

            return
        }


        const productImage = getImageUrl(
            product.image ||
            product.imageUrl ||
            product.image_url ||
            ''
        )

        const cartKey = String(productId)

        const cartItem = {
            id: String(productId),

            key: cartKey,

            productId: String(productId),

            name:
                product.name ||
                product.title ||
                'Product',

            title:
                product.name ||
                product.title ||
                'Product',

            image: productImage,

            price: Number(product.price || 0),

            quantity: 1,

            stock: stock,

            selectedSize: '',

            selectedFinish: '',

            brand:
                typeof product.brand === 'string'
                    ? product.brand
                    : product.brand?.name || '',

            category:
                typeof product.category === 'string'
                    ? product.category
                    : product.category?.name ||
                    product.category?.title ||
                    '',

            sku: product.sku || '',

            hsnCode: product.hsnCode || '',

            gstRate: Number(product.gstRate) || 0,

            priceIncludesGST: product.priceIncludesGST === true,
        }

        console.log(
            'Adding product to cart:',
            cartItem
        )

        dispatch(addItem(cartItem))

        addToast(
            `${cartItem.name} added to cart.`,
            'success'
        )
    }



    return (
        <>
            <div className="mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">All Products</h1>
                
                {loading ? (
                    <div className="col-span-full  py-5">
                        <p className="text-lg text-gray-500">Loading products...</p>
                    </div>
                ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
                    {product.map((item) => {

                        const stockClass = item.stock == null ? 'bg-red-600 text-white' : item.stock <= 5 ? 'bg-amber-500 text-[#1c1c1c]' : 'bg-emerald-500 text-white'
                        const productId = item._id || item.id || item.sku
                        const wishlistKey = `${productId}`
                        const isWishlisted = wishlistItems.some((wishlistItem) => wishlistItem.key === wishlistKey)
                        const handleWishlistToggle = (event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (isWishlisted) {
                                dispatch(removeFromWishlist(wishlistKey))
                            } else {
                                dispatch(addToWishlist({
                                    key: wishlistKey,
                                    id: productId,
                                    name: item.name,
                                    price: item.price,
                                    image: item.image || item.imageUrl || item.image_url || '',
                                }))
                            }
                        }
                        return (
                            <article
                                key={item._id}
                                className="group relative overflow-hidden rounded-2xl border border-[#e9e2d9] bg-white shadow-sm"
                            >
                                <div className="relative overflow-hidden pt-3">
                                    <Link to={`/product/${item._id}`} className="relative block h-72 w-full">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-72 m-auto transition duration-500 group-hover:scale-105"
                                            />

                                        ) : (
                                            <div className="flex h-72 items-center justify-center bg-[#f9f5f0] text-[#5d4e3f]">
                                                No image
                                            </div>
                                        )}
                                        {item.stock <= 0 && (
                                            <div className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] shadow-lg ${stockClass}`}>
                                               Out of Stock
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"></div></Link>

                                    <div className="absolute right-4 top-4 flex flex-col gap-3 opacity-0 transition duration-300 group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={handleWishlistToggle}
                                            className={`group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white ${isWishlisted ? 'text-red-500' : 'text-[#1c1c1c]'
                                                }`}
                                        >
                                            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                                            <span className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 rounded-full bg-black px-3 py-1 text-xs text-white">
                                                {isWishlisted ? 'Saved' : 'Wishlist'}
                                            </span>
                                        </button>

                                        <Link to={`/product/${item._id}`} onClick={() =>
                                            addToCart(item)
                                        } className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#1c1c1c] shadow-lg hover:bg-white">
                                            <ShoppingCart size={20} />
                                            <span className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 rounded-full bg-black px-3 py-1 text-xs text-white">
                                                Add Cart
                                            </span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-4 p-6">
                                    <Link to={`/product/${item._id}`} className="text-lg font-semibold text-[#1c1c1c] hover:text-[#4254bf]">
                                        {item.name ? item.name : 'Unnamed Product'}
                                    </Link>
                                    <p className="text-sm text-[#5d4e3f]">{item.brand || item.category}</p>
                                    <div className="text-2xl font-bold text-[#1c1c1c]">
                                        <div className='flex justify-between'>
                                            <span className="text-sm font-bold text-4xl text-[#1aa184]"> {item.price != null ? `₹${Number(item.price).toLocaleString('en-IN')}` : '₹0.00'}</span>
                                        <Link to={`/product/${item._id}`} className="inline-block text-right rounded-full bg-[#4254bf] px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-[#3546ae]">
                                       Buy Now
                                    </Link>
                                        </div>
                                       
                                          
                                    </div>
                                  
                                </div>
                            </article>
                        )
                    })}
                 
                </div>
                   )}
            </div>
               

        </>

    )
}

export default Products