import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'
import './pages/Auth.css'
import Header from './Header/Header'
import Home from './pages/homepage/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CategoryProducts from './pages/category/CategoryProducts'
import Footer from "./Footer/Footer";
import ProtectedRoute from './utils/ProtectedRoute'
import AdminLayout from './admin/AdminLayout'
import DashboardPage from './admin/DashboardPage'
import ProductsPage from './admin/ProductsPage'
import AddProductPage from './admin/AddProductPage'
import EditProductPage from './admin/EditProductPage'
import BrandsPage from './admin/BrandsPage'
import AddBrandPage from './admin/AddBrandPage'
import EditBrandPage from './admin/EditBrandPage'
import CategoriesPage from './admin/CategoriesPage'
import AddCategoryPage from './admin/AddCategoryPage'
import EditCategoryPage from './admin/EditCategoryPage'
import UsersPage from './admin/UsersPage'
import AddUserPage from './admin/AddUserPage'
import EditUserPage from './admin/EditUserPage'
import ProductDetails from './pages/productdetails/ProductDetails'
import Profile from './pages/Profile'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/Checkout'
import Order from './pages/order/Order'
import OrderList from './pages/order/OrderList'
import WishLists from './pages/wishlist/WishLists'
import Dashboard from './pages/dashboard/Dashboard'
import DashboardHome from './pages/dashboard/DashboardHome'
import ChangePassword from './pages/dashboard/ChangePassword'
import SavedAdresses from './pages/dashboard/SavedAdresses'


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
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        {/* <Route path="/orders" element={<ProtectedRoute><OrderList /></ProtectedRoute>} /> */}
        <Route path="/wishlist" element={<ProtectedRoute><WishLists /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute role="seller"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/add" element={<AddBrandPage />} />
          <Route path="brands/:id/edit" element={<EditBrandPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/add" element={<AddCategoryPage />} />
          <Route path="categories/:id/edit" element={<EditCategoryPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/add" element={<AddUserPage />} />
          <Route path="users/:id/edit" element={<EditUserPage />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="buyer">
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<Profile />} />
       
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="order" element={<Order />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="savedaddresses" element={<SavedAdresses />} />
        </Route>
      </Routes>
      {!hideHeader && <Footer />}
    </>
  )
}

export default App
