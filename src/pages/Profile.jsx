import React from 'react'
import LoginRequiredCard from '../components/LoginRequiredCard'

const getStoredUser = () => {
  try {
    const raw = window.localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    return null
  }
}

const Profile = () => {
  const token = typeof window !== 'undefined'
    ? window.localStorage.getItem('token') || window.localStorage.getItem('accessToken') || window.localStorage.getItem('authToken') || window.localStorage.getItem('jwt')
    : ''

  const user = getStoredUser()?.user || getStoredUser()?.userData || getStoredUser() || null

  if (!token) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <LoginRequiredCard
            title="Profile requires login"
            message="Please login to view your profile."
          />
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">Profile</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">My account</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Name</p>
              <p className="mt-1 font-semibold text-slate-900">{user?.name || 'Not available'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-1 font-semibold text-slate-900 break-all">{user?.email || 'Not available'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Role</p>
              <p className="mt-1 font-semibold text-slate-900">{user?.role || 'buyer'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">User ID</p>
              <p className="mt-1 font-semibold text-slate-900 break-all">{user?.id || user?._id || user?.userId || 'Not available'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile