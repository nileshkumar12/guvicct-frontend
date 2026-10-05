import { Link, Outlet, useLocation } from 'react-router-dom'
import PageTitle from '../components/PageTitle.jsx'
import {
  Bell,
  Boxes,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Truck,
  UserRound,
  UsersRound,
} from 'lucide-react'
import AdminLogout from './AdminLogout'
import vyasonImg from "../../src/assets/vyason.png";
const AdminLayout = () => {
  const location = useLocation()
  const isAdminPath = (path) => location.pathname === `/admin/${path}` || location.pathname.startsWith(`/admin/${path}/`)
  const userRole = JSON.parse(localStorage.getItem('user'))
  const menuTitles = [
    ['dashboard', 'Dashboard'],
    ['sellerorders', 'Ordered'],
    ['adminprofile', 'Profile'],
    ['products', 'Products'],
    ['brands', 'Brands'],
    ['categories', 'Categories'],
    ['notifications', 'Notifications'],
    ['shipment', 'Shipment'],
    ['users', 'Registered Users'],
  ]
  const pageTitle = location.pathname === '/admin/addshipment'
    ? 'Shipment'
    : menuTitles.find(([path]) => isAdminPath(path))?.[1] || 'Admin Panel'

  return (
    <div className="min-h-screen bg-[#f7f1e3]">
      <PageTitle title={pageTitle} />
      <header className="h-20 bg-white shadow-sm border-b flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div>
            <Link to="/admin/dashboard"><img src={vyasonImg} style={{maxWidth:"220px"}}/></Link>
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
                <LayoutDashboard size={18} />
               
                <span>Dashboard</span>
              </div>
            </Link>
            <Link
              to="sellerorders"
              className={`block rounded-xl px-4 py-3 transition ${location.pathname.endsWith('/sellerorders') || location.pathname === '/admin' ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} />
               
                <span>Ordered</span>
              </div>
            </Link>

            <Link
              to="adminprofile"
              className={`block rounded-xl px-4 py-3 transition ${location.pathname.endsWith('/adminprofile') || location.pathname === '/admin' ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <UserRound size={18} />
                <span>Profile</span>
              </div>
            </Link>

            <Link
              to="products"
              className={`block rounded-xl px-4 py-3 transition ${isAdminPath('products') ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <Package size={18} />
                <span>Products</span>
              </div>
            </Link>

            <Link
              to="brands"
              className={`block rounded-xl px-4 py-3 transition ${isAdminPath('brands') ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <Tag size={18} />
                <span>Brands</span>
              </div>
            </Link>

            <Link
              to="categories"
              className={`block rounded-xl px-4 py-3 transition ${isAdminPath('categories') ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <Boxes size={18} />
                <span>Categories</span>
              </div>
            </Link>
           
            <Link
              to="notifications"
              className={`block rounded-xl px-4 py-3 transition ${isAdminPath('notifications') ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <Bell size={18} />
                <span>Notifications</span>
              </div>
            </Link>
            <Link
              to="shipment"
              className={`block rounded-xl px-4 py-3 transition ${isAdminPath('shipment') ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <Truck size={18} />
                <span>Shipment</span>
              </div>
            </Link>
            {userRole.role === 'admin' && (
              <Link
                to="users"
                className={`block rounded-xl px-4 py-3 transition ${isAdminPath('users') ? 'bg-[#f4e5d4] text-[#1c1c1c]' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <div className="flex items-center gap-3">
                  <UsersRound size={18} />
                  <span>Registered Users</span>
                </div>
              </Link>
            )}
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
