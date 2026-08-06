import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { API_URL, getImageUrl } from '../../utils/config'
import { Heart, Search, ShoppingCart } from 'lucide-react'
import { addToWishlist, removeFromWishlist } from '../../store/wishlistSlice'

const CategoryProducts = () => {
  const { id } = useParams()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchTerm = (queryParams.get('search') || '').trim().toLowerCase()
  const dispatch = useDispatch()
  const wishlistItems = useSelector((state) => state.wishlist.items)
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!API_URL) {
        setError('API_URL is not configured')
        setLoading(false)
        return
      }

      try {
        let currentCategory = null
        const listResponse = await fetch(`${API_URL}/api/categories`)
        if (!listResponse.ok) {
          throw new Error(`Failed to load category (${listResponse.status})`)
        }
        const listData = await listResponse.json()
        const categoryList = Array.isArray(listData)
          ? listData
          : listData.categories || listData.data || listData.items || listData.result || []
        currentCategory = categoryList.find(
          (item) =>
            item._id === id ||
            item.id === id ||
            String(item._id) === String(id) ||
            String(item.id) === String(id) ||
            item.slug === id ||
            item.name === id ||
            item.title === id,
        )

        setCategory(currentCategory)

        const isAllCategory = String(id).toLowerCase() === 'all'
        const productResponse = isAllCategory
          ? await fetch(`${API_URL}/api/products`)
          : await fetch(`${API_URL}/api/products?category=${id}`)
        let productList = []
        if (productResponse.ok) {
          const rawProducts = await productResponse.json()
          productList = Array.isArray(rawProducts)
            ? rawProducts
            : rawProducts.products || rawProducts.data || rawProducts.items || rawProducts.result || []
        } else {
          const allResponse = await fetch(`${API_URL}/api/products`)
          if (!allResponse.ok) {
            throw new Error(`Failed to load products (${allResponse.status})`)
          }
          const rawProducts = await allResponse.json()
          const allProducts = Array.isArray(rawProducts)
            ? rawProducts
            : rawProducts.products || rawProducts.data || rawProducts.items || rawProducts.result || []
          productList = isAllCategory
            ? allProducts
            : allProducts.filter((product) => {
            const productCategory = product.category
            if (!productCategory) return false
            if (typeof productCategory === 'string' || typeof productCategory === 'number') {
              return String(productCategory) === String(id)
            }
            return (
              String(productCategory._id || productCategory.id || productCategory) === String(id) ||
              String(productCategory.name || productCategory.title) === String(id)
            )
          })
        }

        const filteredProducts = searchTerm
          ? productList.filter((product) => {
              const productText = [
                product.name,
                product.title,
                product.description,
                product.brand,
                product.category?.name || product.category?.title || product.category,
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

              return productText.includes(searchTerm)
            })
          : productList

        setProducts(filteredProducts)
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to load category products.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryProducts()
  }, [id, searchTerm])

  const getImageSrc = getImageUrl

  const categoryName = category?.name || category?.title || category?.category || 'Search Results'
  const categoryDescription = category?.description || category?.summary || ''

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Link to="/" className="text-sm text-[#5d4e3f] hover:underline">
            Home
          </Link>
          <span className="mx-2 text-[#5d4e3f]">/</span>
          <span className="text-sm text-[#1c1c1c]">{categoryName}</span>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-[#1c1c1c]">{categoryName}</h1>
          {categoryDescription && <p className="mt-3 text-[#5d4e3f] text-lg">{categoryDescription}</p>}
        </div>
   

        {loading ? (
          <div className="text-[#5d4e3f]">Loading products...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-[#5d4e3f]">
            {searchTerm ? `No products found for "${searchTerm}" in this category.` : 'No products found for this category.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const productName = product.name || product.title || 'Unnamed product'
              const productImage = getImageSrc(product.image || product.imageUrl || product.image_url || '')
              const stockLabel = product.stock == null ? 'Out of stock' : product.stock <= 5 ? 'Low stock' : 'In stock'
              const stockClass = product.stock == null ? 'bg-red-600 text-white' : product.stock <= 5 ? 'bg-amber-500 text-[#1c1c1c]' : 'bg-emerald-500 text-white'
              const productId = product._id || product.id || product.sku || productName
              const wishlistKey = `${productId}`
              const isWishlisted = wishlistItems.some((item) => item.key === wishlistKey)
              const handleWishlistToggle = (event) => {
                event.preventDefault()
                event.stopPropagation()
                if (isWishlisted) {
                  dispatch(removeFromWishlist(wishlistKey))
                } else {
                  dispatch(addToWishlist({
                    key: wishlistKey,
                    id: productId,
                    name: productName,
                    price: product.price,
                    image: product.image || product.imageUrl || product.image_url || '',
                  }))
                }
              }
              return (
                <article
                  key={productId}
                  className="group relative overflow-hidden rounded-3xl border border-[#e9e2d9] bg-white shadow-sm"
                >
                  <div className="relative overflow-hidden pt-3">
                    <Link to={`/product/${productId}`}>
                    {productImage ? (
                       
                      <img
                        src={productImage}
                        alt={productName}
                        className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                     
                    ) : (
                      <div className="flex h-72 items-center justify-center bg-[#f9f5f0] text-[#5d4e3f]">
                        No image
                      </div>
                    )}

                    <div className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] shadow-lg ${stockClass}`}>
                      {stockLabel}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"></div></Link>
 
                    <div className="absolute right-4 top-4 flex flex-col gap-3 opacity-0 transition duration-300 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={handleWishlistToggle}
                        className={`group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white ${
                          isWishlisted ? 'text-red-500' : 'text-[#1c1c1c]'
                        }`}
                      >
                        <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                        <span className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 rounded-full bg-black px-3 py-1 text-xs text-white">
                          {isWishlisted ? 'Saved' : 'Wishlist'}
                        </span>
                      </button>
                      <Link to={`/product/${productId}?action=quickview`} className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#1c1c1c] shadow-lg hover:bg-white">
                        <Search size={20} />
                        <span className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 rounded-full bg-black px-3 py-1 text-xs text-white">
                          Quick View
                        </span>
                      </Link>
                      <Link to={`/product/${productId}?action=addcart`} className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#1c1c1c] shadow-lg hover:bg-white">
                        <ShoppingCart size={20} />
                        <span className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 rounded-full bg-black px-3 py-1 text-xs text-white">
                          Add Cart
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <Link to={`/product/${productId}`} className="text-lg font-semibold text-[#1c1c1c] hover:text-[#b68a3b]">
                      {productName}
                    </Link>
                    <p className="text-sm text-[#5d4e3f]">{product.brand || product.category || 'Gift basket'}</p>
                    <div className="text-2xl font-bold text-[#1c1c1c]">
                      {product.price != null ? `₹${product.price}` : '₹0.00'}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default CategoryProducts
