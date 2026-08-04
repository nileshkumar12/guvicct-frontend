import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_URL } from '../../utils/config'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('M')
  const [relatedProducts, setRelatedProducts] = useState([])

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
    const idVal = product._id || product.id || product.sku || Date.now()
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find((c) => String(c.id) === String(idVal))
    if (existing) {
      existing.quantity = Math.min((existing.quantity || 0) + quantity, product.stock ?? Infinity)
    } else {
      cart.push({ id: idVal, name: product.name || product.title || '', price: product.price ?? 0, quantity })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    try {
      // optional small UI feedback
      alert('Added to cart')
    } catch (e) {}
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

        // fetch related products by category or brand
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
            // ignore related fetch errors
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
    <section className="py-16 bg-[#f6f2eb]">
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
            <div className="mt-8 rounded-[40px] bg-white p-8 shadow-2xl">
              <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-[34px] bg-[#f4ede3] shadow-inner">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={productTitle}
                        className="h-[560px] w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-[560px] items-center justify-center bg-[#f9f5f0] text-[#5d4e3f]">
                        No image available
                      </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-[#ffffffcc] px-4 py-2 text-sm font-semibold text-[#5d4e3f] shadow-sm">
                      Fast shipping
                    </div>
                    <button className="absolute right-4 top-4 rounded-full bg-white/90 p-3 text-[#5d4e3f] shadow-sm transition hover:bg-[#fffdfa]">
                      ❤ Save
                    </button>
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-5 gap-3">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedImage(img)}
                          className={`h-20 overflow-hidden rounded-3xl border ${img === productImage ? 'border-[#1aa184]' : 'border-[#e9e2d9]'} bg-white shadow-sm transition`}
                        >
                          <img src={img} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-5">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm uppercase tracking-[0.3em] text-[#7a674c]">Minimal women collection</span>
                      <h1 className="text-5xl font-semibold tracking-tight text-[#1c1c1c]">{productTitle}</h1>
                      <p className="text-sm text-[#5d4e3f]">{categoryName || brandName || 'Women’s clothing'}</p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-4xl font-bold text-[#1c1c1c]">
                          <span>{product.price != null ? `₹${product.price}` : '₹0'}</span>
                          {product.discount && (
                            <span className="rounded-full bg-[#f4e5d4] px-3 py-1 text-sm font-semibold text-[#1a775f]">{product.discount} OFF</span>
                          )}
                        </div>
                        {product.oldPrice && (
                          <p className="text-sm text-[#9a9a9a] line-through">₹{product.oldPrice}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#5d4e3f]">
                        {ratingValue > 0 && (
                          <span className="flex items-center gap-2 text-[#b68a3b]">
                            {ratingStars.map((star) => (
                              <span key={star}>{star <= Math.round(ratingValue) ? '★' : '☆'}</span>
                            ))}
                            <span>({ratingValue.toFixed(1)})</span>
                          </span>
                        )}
                        <span>{isInStock ? `${product.stock} in stock` : 'Out of stock'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-[#7a674c]">Select size</p>
                        <p className="mt-1 text-xs text-[#5d4e3f]">Size chart</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {sizeOptions.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`rounded-3xl border px-4 py-2 text-sm font-semibold transition ${selectedSize === size ? 'border-[#1aa184] bg-[#eaf7f0] text-[#1a775f]' : 'border-[#e9e2d9] bg-white text-[#5d4e3f]'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button className="flex-1 rounded-full border border-[#e9e2d9] bg-white px-6 py-4 text-sm font-semibold text-[#5d4e3f] transition hover:bg-[#f4f4f1]">Wishlist</button>
                    <button
                      type="button"
                      onClick={addToCart}
                      className="flex-1 rounded-full bg-[#1aa184] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#168864]"
                    >
                      Add to Cart
                    </button>
                  </div>

                  <div className="rounded-[28px] border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
                    <p className="text-base font-semibold text-[#1c1c1c]">Product details</p>
                    <p className="mt-3 text-[#5d4e3f] leading-relaxed whitespace-pre-line">{product.description || product.summary || 'No product description available.'}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[28px] border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
                      <p className="text-sm font-semibold text-[#1c1c1c]">Material & care</p>
                      <ul className="mt-3 space-y-2 text-[#5d4e3f] text-sm">
                        <li>• {product.material || 'Cotton'}</li>
                        <li>• {product.care || 'Machine wash'}</li>
                      </ul>
                    </div>
                    <div className="rounded-[28px] border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
                      <p className="text-sm font-semibold text-[#1c1c1c]">Sold by</p>
                      <p className="mt-3 text-[#5d4e3f]">{brandName || 'Wind It Store, Stillwater'}</p>
                      <p className="mt-4 text-sm text-[#5d4e3f]">{product.soldBy || 'All products come with 3-month warranty'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {relatedProducts && relatedProducts.length > 0 && (
              <div className="mt-16 rounded-[36px] bg-white p-8 shadow-2xl">
                <div className="flex items-center justify-between gap-4 border-b border-[#e9e2d9] pb-4">
                  <div>
                    <h3 className="text-3xl font-semibold text-[#1c1c1c]">Related products</h3>
                    <p className="text-sm text-[#5d4e3f]">Hand-picked selections that match your interests.</p>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {relatedProducts.slice(0, 3).map((rp) => {
                    const rid = rp._id || rp.id || rp.sku
                    const rImage = getImageSrc(rp.image || rp.imageUrl || rp.image_url || '')
                    const rName = rp.name || rp.title || 'Product'
                    return (
                      <Link
                        key={rid || rName}
                        to={`/product/${rid}`}
                        className="group overflow-hidden rounded-[28px] border border-[#e9e2d9] bg-[#fffdfa] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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
  )
}

export default ProductDetails
