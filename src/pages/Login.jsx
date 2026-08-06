import { useState } from "react";
import { useDispatch } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { API_URL } from '../utils/config';
import { getCartStorageKey, hydrateCartForUser } from '../store/cartSlice'
import { getWishlistStorageKey, hydrateWishlistForUser } from '../store/wishlistSlice'

const normalizeAuthToken = (value) => {
  if (!value) return ''
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    return trimmed.replace(/^Bearer\s+/i, '')
  }
  if (typeof value === 'object') {
    return normalizeAuthToken(value.token || value.accessToken || value.authToken || value.jwt || '')
  }
  return `${value}`.trim()
}

const normalizeLoggedInUser = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null
  }

  const candidates = [
    payload.user,
    payload.userData,
    payload.data?.user,
    payload.data?.userData,
    payload.data?.data,
    payload.data,
    payload,
  ]

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) continue
    if (candidate.id || candidate._id || candidate.email || candidate.name || candidate.role) {
      return candidate
    }
  }

  return null
}

const loadStoredItems = (storageKey) => {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    return []
  }
}

const mergeCartItems = (baseItems = [], guestItems = []) => {
  const mergedByKey = new Map()

  ;[...baseItems, ...guestItems].forEach((item) => {
    const key = `${item?.key || item?.id || item?._id || item?.productId || item?.product || ''}`
    if (!key) return

    const existing = mergedByKey.get(key)
    const normalized = {
      ...item,
      key,
      id: item?.id || item?._id || item?.productId || item?.product || key,
      _id: item?._id || item?.id || item?.productId || item?.product || key,
      quantity: Number(item?.quantity || 1),
      isSelected: item?.isSelected !== false,
    }

    if (existing) {
      mergedByKey.set(key, {
        ...existing,
        ...normalized,
        quantity: Math.max(Number(existing.quantity || 0), Number(normalized.quantity || 0)),
        isSelected: existing.isSelected !== false || normalized.isSelected !== false,
      })
      return
    }

    mergedByKey.set(key, normalized)
  })

  return Array.from(mergedByKey.values())
}

const mergeWishlistItems = (baseItems = [], guestItems = []) => {
  const mergedByKey = new Map()

  ;[...baseItems, ...guestItems].forEach((item) => {
    const key = `${item?.key || item?.id || item?._id || item?.productId || item?.product || ''}`
    if (!key) return

    mergedByKey.set(key, {
      ...item,
      key,
      id: item?.id || item?._id || item?.productId || item?.product || key,
      _id: item?._id || item?.id || item?.productId || item?.product || key,
    })
  })

  return Array.from(mergedByKey.values())
}

const migrateGuestStateToUser = (user) => {
  const userKey = user?.id || user?._id || user?.email || user?.name || 'guest'
  if (!userKey || userKey === 'guest') return

  const guestCartKey = getCartStorageKey('guest')
  const userCartKey = getCartStorageKey(userKey)
  const guestWishlistKey = getWishlistStorageKey('guest')
  const userWishlistKey = getWishlistStorageKey(userKey)

  const guestCartItems = loadStoredItems(guestCartKey)
  const userCartItems = loadStoredItems(userCartKey)
  const mergedCartItems = mergeCartItems(userCartItems, guestCartItems)

  const guestWishlistItems = loadStoredItems(guestWishlistKey)
  const userWishlistItems = loadStoredItems(userWishlistKey)
  const mergedWishlistItems = mergeWishlistItems(userWishlistItems, guestWishlistItems)

  localStorage.setItem(userCartKey, JSON.stringify(mergedCartItems))
  localStorage.setItem(userWishlistKey, JSON.stringify(mergedWishlistItems))
}

const persistLoggedInUser = (user, dispatch) => {
  if (!user) return null

  localStorage.setItem('user', JSON.stringify(user))
  migrateGuestStateToUser(user)
  const userKey = user.id || user._id || user.email || user.name || 'guest'
  dispatch(hydrateCartForUser(userKey))
  dispatch(hydrateWishlistForUser(userKey))
  return user
}

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  

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

      let token = normalizeAuthToken(localStorage.getItem('token'))
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
        token = normalizeAuthToken(
          loginData.token ||
          loginData.accessToken ||
          loginData.jwt ||
          loginData.authToken ||
          loginData?.data?.token ||
          loginData?.data?.accessToken ||
          loginData?.data?.jwt ||
          loginData?.data?.authToken ||
          ''
        )

        if (token) {
          localStorage.setItem('token', token)
          localStorage.setItem('accessToken', token)
          localStorage.setItem('authToken', token)
          localStorage.setItem('jwt', token)
        }

        let loggedInUser = normalizeLoggedInUser(loginData)

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
              loggedInUser = normalizeLoggedInUser(profileData)
            }
          } catch (e) {
            // ignore - we'll try other ways to discover role
          }
        }

        if (loggedInUser) {
          persistLoggedInUser(loggedInUser, dispatch)
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

      if (!finalUser && token) {
        try {
          const profileRes = await fetch(`${API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (profileRes.ok) {
            const profileData = await profileRes.json()
            finalUser = normalizeLoggedInUser(profileData)
            if (finalUser) {
              persistLoggedInUser(finalUser, dispatch)
            }
          }
        } catch (e) {
          // ignore - continue to users fallback
        }
      }

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
          if (finalUser) {
            persistLoggedInUser(finalUser, dispatch)
          }
        }
      }

      const userRole = finalUser?.role || 'buyer'
      setRole(userRole)
      setStatus('success')

      const requestedPath = location.state?.from?.pathname
      const requestedSearch = location.state?.from?.search || ''
      const requestedHash = location.state?.from?.hash || ''
      const redirectTarget = requestedPath
        ? `${requestedPath}${requestedSearch}${requestedHash}`
        : ''

      if (redirectTarget && redirectTarget !== '/login' && redirectTarget !== '/register') {
        navigate(redirectTarget, { replace: true })
      } else if (userRole === 'seller') {
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
