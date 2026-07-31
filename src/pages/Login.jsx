import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../utils/config';


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading')
    setError(null)
    setRole('')

    try {
      if (!API_URL) {
        throw new Error('API_URL is not set. Add VITE_API_URL to config file')
      }

      let token = localStorage.getItem('token')
      if (!token) {
        const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!loginResponse.ok) {
          const errorText = await loginResponse.text()
          throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}. ${errorText}`)
        }

        const loginData = await loginResponse.json()
        token = loginData.token || loginData.accessToken
        let loggedInUser = loginData.user || loginData.userData || loginData.data

        if (!token) {
          throw new Error('Token not returned from login API.')
        }

        localStorage.setItem('token', token)

        // If the login response included user data, persist it. Otherwise try to fetch profile.
        if (!loggedInUser) {
          try {
            const profileRes = await fetch(`${API_URL}/api/auth/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (profileRes.ok) {
              const profileData = await profileRes.json()
              loggedInUser = profileData.data || profileData.user || profileData
            }
          } catch (e) {
            // ignore - we'll try other ways to discover role
          }
        }

        if (loggedInUser) {
          localStorage.setItem('user', JSON.stringify(loggedInUser))
        }

        if (loggedInUser?.role) {
          setRole(loggedInUser.role)
          setStatus('success')
          // navigate below based on role
        }
      }

      // Decide navigation based on stored user role (fallback to fetching users list)
      let finalUser = null
      const storedUser = localStorage.getItem('user')
      if (storedUser) finalUser = JSON.parse(storedUser)

      if (!finalUser) {
        const usersResponse = await fetch(`${API_URL}/users`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        })

        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          const users = Array.isArray(usersData) ? usersData : usersData.users || usersData.data || []
          const normalizedEmail = formData.email.trim().toLowerCase()
          finalUser = users.find((u) => u.email?.toLowerCase() === normalizedEmail) || null
          if (finalUser) localStorage.setItem('user', JSON.stringify(finalUser))
        }
      }

      const userRole = finalUser?.role || 'buyer'
      setRole(userRole)
      setStatus('success')

      // navigate depending on role
      if (userRole === 'seller') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (fetchError) {
      setError(fetchError.message)
      setStatus('error')
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f7f1e3] via-[#f4e5d4] to-[#efe5d0] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#111111]">Welcome Back</h1>
          <p className="text-[#5d4e3f] mt-2">
            Sign in to continue to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5  ">
          {/* Email */}
          <div>
            <label className="block text-[#5d4e3f] mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[#5d4e3f] mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-[#b68a3b]" />
              Remember me
            </label>

            <a
              href="#"
              className="text-[#b68a3b] hover:text-[#906e30] hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#b68a3b] hover:bg-[#906e30] text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Login
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[#5d4e3f] text-sm">
                OR
              </span>
            </div>
          </div>

          {status === 'loading' && (
            <p className="text-center text-sm text-[#b68a3b]">Checking your credentials...</p>
          )}

          {status === 'success' && (
            <p className="text-center text-sm text-green-600">
              Logged in successfully. Role: {role}
            </p>
          )}

          {status === 'error' && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          {/* Signup */}
          <p className="text-center text-[#5d4e3f] text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#b68a3b] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


export default Login;
