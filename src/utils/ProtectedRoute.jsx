import React from 'react'
import { Navigate } from 'react-router-dom'

// role prop optional: if provided, user must have matching role
export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token')
  const userJson = localStorage.getItem('user')
  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role && userJson) {
    try {
      const user = JSON.parse(userJson)
      if (user.role !== role) return <Navigate to="/" replace />
    } catch (e) {
      return <Navigate to="/login" replace />
    }
  }

  return children
}
