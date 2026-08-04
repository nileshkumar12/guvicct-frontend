import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Globe, Monitor } from 'lucide-react'
import AdminLogout from './AdminLogout'

const AdminLayout = () => {
  const location = useLocation()
  const isAdminPath = (path) => location.pathname === `/admin/${path}` || location.pathname.startsWith(`/admin/${path}/`)

  return (
    <div className="min-h-screen bg-[#f7f1e3]">
      <header className="h-20 bg-white shadow-sm border-b flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div>
            <Link to="/"> <img src="https://nileshdesigner.co.in/assets/images/logo.png" style={{maxWidth:"45px"}}/></Link>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Admin Panel</h1>
            <p className="text-sm text-slate-500">Manage products, users and dashboard settings</p>
          </div>
        </div>
        <AdminLogout />
      </header>

      <div className="flex">
        <aside className="w-60 min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#111111] via-[#1e1e1e] to-[#2c2c2c] text-white">
          <div className="py-8 px-4 space-y-3">
            <Link
              to="dashboard"
              className={`block rounded-xl px-4 py-3 transition ${location.pathname.endsWith('/dashboard') || location.pathname === '/admin' ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <Globe size={18} />
                <span>Dashboard</span>
              </div>
            </Link>

            <Link
              to="products"
              className={`block rounded-xl px-4 py-3 transition ${isAdminPath('products') ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <Monitor size={18} />
                <span>Products</span>
              </div>
            </Link>

            <Link
              to="brands"
              className={`block rounded-xl px-4 py-3 transition ${isAdminPath('brands') ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <Monitor size={18} />
                <span>Brands</span>
              </div>
            </Link>

            <Link
              to="categories"
              className={`block rounded-xl px-4 py-3 transition ${isAdminPath('categories') ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} />
                <span>Categories</span>
              </div>
            </Link>

            <Link
              to="users"
              className={`block rounded-xl px-4 py-3 transition ${isAdminPath('users') ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} />
                <span>Registered Users</span>
              </div>
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
