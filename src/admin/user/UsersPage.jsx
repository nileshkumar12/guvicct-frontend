import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { API_URL } from "../../utils/config.js"
import { useToast } from "../../components/ToastProvider.jsx"

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToast } = useToast()

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Failed to delete user (${response.status}): ${text}`)
      }
      setUsers((current) => current.filter((item) => (item._id || item.id) !== userId))
      addToast('User deleted successfully.', 'success')
    } catch (deleteError) {
      const message = deleteError.message || 'Failed to delete user.'
      setError(message)
      addToast(message, 'error')
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError(null)

      try {
        if (!API_URL) {
          throw new Error('API_URL is not configured')
        }       

        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/users`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch users (${response.status})`)
        }

        const data = await response.json()
        setUsers(Array.isArray(data) ? data : data.users || data.data || [])
      } catch (fetchError) {
        const message = fetchError.message || 'Failed to load users.'
        setError(message)
        addToast(message, 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      <div className="bg-gradient-to-r from-[#b68a3b] to-[#906e30] text-white text-3xl font-semibold px-8 py-6 rounded-xl shadow-lg mb-6">
        Registered Users
      </div>
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-[#1c1c1c]">User List</h2>
            <p className="text-sm text-[#5d4e3f]">View registered buyers and sellers.</p>
          </div>
          <Link
            to="/admin/users/add"
            className="rounded-full bg-[#b68a3b] px-5 py-2 text-white hover:bg-[#906e30] transition"
          >
            Add User
          </Link>
        </div>
        <div className="overflow-x-auto p-6">
          {loading ? (
            <div className="text-sm text-[#5d4e3f]">Loading users...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-sm text-[#5d4e3f]">No users found.</div>
          ) : (
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead>
                <tr className="border-b bg-[#fffdfa]">
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">User Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const userId = user._id || user.id || ''
                  return (
                    <tr key={userId || index} className="border-b">
                      <td className="px-4 py-4">{index + 1}</td>
                      <td className="px-4 py-4">{user.name || user.fullName || '—'}</td>
                      <td className="px-4 py-4">{user.email || '—'}</td>
                      <td className="px-4 py-4">{user.phone || '—'}</td>
                      <td className="px-4 py-4">{user.role || 'buyer'}</td>
                      <td className="px-4 py-4 space-x-2">
                        <Link
                          to={`/admin/users/${userId}/edit`}
                          className="rounded-full bg-[#f4e5d4] px-3 py-1 text-sm text-[#1c1c1c] hover:bg-[#e7d7b8]"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(userId)}
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

export default UsersPage
