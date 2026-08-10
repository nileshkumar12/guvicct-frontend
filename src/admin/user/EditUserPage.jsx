import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { API_URL } from "../../utils/config.js"
import { useToast } from "../../components/ToastProvider.jsx"

const EditUserPage = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitStatus, setSubmitStatus] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'buyer' })
  const navigate = useNavigate()
  const { addToast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!API_URL) throw new Error('API_URL is not configured')
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/users/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (!response.ok) throw new Error(`Failed to fetch user (${response.status})`)
        const data = await response.json()
        const item =
          data.user ||
          data.data?.user ||
          data.data ||
          data.result ||
          data ||
          {}
        setUser(item)
        setFormData({
          name: item.name || '',
          email: item.email || '',
          phone: item.phone || '',
          role: item.role || 'buyer',
        })
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
   
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('loading')
    try {
      if (!API_URL) throw new Error('API_URL is not configured')
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Failed to update user (${response.status}): ${text}`)
      }
      setSubmitStatus('success')
      addToast('User updated successfully.', 'success')
      setTimeout(() => navigate('/admin/users'), 700)
    } catch (submitError) {
      const message = submitError.message || 'Failed to update user.'
      setSubmitStatus(message)
      addToast(message, 'error')
    }
  }

  const userRole = JSON.parse(localStorage.getItem("user"));

  if (loading) {
    return <div className="text-[#5d4e3f]">Loading user...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-[#b68a3b] to-[#906e30] text-white text-3xl font-semibold px-8 py-6 rounded-xl shadow-lg mb-6">
        Edit User
      </div>
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden mb-8">
        <div className="p-6 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1c1c1c]">Edit user account</h2>
            <p className="text-sm text-[#5d4e3f]">Update user details and role.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="rounded-full bg-[#f4e5d4] px-5 py-2 text-[#1c1c1c] hover:bg-[#e7d7b8] transition"
          >
            Back to Users
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
            <label className="block text-sm font-medium text-[#5d4e3f]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#5d4e3f]">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              {userRole.role === "admin" && (
                <option value="admin">Admin</option>
              )}
            </select>
          </div>
          <div className="md:col-span-2 flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="rounded-full bg-[#b68a3b] px-6 py-3 text-white hover:bg-[#906e30] transition"
            >
              Save Changes
            </button>
           
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserPage
