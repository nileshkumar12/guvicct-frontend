import { useNavigate } from 'react-router-dom'

const AdminLogout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-semibold transition"
    >
      Logout
    </button>
  )
}

export default AdminLogout
