import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
    Menu,
    X,
    Search,
    ShoppingCart,
    Heart,
    User,
    ChevronDown,
} from 'lucide-react'
import { selectCartTotalQuantity } from '../store/cartSlice'

const Header = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(() => {
        try {
            const u = localStorage.getItem('user')
            return u ? JSON.parse(u).role : null
        } catch (e) {
            return null
        }
    });
    const navigate = useNavigate();
    const cartQuantity = useSelector(selectCartTotalQuantity)

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'token') {
                setIsLogged(!!e.newValue)
            }

            if (e.key === 'user') {
                try {
                    setUserRole(e.newValue ? JSON.parse(e.newValue).role : null)
                } catch (err) {
                    setUserRole(null)
                }
            }
        }

        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    const handleSignOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setAccountOpen(false)
        setIsLogged(false)
        setUserRole(null)
        navigate('/')
    }
    return (
        <>


            <header className="sticky top-0 z-50 bg-white shadow-md">
                {/* Top Bar */}
                <div className="bg-[#111111] text-white text-sm">
                    <div className="container mx-auto flex justify-between items-center px-4 py-2">
                        <p>🚚 Free Shipping on Orders Over ₹999</p>
                        <div className="flex gap-5">
                            <a href="#">Track Order</a>
                            <a href="#">Help</a>
                            <a href="#">Contact</a>
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">

                    {/* Logo */}
                    <div className="text-3xl font-bold text-[#1c1c1c]">
                        <Link to="/"> <img src="https://nileshdesigner.co.in/assets/images/logo.png" style={{ maxWidth: "45px" }} /></Link>
                    </div>

                    {/* Search */}
                    <div className="hidden lg:flex flex-1 mx-10">

                        <select className="border border-r-0 rounded-l-lg px-3 bg-gray-100 outline-none">
                            <option>All Categories</option>
                            <option>Electronics</option>
                            <option>Fashion</option>
                            <option>Mobiles</option>
                            <option>Home</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full border px-4 outline-none"
                        />

                        <button className="bg-[#b68a3b] text-white px-6 rounded-r-lg hover:bg-[#906e30]">
                            <Search size={20} />
                        </button>
                    </div>

                    {/* Right Icons */}
                    <div className="hidden md:flex items-center gap-6">

                        <button className="relative">
                            <Heart />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                                2
                            </span>
                        </button>

                        <Link to="/cart" className="relative">
                            <ShoppingCart />
                            <span className="absolute -top-2 -right-2 bg-[#b68a3b] text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                                {cartQuantity}
                            </span>
                        </Link>

                        {isLogged ? (
                            <div className="relative">
                                <button
                                    onClick={() => setAccountOpen(!accountOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                    aria-expanded={accountOpen}
                                >
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/avatar-placeholder.png"
                                            alt="avatar"
                                            className="h-full w-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none' }}
                                        />
                                        <User size={16} className="text-gray-600" />
                                    </div>
                                    <span className="hidden sm:inline">Account</span>
                                    <ChevronDown size={16} />
                                </button>

                                {accountOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded">
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                            Profile
                                        </Link>

                                        <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-[#5d4e3f] hover:text-[#b68a3b]">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-[#b68a3b] text-white px-3 py-1 rounded hover:bg-[#906e30]">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenu(!mobileMenu)}
                    >
                        {mobileMenu ? <X /> : <Menu />}
                    </button>

                </div>

                {/* Navigation */}
                <nav className="hidden md:block border-t">
                    <div className="container mx-auto">

                        <ul className="flex gap-8 px-4 py-4 font-medium">

                            <li>
                                <Link to="/" className="hover:text-[#b68a3b]">
                                    Home
                                </Link>
                            </li>

                            <li>
                                <a href="#" className="hover:text-[#b68a3b]">
                                    Shop
                                </a>
                            </li>

                            <li className="group relative">

                                <button className="flex items-center gap-1 hover:text-[#b68a3b]">
                                    Categories <ChevronDown size={16} />
                                </button>

                                <div className="absolute hidden group-hover:block bg-white shadow-lg w-56 rounded mt-2">

                                    <a href="#" className="block px-4 py-3 hover:bg-gray-100">
                                        Electronics
                                    </a>

                                    <a href="#" className="block px-4 py-3 hover:bg-gray-100">
                                        Fashion
                                    </a>

                                    <a href="#" className="block px-4 py-3 hover:bg-gray-100">
                                        Grocery
                                    </a>

                                    <a href="#" className="block px-4 py-3 hover:bg-gray-100">
                                        Home & Kitchen
                                    </a>

                                    <a href="#" className="block px-4 py-3 hover:bg-gray-100">
                                        Beauty
                                    </a>

                                </div>

                            </li>

                            <li>
                                <a href="#" className="hover:text-[#b68a3b]">
                                    New Arrivals
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-[#b68a3b]">
                                    Best Sellers
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-[#b68a3b]">
                                    Deals
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-[#b68a3b]">
                                    Brands
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-[#b68a3b]">
                                    Contact
                                </a>
                            </li>

                            {userRole === 'seller' && (
                                <li>
                                    <Link to="/admin/dashboard" className="hover:text-[#b68a3b]">
                                        Admin
                                    </Link>
                                </li>
                            )}

                        </ul>

                    </div>
                </nav>

                {/* Mobile Menu */}
                {mobileMenu && (
                    <div className="md:hidden border-t bg-white">

                        <div className="p-4">

                            <input
                                placeholder="Search..."
                                className="w-full border rounded-lg p-3 mb-4"
                            />

                            <ul className="space-y-4">

                                <li><a href="#">Home</a></li>
                                <li><a href="#">Shop</a></li>
                                <li><a href="#">Categories</a></li>
                                <li><a href="#">Deals</a></li>
                                <li><a href="#">New Arrivals</a></li>
                                <li><a href="#">Best Sellers</a></li>
                                <li><a href="#">Wishlist</a></li>
                                <li><a href="#">Cart</a></li>
                                <li><a href="#">Account</a></li>
                                <li><a href="#">Contact</a></li>

                            </ul>

                        </div>

                    </div>
                )}
            </header>


        </>
    )
}

export default Header
