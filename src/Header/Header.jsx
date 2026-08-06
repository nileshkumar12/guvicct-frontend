import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
    Menu,
    X,
    Search,
    ShoppingCart,
    Heart,
    User,
    ChevronDown,
} from 'lucide-react'
import { hydrateCartForUser, selectCartTotalQuantity } from '../store/cartSlice'
import { hydrateWishlistForUser } from '../store/wishlistSlice'
import { API_URL } from '../utils/config'

const getAuthToken = () => {
    const candidates = [
        localStorage.getItem('token'),
        localStorage.getItem('accessToken'),
        localStorage.getItem('authToken'),
        localStorage.getItem('jwt'),
    ]

    return candidates.find((value) => `${value || ''}`.trim()) || ''
}

const Header = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(!!getAuthToken());
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [userRole, setUserRole] = useState(() => {
        try {
            const u = localStorage.getItem('user')
            return u ? JSON.parse(u).role : null
        } catch (e) {
            return null
        }
    });
    const [userEmail, setUserEmail] = useState(() => {
        try {
            const u = localStorage.getItem('user')
            return u ? JSON.parse(u).email : ''
        } catch (e) {
            return ''
        }
    });
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const cartQuantity = useSelector(selectCartTotalQuantity)
    const wishlistCount = useSelector((state) => state.wishlist.items.length)

    useEffect(() => {
        const loadCategories = async () => {
            if (!API_URL) return

            try {
                const response = await fetch(`${API_URL}/api/categories`)
                if (response.ok) {
                    const data = await response.json()
                    const categoryList = Array.isArray(data) ? data : data.categories || data.data || []
                    setCategories(categoryList)
                }
            } catch (error) {
                console.error('Failed to load categories', error)
            }
        }

        const loadProducts = async () => {
            if (!API_URL) return

            try {
                const response = await fetch(`${API_URL}/api/products`)
                if (response.ok) {
                    const data = await response.json()
                    const productList = Array.isArray(data) ? data : data.products || data.data || []
                    setProducts(productList)
                }
            } catch (error) {
                console.error('Failed to load products', error)
            }
        }

        loadCategories()
        loadProducts()
    }, [])

    useEffect(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase()

        if (!normalizedQuery) {
            setSearchResults([])
            return
        }

        const filtered = products.filter((product) => {
            const productText = [
                product.name,
                product.title,
                product.description,
                product.brand,
                product.category?.name || product.category?.title || product.category,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            return productText.includes(normalizedQuery)
        })

        setSearchResults(filtered.slice(0, 6))
    }, [products, searchQuery])

    useEffect(() => {
        const onStorage = (e) => {
            if (['token', 'accessToken', 'authToken', 'jwt'].includes(e.key)) {
                setIsLogged(!!getAuthToken())
            }

            if (e.key === 'user') {
                try {
                    const parsedUser = e.newValue ? JSON.parse(e.newValue) : null
                    setUserRole(parsedUser?.role ?? null)
                    setUserEmail(parsedUser?.email || '')
                } catch (err) {
                    setUserRole(null)
                    setUserEmail('')
                }
            }
        }

        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    const handleSignOut = () => {
        ;['token', 'accessToken', 'authToken', 'jwt', 'user'].forEach((key) => {
            localStorage.removeItem(key)
        })
        dispatch(hydrateCartForUser('guest'))
        dispatch(hydrateWishlistForUser('guest'))
        setAccountOpen(false)
        setIsLogged(false)
        setUserRole(null)
        setUserEmail('')
        navigate('/')
    }

    const buildSearchPath = (query) => {
        const trimmedQuery = query.trim()
        if (!trimmedQuery) return location.pathname

        const currentPath = location.pathname
        return currentPath.startsWith('/category/')
            ? `${currentPath}?search=${encodeURIComponent(trimmedQuery)}`
            : `/category/all?search=${encodeURIComponent(trimmedQuery)}`
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        const trimmedQuery = searchQuery.trim()
        if (!trimmedQuery) return

        navigate(buildSearchPath(trimmedQuery))
        setSearchQuery('')
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
                    <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 mx-10 relative">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search products..."
                                className="w-full border px-4 py-2 rounded-l-lg outline-none"
                            />

                            {searchQuery.trim() && (
                                <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((product) => {
                                            const productId = product._id || product.id || product.slug
                                            const productName = product.name || product.title || 'Product'
                                            const categoryName = product.category?.name || product.category?.title || product.category || ''

                                            return (
                                                <Link
                                                    key={productId}
                                                    to={buildSearchPath(productName)}
                                                    className="block border-b border-gray-100 px-4 py-3 text-sm hover:bg-gray-50"
                                                    onClick={() => setSearchQuery('')}
                                                >
                                                    <div className="font-semibold text-gray-900">{productName}</div>
                                                    {categoryName && <div className="text-xs text-gray-500">{categoryName}</div>}
                                                </Link>
                                            )
                                        })
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-500">No products found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="bg-[#b68a3b] text-white px-6 rounded-r-lg hover:bg-[#906e30]"
                        >
                            <Search size={20} />
                        </button>
                    </form>

                    {/* Right Icons */}
                    <div className="hidden md:flex items-center gap-6">

                        <Link to="/wishlist" className="relative">
                            <Heart />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                                {wishlistCount}
                            </span>
                        </Link>

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
                                    <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded border border-gray-200">
                                        {userEmail && (
                                            <div className="px-4 py-3 border-b border-gray-100 text-sm text-gray-700 break-all">
                                                {userEmail}
                                            </div>
                                        )}
                                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                            Profile
                                        </Link>
                                        <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                                            Order List
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
                                    {categories.length > 0 ? (
                                        categories.slice(0, 6).map((category) => {
                                            const categoryId = category._id || category.id || category.slug || category.name
                                            const categoryName = category.name || category.title || category.category || 'Category'
                                            return (
                                                <Link
                                                    key={categoryId}
                                                    to={`/category/${categoryId}`}
                                                    className="block px-4 py-3 hover:bg-gray-100"
                                                >
                                                    {categoryName}
                                                </Link>
                                            )
                                        })
                                    ) : (
                                        <span className="block px-4 py-3 text-sm text-gray-500">Loading categories...</span>
                                    )}
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
                                <li><Link to="/wishlist">Wishlist</Link></li>
                                <li><Link to="/cart">Cart</Link></li>
                                <li><Link to="/orders">Order List</Link></li>
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
