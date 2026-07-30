import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import './pages/Auth.css'
import Header from './Header/Header'
import Home from './pages/homepage/Home'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  const location = useLocation()
  const hideHeader = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      {!hideHeader && <Header />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
