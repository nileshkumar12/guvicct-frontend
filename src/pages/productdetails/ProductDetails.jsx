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
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [selectedAddons, setSelectedAddons] = useState([])
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isZooming, setIsZooming] = useState(false)
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
    if (variants.length && !selectedVariant) {
      addToast('Please select a product variant.', 'error')
      return
    }
    if (!isInStock) {
      addToast('Sorry, this product is out of stock.', 'error')
      return
    }

    const idVal = product._id || product.id || product.sku || Date.now()
    const variantId = selectedVariant?._id || selectedVariant?.id || selectedVariant?.sku || ''
    const basePrice = Number(selectedVariant?.price ?? product.price ?? 0)
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + Number(addon.price || 0), 0)
    const addonKey = selectedAddons.map((addon) => addon.key).sort().join(',')
    const cartItem = {
      id: idVal,
      key: `${idVal}${variantId ? `:${variantId}` : ''}${addonKey ? `:addons-${addonKey}` : ''}`,
      productId: idVal,
      variantId,
      variantSku: selectedVariant?.sku || '',
      variantAttributes: { ...selectedVariant?.attributes, ...selectedAttributes },
      name: product.name || product.title || '',
      title: product.name || product.title || '',
      image: productImage,
      basePrice,
      addonTotal,
      price: basePrice + addonTotal,
      addons: selectedAddons,
      quantity,
      stock: selectedVariant?.stock != null ? Number(selectedVariant.stock) : product.stock != null ? Number(product.stock) : Infinity,
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

  const variants = (product?.variants || []).filter((variant) => variant.status === 'active')
  const selectedVariant = variants.find((variant) => `${variant._id || variant.id || variant.sku || ''}` === selectedVariantId)
  const normalizeAttributeValue = (value) => String(value ?? '').trim().toLowerCase()
  const getVariantAttributeValue = (variant, attributeName) => {
    const entry = Object.entries(variant?.attributes || {}).find(([name]) =>
      normalizeAttributeValue(name) === normalizeAttributeValue(attributeName),
    )
    return entry?.[1]
  }
  const getSelectedAttributeValue = (attributeName) => {
    const entry = Object.entries(selectedAttributes).find(([name]) =>
      normalizeAttributeValue(name) === normalizeAttributeValue(attributeName),
    )
    return entry?.[1]
  }
  const variantAttributes = variants.reduce((groups, variant) => {
    Object.entries(variant.attributes || {}).forEach(([name, value]) => {
      if (!value) return
      const groupName = Object.keys(groups).find((key) =>
        normalizeAttributeValue(key) === normalizeAttributeValue(name),
      ) || name
      groups[groupName] = Array.from(new Set([...(groups[groupName] || []), value]))
    })
    return groups
  }, {})
  const isAttributeValueAvailable = (attributeName, value) =>
    variants.some((variant) => {
      const matchesValue = normalizeAttributeValue(getVariantAttributeValue(variant, attributeName)) === normalizeAttributeValue(value)
      const matchesOtherSelections = Object.entries(selectedAttributes).every(([name, selectedValue]) =>
        normalizeAttributeValue(name) === normalizeAttributeValue(attributeName) ||
        normalizeAttributeValue(getVariantAttributeValue(variant, name)) === normalizeAttributeValue(selectedValue),
      )
      return matchesValue && matchesOtherSelections
    })
  const availableVariantAttributes = Object.fromEntries(
    Object.entries(variantAttributes)
      .map(([name, values]) => [name, values.filter((value) => isAttributeValueAvailable(name, value))])
      .filter(([, values]) => values.length > 0),
  )
  const getUniqueImages = (imageSources) => Array.from(new Set(
    imageSources
      .filter(Boolean)
      .map(getImageSrc)
      .filter(Boolean),
  ))
  const productImages = getUniqueImages([
    product?.image,
    product?.imageUrl,
    product?.image_url,
    ...(product?.gallery || []),
    ...(product?.images || []),
  ])
  const selectedVariantImages = getUniqueImages([
    selectedVariant?.image,
    ...(selectedVariant?.images || []),
  ])
  const images = selectedVariant
    ? (selectedVariantImages.length ? selectedVariantImages : productImages)
    : productImages

  useEffect(() => {
    const firstVariant = variants[0]
    const variantId = firstVariant?._id || firstVariant?.id || firstVariant?.sku || ''
    setSelectedVariantId(`${variantId}`)
    setSelectedAttributes(firstVariant?.attributes || {})
    setSelectedAddons((product?.addons || [])
      .filter((addon) => addon.status !== 'inactive' && addon.isRequired)
      .map((addon, index) => ({
        ...addon,
        key: addon._id || addon.id || `${index}-${addon.name}`,
        price: Number(addon.price) || 0,
      })))
    setQuantity(1)
  }, [product])

  useEffect(() => {
    const nextImage = images[0] || ''
    setSelectedImage((currentImage) => currentImage === nextImage ? currentImage : nextImage)
  }, [selectedVariantId, product])

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL']
  const productImage = selectedImage || images[0] || ''
  const productTitle = product?.name || product?.title || 'Product'
  const categoryName = typeof product?.category === 'string'
    ? product.category
    : product?.category?.name || product?.category?.title || ''
  const brandName = product?.brand || ''
  const ratingValue = Number(product?.rating) || 0
  const ratingStars = Array.from({ length: 5 }, (_, index) => index + 1)
  const isInStock = selectedVariant?.stock != null
    ? Number(selectedVariant.stock) > 0
    : product?.stock != null && Number(product.stock) > 0
  const displayedPrice = selectedVariant?.price ?? product?.price
  const activeAddons = (product?.addons || []).filter((addon) => addon.status !== 'inactive')
  const addonTotal = selectedAddons.reduce((sum, addon) => sum + Number(addon.price || 0), 0)
  const totalDisplayedPrice = Number(displayedPrice || 0) + addonTotal

  const toggleAddon = (addon, checked, index) => {
    const key = addon._id || addon.id || `${index}-${addon.name}`
    const normalizedAddon = { ...addon, key, price: Number(addon.price) || 0 }
    setSelectedAddons((current) => checked
      ? [...current.filter((item) => item.key !== key), normalizedAddon]
      : current.filter((item) => item.key !== key))
  }

  const selectAttribute = (attributeName, value) => {
    const nextAttributes = { ...selectedAttributes, [attributeName]: value }
    const matchingVariant = variants.find((variant) =>
      Object.entries(nextAttributes).every(([name, selectedValue]) =>
        normalizeAttributeValue(getVariantAttributeValue(variant, name)) === normalizeAttributeValue(selectedValue),
      ),
    ) || variants.find((variant) =>
      normalizeAttributeValue(getVariantAttributeValue(variant, attributeName)) === normalizeAttributeValue(value),
    )
    if (!matchingVariant) return

    const variantId = matchingVariant._id || matchingVariant.id || matchingVariant.sku || ''
    setSelectedVariantId(`${variantId}`)
    setSelectedAttributes(matchingVariant.attributes || nextAttributes)
    setSelectedImage(getImageUrl(matchingVariant.image || matchingVariant.images?.[0] || ''))
    setQuantity(1)
  }

  const updateZoomPosition = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    setZoomPosition({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    })
  }
  const detailFeatures = [
    'Fast delivery within 3-5 business days',
    '7-day easy returns',
    'Secure checkout and tracking',
  ]

  return (
    <>

      <section className="py-8 bg-[#f6f2eb]">
        <div className=" mx-auto px-6">
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
                <div className="rounded-[10px] bg-white p-6 shadow-sm">
                  <div className="grid gap-0">
                    {productImage ? (
                      <div
                        className="overflow-hidden rounded-[10px]"
                        onMouseEnter={() => setIsZooming(true)}
                        onMouseLeave={() => setIsZooming(false)}
                        onMouseMove={updateZoomPosition}
                      >
                        {/* <img
                          src={productImage}
                          alt={productTitle}
                          className="w-full object-cover transition-transform duration-200"
                          style={{ maxHeight: '460px', transform: isZooming ? 'scale(1.75)' : 'scale(1)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }}
                        /> */}
                         <img
                          src={productImage}
                          alt={productTitle}
                          className="w-auto m-auto transition-transform duration-200"
                          style={{ maxHeight: '460px', transform: isZooming ? 'scale(1.75)' : 'scale(1)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`, maxWidth: '100%' }}
                        />
                      </div>
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
                          className={`h-22 m-2 overflow-hidden rounded-[10px] p-2 border ${img === productImage ? 'border-[#1aa184]' : 'border-[#e9e2d9]'} bg-white shadow-sm`}
                        >
                          <img src={img} alt={`${productTitle} thumbnail ${index + 1}`} className=" w-full" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-6">
                    <div className="space-y-5">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight text-[#1c1c1c]">{productTitle}</h1>
                      </div>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-4 text-5xl font-bold text-[#1c1c1c]">
                            <span className='text-4xl font-semibold pdtailsPrice' >₹{totalDisplayedPrice.toLocaleString('en-IN')}</span>
                            {product.discount && (
                              <div className="rounded-full bg-[#f4e5d4] px-3 py-1 text-sm font-semibold text-[#1a775f]">{product.discount} OFF</div>
                            )}
                          </div>
                          {product.oldPrice && (
                            <p className="text-sm text-5xl text-[#9a9a9a] line-through">₹{Number(product.oldPrice).toLocaleString('en-IN')}</p>
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

                    {Object.entries(availableVariantAttributes).map(([attributeName, values]) => (
                      <div key={attributeName} className="">
                        <p className="text-sm font-semibold capitalize text-[#1c1c1c]">{attributeName}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {values.map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => selectAttribute(attributeName, value)}
                              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${normalizeAttributeValue(getSelectedAttributeValue(attributeName)) === normalizeAttributeValue(value) ? 'border-[#1aa184] bg-[#1aa184] text-white' : 'border-[#e9e2d9] bg-white text-[#5d4e3f]'}`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="grid gap-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm  font-semibold text-[#222222]">Quantity</span>
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
                        {(selectedVariant?.stock ?? product?.stock) != null && (
                          <span className="text-sm text-[#5d4e3f]">Max {selectedVariant?.stock ?? product.stock}</span>
                        )}
                      </div>
                      {activeAddons.length > 0 && (
                        <div className="">
                          <p className="text-sm font-semibold text-[#1c1c1c]">Add-ons</p>
                          <div className="mt-3 space-y-3">
                            {activeAddons.map((addon, index) => {
                              const addonKey = addon._id || addon.id || `${index}-${addon.name}`
                              const isSelected = selectedAddons.some((item) => item.key === addonKey)
                              return (
                                <label key={addonKey} className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#e9e2d9] bg-white p-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(event) => toggleAddon(addon, event.target.checked, index)}
                                    className="mt-1 h-4 w-4 accent-[#1aa184]"
                                  />
                                  <span className="flex-1">
                                    <span className="flex justify-between gap-3 text-sm font-semibold text-[#1c1c1c]">
                                      <span>{addon.name || 'Add-on'}</span>
                                      <span>+₹{Number(addon.price || 0).toLocaleString('en-IN')}</span>
                                    </span>
                                    {addon.description && <span className="mt-1 block text-xs text-[#5d4e3f]">{addon.description}</span>}
                                  </span>
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      )}
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
                    {Array.isArray(product.specifications) && product.specifications.length > 0 && (
                      <div className="rounded-[10px] border border-[#e9e2d9] bg-[#fffdfa] p-6 shadow-sm">
                        <p className="text-base font-semibold text-[#1c1c1c]">Product Specifications:</p>
                        <div className="mt-3 divide-y divide-[#e9e2d9]">
                          {product.specifications.map((specification, index) => (
                            <div key={`${specification.name || 'specification'}-${index}`} className="flex justify-between gap-4 py-2 text-sm">
                              <span className="font-medium text-[#1c1c1c]">{specification.name}</span>
                              <span className="text-right text-[#5d4e3f]">{specification.value}{specification.unit ? ` ${specification.unit}` : ''}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                      <h3 className="text-3xl font-semibold text-[#1c1c1c]">Related Products</h3>
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
                          className="group overflow-hidden relative overflow-hidden pt-3 rounded-[10px] border border-[#e9e2d9] bg-[#ffffff] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                        >
                          {rImage ? (
                            <img src={rImage} alt={rName} className="h-72 m-auto transition duration-500 group-hover:scale-105" />
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
