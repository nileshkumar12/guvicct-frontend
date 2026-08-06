import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const getAuthToken = () => {
  const candidates = [
    localStorage.getItem('token'),
    localStorage.getItem('accessToken'),
    localStorage.getItem('authToken'),
    localStorage.getItem('jwt'),
  ]

  return candidates.find((value) => `${value || ''}`.trim()) || ''
}

// role prop optional: if provided, user must have matching role
export default function ProtectedRoute({ children, role }) {
  const location = useLocation()
  const token = getAuthToken()
  const userJson = localStorage.getItem('user')
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role && userJson) {
    try {
      const user = JSON.parse(userJson)
      if (user.role !== role) return <Navigate to="/" replace />
    } catch (e) {
      return <Navigate to="/login" replace state={{ from: location }} />
    }
  }

  return children
}
