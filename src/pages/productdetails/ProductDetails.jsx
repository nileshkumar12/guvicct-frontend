import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { API_URL, getImageUrl } from '../../utils/config'
import { addItem } from '../../store/cartSlice'
import { useToast } from '../../components/ToastProvider.jsx'
import ProductReviews from './ProductReviews'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedFinish, setSelectedFinish] = useState('')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [openAccordion, setOpenAccordion] = useState('info')
  const dispatch = useDispatch()
  const { addToast } = useToast()

  const changeQuantity = (delta) => {
    setQuantity((q) => {
      const next = q + delta
      if (product?.stock != null) {
        if (next < 1) return 1
        return Math.min(next, Number(product.stock))
      }
      return Math.max(1, next)
    })
  }

  const addToCart = () => {
    if (!product) return
    if (!isInStock) {
      addToast('Sorry, this product is out of stock.', 'error')
      return
    }

    const idVal = product._id || product.id || product.sku || Date.now()
    const cartItem = {
      id: idVal,
      key: `${idVal}`,
      name: product.name || product.title || '',
      title: product.name || product.title || '',
      image: productImage,
      price: Number(product.price ?? 0),
      quantity,
      stock: product.stock != null ? Number(product.stock) : Infinity,
      selectedSize,
      selectedFinish,
      brand: product.brand || '',
    }

    dispatch(addItem(cartItem))
    addToast('Added to cart')
  }

  const toggleAccordion = (section) => {
    setOpenAccordion((current) => (current === section ? '' : section))
  }

  useEffect(() => {
    const fetchProduct = async () => {
      if (!API_URL) {
        setError('API_URL is not configured')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/products/${id}`)
        if (!response.ok) {
          throw new Error(`Failed to load product (${response.status})`)
        }

        const data = await response.json()
        const prod = data.product || data.data || data || null
        setProduct(prod)
        console.log('Fetched product:', prod)
        if (prod) {
          try {
            let related = []
            // prefer category-based related
            const categoryId = typeof prod.category === 'string' || typeof prod.category === 'number'
              ? prod.category
              : prod.category?._id || prod.category?.id || prod.category

            if (categoryId) {
              const relRes = await fetch(`${API_URL}/api/products?category=${encodeURIComponent(categoryId)}`)
              if (relRes.ok) {
                const relData = await relRes.json()
                related = Array.isArray(relData) ? relData : relData.products || relData.data || relData.items || relData.result || []
              }
            }

            // fallback to brand based or full list filter
            if (related.length === 0) {
              const allRes = await fetch(`${API_URL}/api/products`)
              if (allRes.ok) {
                const allData = await allRes.json()
                const all = Array.isArray(allData) ? allData : allData.products || allData.data || allData.items || allData.result || []
                related = all.filter((p) => {
                  if (!p) return false
                  const pid = p._id || p.id || p.sku
                  if (String(pid) === String(prod._id || prod.id || prod.sku)) return false
                  // match by category id or brand
                  const pCat = p.category
                  const pBrand = p.brand
                  const sameCategory = categoryId && (String(pCat) === String(categoryId) || String(pCat?._id || pCat?.id || pCat) === String(categoryId))
                  const sameBrand = prod.brand && (String(pBrand) === String(prod.brand) || String(pBrand?._id || pBrand?.id || pBrand) === String(prod.brand))
                  return sameCategory || sameBrand
                })
              }
            }

            setRelatedProducts((related || []).slice(0, 6))
          } catch (e) {

            setRelatedProducts([])
          }
        }
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to load product.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const getImageSrc = getImageUrl

  const images = [
    product?.image,
    product?.imageUrl,
    product?.image_url,
    ...(product?.gallery || []),
  ]
    .filter(Boolean)
    .map(getImageSrc)
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL']
  const productImage = selectedImage || images[0] || ''
  const productTitle = product?.name || product?.title || 'Product'
  const categoryName = typeof product?.category === 'string'
    ? product.category
    : product?.category?.name || product?.category?.title || ''
  const brandName = product?.brand || ''
  const ratingValue = Number(product?.rating) || 0
  const ratingStars = Array.from({ length: 5 }, (_, index) => index + 1)
  const isInStock = product?.stock != null && Number(product.stock) > 0
  const detailFeatures = [
    'Fast delivery within 3-5 business days',
    '7-day easy returns',
    'Secure checkout and tracking',
  ]

  return (
    <>

      <section className="py-8 bg-[#f6f2eb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/" className="text-sm text-[#5d4e3f] hover:underline">
              ← Back to home
            </Link>
            <div className="rounded-full bg-[#fff4e4] px-4 py-2 text-sm text-[#6e522f] shadow-sm">
              {categoryName || 'Shop'} / {brandName || 'Featured'}
            </div>
          </div>

          {loading ? (
            <div className="mt-8 text-[#5d4e3f]">Loading product...</div>
          ) : error ? (
            <div className="mt-8 text-red-600">{error}</div>
          ) : !product ? (
            <div className="mt-8 text-[#5d4e3f]">Product not found.</div>
          ) : (
            <>
              <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
                <div className="rounded-[10px] bg-white p-6">
                  <div className="grid gap-0">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productTitle}
                        className="w-full rounded-[32px] object-cover"
                        style={{ maxHeight: '460px' }}
                      />
                    ) : (
                      <div className="flex h-[460px] items-center justify-center rounded-[32px] bg-[#f9f5f0] text-[#5d4e3f]">
                        No image available
                      </div>
                    )}
                  </div>
                  <div className="grid gap-6">
                    <div className="grid  grid-cols-6">
                      {images.slice(0, 4).map((img, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedImage(img)}
                          className={`h-32 overflow-hidden rounded-[28px] border ${img === productImage ? 'border-[#1aa184]' : 'border-[#e9e2d9]'} bg-white shadow-sm`}
                        >
                          <img src={img} alt={`${productTitle} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-5">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-semibold tracking-tight text-[#1c1c1c]">{productTitle}</h1>
                      </div>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-4 text-5xl font-bold text-[#1c1c1c]">
                            <span className='text-4xl font-semibold pdtailsPrice' >{product.price != null ? `₹${product.price}` : '₹0'}</span>
                            {product.discount && (
                              <div className="rounded-full bg-[#f4e5d4] px-3 py-1 text-sm font-semibold text-[#1a775f]">{product.discount} OFF</div>
                            )}
                          </div>
                          {product.oldPrice && (
                            <p className="text-sm text-5xl text-[#9a9a9a] line-through">₹{product.oldPrice}</p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-[#5d4e3f]">
                          {/* {ratingValue > 0 && (
                          <span className="flex items-center gap-2 text-[#b68a3b]">
                            {ratingStars.map((star) => (
                              <span key={star}>{star <= Math.round(ratingValue) ? '★' : '☆'}</span>
                            ))}
                            <span>({ratingValue.toFixed(1)})</span>
                          </span>
                        )} */}
                          {/* <span>{isInStock ? `${product.stock} in stock` : 'Out of stock'}</span> */}
                        </div>
                      </div>
                    </div>

                    {/* <div className="rounded-[28px] border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-[#7a674c]">Ring size</p>
                        <p className="mt-1 text-xs text-[#5d4e3f]">Pick your size</p>
                      </div>
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-36 rounded-3xl border border-[#d1c8b5] bg-white px-4 py-3 text-sm text-[#1c1c1c] outline-none transition focus:border-[#1aa184]"
                      >
                        {sizeOptions.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-[#7a674c]">Finishing</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Shiny', 'Matte', 'Glossy'].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setSelectedFinish(option)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedFinish === option ? 'bg-[#1aa184] text-white' : 'bg-white text-[#5d4e3f] border border-[#e9e2d9]'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div> */}

                    <div className="grid gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm  text-[#222222]">Quantity</span>
                        <div className="inline-flex overflow-hidden rounded-full border border-[#e9e2d9] bg-white shadow-sm">
                          <button
                            type="button"
                            onClick={() => changeQuantity(-1)}
                            className="px-4 py-3 text-sm font-semibold text-[#5d4e3f] transition hover:bg-[#f4f4f1]"
                          >
                            −
                          </button>
                          <span className="w-14 border-x border-[#e9e2d9] bg-[#f9f5f0] py-3 text-center text-sm font-semibold text-[#1c1c1c]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(1)}
                            className="px-4 py-3 text-sm font-semibold text-[#5d4e3f] transition hover:bg-[#f4f4f1]"
                          >
                            +
                          </button>
                        </div>
                        {product?.stock != null && (
                          <span className="text-sm text-[#5d4e3f]">Max {product.stock}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={addToCart}
                          className="flex-1 rounded-full bg-[#b68a3b] border border-[#b68a3b]  px-6 py-4 text-sm font-semibold text-[#ffffff] transition hover:bg-[#906e30]"
                        >
                          Add to Cart
                        </button>
                        <Link to="/cart" onClick={addToCart} className="flex-1 block text-center rounded-full bg-[#1aa184] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#168864]">Buy Now</Link>

                      </div>
                    </div>
                    <div className="rounded-[10px] border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
                      <p className="text-base font-semibold text-[#1c1c1c]">Product Description:</p>
                      <p className="mt-3 text-[#5d4e3f] leading-relaxed whitespace-pre-line">{product.description || product.summary || 'No product description available.'}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">

                      <div className="rounded-[10px] border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
                        <p className="text-sm font-semibold text-[#1c1c1c]">
                          Sold By
                        </p>
                        <p className="mt-4 text-sm text-[#5d4e3f]">

                          <strong>Store Name:</strong> {product.store.storeName}
                        </p>
                        <p className="mt-3 text-[#5d4e3f]">
                          <strong>Brand:</strong> {brandName}
                        </p>

                      </div>
                    </div>


                  </div>
                </div>
              </div>

              <ProductReviews productId={product?._id} />

              {relatedProducts && relatedProducts.length > 0 && (
                <div className="rounded-[10px] mt-8 border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-[#e9e2d9] pb-4">
                    <div>
                      <h3 className="text-3xl font-semibold text-[#1c1c1c]">Related products</h3>
                      <p className="text-sm text-[#5d4e3f]">Hand-picked selections that match your interests.</p>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-1 xl:grid-cols-4">
                    {relatedProducts.slice(0, 3).map((rp) => {
                      const rid = rp._id || rp.id || rp.sku
                      const rImage = getImageSrc(rp.image || rp.imageUrl || rp.image_url || '')
                      const rName = rp.name || rp.title || 'Product'
                      return (
                        <Link
                          key={rid || rName}
                          to={`/product/${rid}`}
                          className="group overflow-hidden rounded-[10px] border border-[#e9e2d9] bg-[#fffdfa] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                          {rImage ? (
                            <img src={rImage} alt={rName} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="flex h-56 items-center justify-center bg-[#f9f5f0] text-[#5d4e3f]">No image</div>
                          )}
                          <div className="p-5">
                            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7a674c]">Recommended</div>
                            <div className="mt-3 text-xl font-semibold text-[#1c1c1c]">{rName}</div>
                            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[#5d4e3f]">
                              <span>{rp.brand || 'Brand'}</span>
                              <span className="font-semibold text-[#1c1c1c]">{rp.price != null ? `₹${rp.price}` : '₹0.00'}</span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}


            </>
          )}
        </div>
      </section>

    </>
  )
}

export default ProductDetails
