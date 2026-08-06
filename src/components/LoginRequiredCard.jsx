import React from 'react'
import { Link } from 'react-router-dom'

const LoginRequiredCard = ({
  title = 'Login required',
  message = 'Please login to continue.',
  loginLabel = 'Login',
  registerLabel = 'Register',
}) => {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-900 shadow-sm">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-amber-800">{message}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/login"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {loginLabel}
        </Link>
        <Link
          to="/register"
          className="rounded-full border border-amber-300 px-5 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
        >
          {registerLabel}
        </Link>
      </div>
    </div>
  )
}

export default LoginRequiredCard