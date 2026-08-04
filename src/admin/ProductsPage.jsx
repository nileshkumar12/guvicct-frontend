import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { API_URL, getImageUrl } from "../utils/config"
import { useToast } from "../components/ToastProvider.jsx"

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sellerId, setSellerId] = useState(null)
  const [sellerLoaded, setSellerLoaded] = useState(false)
  const { addToast } = useToast()

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Failed to delete product (${response.status}): ${text}`)
      }
      setProducts((current) => current.filter((item) => (item._id || item.id) !== productId))
      addToast('Product deleted successfully.', 'success')
    } catch (deleteError) {
      const message = deleteError.message || 'Failed to delete product.'
      setError(message)
      addToast(message, 'error')
    }
  }

  useEffect(() => {
    const rawUser = localStorage.getItem('user')
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser)
        const id = user._id || user.id || ''
        setSellerId(id)
      } catch {
        setSellerId('')
      }
    }
    setSellerLoaded(true)
  }, [])

  useEffect(() => {
    if (!sellerLoaded) return

    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        if (!API_URL) {
          throw new Error('API_URL is not configured')
        }

        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/api/products`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch products (${response.status})`)
        }

        const data = await response.json()
        const allProducts = Array.isArray(data) ? data : data.products || data.data || []
        const filtered = sellerId
          ? allProducts.filter((product) => {
              const sellerValue =
                typeof product.seller === 'string' || typeof product.seller === 'number'
                  ? product.seller.toString()
                  : product.seller?._id
                  ? product.seller._id.toString()
                  : product.seller?.id
                  ? product.seller.id.toString()
                  : ''
              return sellerValue === sellerId?.toString()
            })
          : allProducts
        setProducts(filtered)
      } catch (fetchError) {
        const message = fetchError.message || 'Failed to load products.'
        setError(message)
        addToast(message, 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [sellerLoaded, sellerId])

  return (
    <div>
      <div className="bg-gradient-to-r from-[#b68a3b] to-[#906e30] text-white text-3xl font-semibold px-8 py-6 rounded-xl shadow-lg mb-6">
        Products
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#1c1c1c]">Seller products</h2>
          <p className="text-sm text-[#5d4e3f]">Viewing products assigned to your seller account.</p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center rounded-full bg-[#b68a3b] px-6 py-3 text-white hover:bg-[#906e30] transition"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-[#1c1c1c]">Product catalog</h2>
            <p className="text-sm text-[#5d4e3f]">Showing products for seller ID {sellerId || 'all sellers'}.</p>
          </div>
        </div>
        <div className="overflow-x-auto p-6">
          {loading ? (
            <div className="text-sm text-[#5d4e3f]">Loading products...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-sm text-[#5d4e3f]">No products found.</div>
          ) : (
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b bg-[#fffdfa]">
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Product</th>
                  
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const productId = product._id || product.id || ''
                  const image = product.image || product.imagePreview || ''
                  const imageSrc = getImageUrl(image)

                  return (
                    <tr key={productId || index} className="border-b">
                      <td className="px-4 py-4">{index + 1}</td>
                       <td className="px-4 py-4">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={product.name || 'Product'}
                            className="h-12 w-20 rounded-lg object-cover border border-[#d5bea8]"
                          />
                        ) : (
                          <div className="h-12 w-20 rounded-lg bg-[#fffdfa] border border-[#f0ece6]" />
                        )}
                      </td>
                      <td className="px-4 py-4">{product.name || product.title || '—'}</td>
                     
                      <td className="px-4 py-4">{product.brand || '—'}</td>
                      <td className="px-4 py-4">{product.price != null ? `₹${product.price}` : '—'}</td>
                      <td className="px-4 py-4">{product.stock != null ? product.stock : '—'}</td>
                      <td className="px-4 py-4 space-x-2">
                        <Link
                          to={`/admin/products/${productId}/edit`}
                          className="rounded-full bg-[#f4e5d4] px-3 py-1 text-sm text-[#1c1c1c] hover:bg-[#e7d7b8]"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(productId)}
                          className="rounded-full bg-[#f87171] px-3 py-1 text-sm text-white hover:bg-[#ef4444]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
