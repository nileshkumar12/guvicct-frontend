import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'
import './pages/Auth.css'
import Header from './Header/Header'
import Home from './pages/homepage/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Footer from "./Footer/Footer";
import ProtectedRoute from './utils/ProtectedRoute'
import AdminLayout from './admin/AdminLayout'
import DashboardPage from './admin/DashboardPage'
import ProductsPage from './admin/ProductsPage'
import AddProductPage from './admin/AddProductPage'
import EditProductPage from './admin/EditProductPage'
import UsersPage from './admin/UsersPage'
import AddUserPage from './admin/AddUserPage'
import EditUserPage from './admin/EditUserPage'
const App = () => {
  const location = useLocation();

  const hideHeader = location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/admin')
  const hideFooter = location.pathname.startsWith('/admin')

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute role="seller"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/add" element={<AddUserPage />} />
          <Route path="users/:id/edit" element={<EditUserPage />} />
        </Route>
      </Routes>
      {!hideFooter && <Footer />}
    </>
  )
}

export default App
