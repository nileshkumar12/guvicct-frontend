import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../utils/config"
import { useToast } from "../components/ToastProvider.jsx"

const AddUserPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'buyer' })
  const [submitStatus, setSubmitStatus] = useState('')
  const navigate = useNavigate()
  const { addToast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('loading')
    try {
      if (!API_URL) throw new Error('API_URL is not configured')
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Failed to create user (${response.status}): ${text}`)
      }
      setSubmitStatus('success')
      addToast('User created successfully.', 'success')
      setTimeout(() => navigate('/admin/users'), 700)
    } catch (submitError) {
      const message = submitError.message || 'Failed to create user.'
      setSubmitStatus(message)
      addToast(message, 'error')
    }
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-[#b68a3b] to-[#906e30] text-white text-3xl font-semibold px-8 py-6 rounded-xl shadow-lg mb-6">
        Add User
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden mb-8">
        <div className="p-6 border-b flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#1c1c1c]">New user</h2>
            <p className="text-sm text-[#5d4e3f]">Create a new buyer or seller account.</p>
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
          <div>
            <label className="block text-sm font-medium text-[#5d4e3f]">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[#d5bea8] px-4 py-3 outline-none focus:ring-2 focus:ring-[#b68a3b]"
              required
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
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="md:col-span-2 flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="rounded-full bg-[#b68a3b] px-6 py-3 text-white hover:bg-[#906e30] transition"
            >
              Create User
            </button>
            {submitStatus === 'loading' && <span className="text-sm text-[#5d4e3f]">Saving...</span>}
            {submitStatus === 'success' && <span className="text-sm text-green-600">User created successfully.</span>}
            {submitStatus && submitStatus !== 'loading' && submitStatus !== 'success' && submitStatus !== 'error' && (
              <span className="text-sm text-red-600">{submitStatus}</span>
            )}
            {submitStatus === 'error' && <span className="text-sm text-red-600">Failed to create user.</span>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserPage
