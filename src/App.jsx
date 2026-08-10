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
import AdminProfile from './admin/profile/AdminProfile'
import DashboardPage from './admin/seller/DashboardPage'
import ProductsPage from './admin/product/ProductsPage'
import AddProductPage from './admin/product/AddProductPage'
import EditProductPage from './admin/product/EditProductPage'
import BrandsPage from './admin/brand/BrandsPage'
import AddBrandPage from './admin/brand/AddBrandPage'
import EditBrandPage from './admin/brand/EditBrandPage'
import CategoriesPage from './admin/category/CategoriesPage'
import AddCategoryPage from './admin/category/AddCategoryPage'
import EditCategoryPage from './admin/category/EditCategoryPage'
import UsersPage from './admin/user/UsersPage'
import AddUserPage from './admin/user/AddUserPage'
import EditUserPage from './admin/user/EditUserPage'
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
import PaymentMethods from './pages/dashboard/PaymentMethods'
import SellerNotifications from './admin/seller/SellerNotifications'
import Shipment from './admin/shipment/Shipment'
import AddShipment from './admin/shipment/AddShipment'
import SellerStoreInfo from './admin/profile/SellerStoreInfo'
const App = () => {
  const location = useLocation();

  const hideHeader = location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/admin')
  const hideFooter = location.pathname.startsWith('/admin')

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />}  />
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
          <Route path="users" element={<ProtectedRoute role="admin"><UsersPage /></ProtectedRoute>} />
          <Route path="users/add" element={<ProtectedRoute role="admin"><AddUserPage /></ProtectedRoute>} />
          <Route path="users/:id/edit" element={<ProtectedRoute role="admin"><EditUserPage /></ProtectedRoute>} />
          <Route path="notifications" element={<SellerNotifications />} /> 
          <Route path="shipment" element={<Shipment/>} />
          <Route path="addshipment" element={<AddShipment/>} />
          <Route path="adminprofile" element={<AdminProfile />} />
          <Route path="addsellerstore" element={<SellerStoreInfo mode="add" />} />
          <Route path="editsellerstore" element={<SellerStoreInfo mode="edit" />} />
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
          <Route path="paymentmethods" element={<PaymentMethods />} />
        </Route>
      </Routes>
      {!hideHeader && <Footer />}
    </>
  )
}

export default App
