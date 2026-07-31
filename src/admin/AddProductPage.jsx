import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../utils/config"
import { useToast } from "../components/ToastProvider.jsx"

const AddProductPage = () => {
  const [sellerId, setSellerId] = useState('')
  const [submitStatus, setSubmitStatus] = useState('')
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    rating: '',
    stock: '',
    image: '',
    seller: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    const rawUser = localStorage.getItem('user')
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser)
        const id = user._id || user.id || ''
        setSellerId(id)
        setFormData((prev) => ({ ...prev, seller: id }))
      } catch {
        setSellerId('')
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('loading')

    try {
      if (!API_URL) {
        throw new Error('API_URL is not configured')
      }

      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token is missing')
      }

      const payload = {
        ...formData,
        seller: sellerId || formData.seller,
        price: Number(formData.price),
        rating: Number(formData.rating),
        stock: Number(formData.stock),
      }

      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Failed to add product (${response.status}): ${text}`)
      }

      await response.json()
      setSubmitStatus('success')
      addToast('Product added successfully.', 'success')
      setTimeout(() => navigate('/admin/products'), 700)
    } catch (submitError) {
      const message = submitError.message || 'Failed to add product.'
      setSubmitStatus(message)
      addToast(message, 'error')
    }
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-[#b68a3b] to-[#906e30] text-white text-3xl font-semibold px-8 py-6 rounded-xl shadow-lg mb-6">
        Add Product
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden mb-8">
        <div className="p-6 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1c1c1c]">New product</h2>
            <p className="text-sm text-[#5d4e3f]">Add a new product to your seller catalog.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-full bg-[#f4e5d4] px-5 py-2 text-[#1c1c1c] hover:bg-[#e7d7b8] transition"
          >
            Back to Products
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Brand</label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#5d4e3f]">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Image URL</label>
            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Seller ID</label>
            <input
              name="seller"
              value={formData.seller}
              readOnly
              className="mt-2 w-full rounded-lg border border-[#d5bea8] bg-[#f4e9d7] px-4 py-3 text-[#5d4e3f] outline-none"
            />
          </div>

          <div className="md:col-span-2 flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="rounded-full bg-[#b68a3b] px-6 py-3 text-white hover:bg-[#906e30] transition"
            >
              Add Product
            </button>
            {submitStatus === 'loading' && <span className="text-sm text-[#5d4e3f]">Saving...</span>}
            {submitStatus === 'success' && <span className="text-sm text-green-600">Product added, redirecting...</span>}
            {submitStatus && submitStatus !== 'loading' && submitStatus !== 'success' && submitStatus !== 'error' && (
              <span className="text-sm text-red-600">{submitStatus}</span>
            )}
            {submitStatus === 'error' && <span className="text-sm text-red-600">Failed to add product.</span>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductPage
