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
import vyasonImg from "../../src/assets/vyason.png";
const getAuthToken = () => {
    const candidates = [
        localStorage.getItem('token'),
        localStorage.getItem('accessToken'),
        localStorage.getItem('authToken'),
        localStorage.getItem('jwt'),
    ]

    return candidates.find((value) => `${value || ''}`.trim()) || ''
}

const getSearchQueryFromLocation = (search) => new URLSearchParams(search).get('search') || ''

const Header = () => {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(!!getAuthToken());
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [loading, setLoading] = useState(false);
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
    const activeCategoryId = location.pathname.startsWith('/category/')
        ? decodeURIComponent(location.pathname.split('/')[2] || '')
        : ''

    useEffect(() => {
        const loadCategories = async () => {
            setLoading(true)
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
            } finally {
                setLoading(false)
            }
        }

        const loadProducts = async () => {
            setLoading(true)
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
            } finally {
                setLoading(false)
            }
        }

        loadCategories()
        loadProducts()
    }, [])

    useEffect(() => {
        const queryFromLocation = getSearchQueryFromLocation(location.search)
        setSearchQuery(queryFromLocation)
        setShowSearchResults(false)
    }, [location.search])

    useEffect(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase()

        if (!showSearchResults) {
            setSearchResults([])
            return
        }

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

        return `/category/all?search=${encodeURIComponent(trimmedQuery)}`
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        const trimmedQuery = searchQuery.trim()
        if (!trimmedQuery) return

        setSearchQuery(trimmedQuery)
        setShowSearchResults(false)
        navigate(buildSearchPath(trimmedQuery))
    }

    const handleClearSearch = () => {
        setSearchQuery('')
        setSearchResults([])
        setShowSearchResults(false)

        const params = new URLSearchParams(location.search)
        if (params.has('search')) {
            params.delete('search')
            const nextQuery = params.toString()
            const nextPath = `${location.pathname}${nextQuery ? `?${nextQuery}` : ''}`
            navigate(nextPath, { replace: true })
        }
    }

    return (
        <>
            <header className="sticky top-0 z-50 bg-white shadow-md">
                 <div className="bg-[#111111] text-white text-sm">
                    <div className="mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 py-2 sm:px-4">
                        <p className="text-xs sm:text-sm">🚚 Free Shipping on Orders Over ₹1999</p>
                        <div className="flex gap-3 sm:gap-5">
                            {/* <a href="#">Track Order</a> */}
                            <Link to="/help">Help</Link>
                            <Link to="/contact">Contact</Link>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">

                   
                    <div className="shrink-0 text-3xl font-bold text-[#1c1c1c]">
                        <Link to="/"> <img src={vyasonImg} alt="Vyason" className="w-full max-w-[112px] sm:max-w-[150px] md:max-w-[175px]" /></Link>
                    </div>

          
                    <form onSubmit={handleSearchSubmit} className="relative mx-4 hidden min-w-0 flex-1 lg:flex">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => {
                                    const nextValue = event.target.value
                                    setSearchQuery(nextValue)
                                    setShowSearchResults(nextValue.trim().length > 0)
                                }}
                                placeholder="Search products..."
                                className="w-full border px-4 py-2 pr-12 rounded-[25px] outline-none"
                            />

                            {searchQuery.trim() && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    aria-label="Clear search"
                                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <X size={16} />
                                </button>
                            )}

                            {showSearchResults && searchQuery.trim() && (
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
                                                    onClick={() => {
                                                        setSearchResults([])
                                                        setShowSearchResults(false)
                                                        setSearchQuery(productName)
                                                    }}
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
                            aria-label="Search products"
                            className="absolute right-0 top-0 flex h-full items-center rounded-r-[25px] bg-[#4254bf] px-3 text-white hover:bg-[#3546ae]"
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
                            <span className="absolute -top-2 -right-2 bg-[#4254bf] text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
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
                                        <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                                            Dashboard
                                        </Link>
                                        <button onClick={handleSignOut} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-[#5d4e3f] hover:text-[#4254bf]">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-[#4254bf] text-white px-3 py-1 rounded hover:bg-[#3546ae]">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile */}
                    <div className="flex shrink-0 items-center gap-1.5 md:hidden">
                        <Link to="/wishlist" aria-label="Wishlist" className="relative flex h-9 w-9 items-center justify-center">
                            <Heart size={20} />
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
                                {wishlistCount}
                            </span>
                        </Link>
                        <Link to="/cart" aria-label="Cart" className="relative flex h-9 w-9 items-center justify-center">
                            <ShoppingCart size={20} />
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4254bf] px-1 text-[10px] text-white">
                                {cartQuantity}
                            </span>
                        </Link>
                        {isLogged ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    aria-label="Account menu"
                                    aria-expanded={accountOpen}
                                    onClick={() => setAccountOpen(!accountOpen)}
                                    className="flex h-9 w-9 items-center justify-center"
                                >
                                    <User size={20} />
                                </button>
                                {accountOpen && (
                                    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded border border-gray-200 bg-white shadow-lg">
                                        {userEmail && <div className="break-all border-b border-gray-100 px-4 py-3 text-sm text-gray-700">{userEmail}</div>}
                                        <Link to="/dashboard" className="block px-4 py-3 hover:bg-gray-100">Dashboard</Link>
                                        <button onClick={handleSignOut} className="w-full px-4 py-3 text-left hover:bg-gray-100">Sign Out</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" aria-label="Sign in" className="flex h-9 w-9 items-center justify-center">
                                <User size={20} />
                            </Link>
                        )}
                        <button
                            type="button"
                            aria-label={mobileMenu ? "Close menu" : "Open menu"}
                            aria-expanded={mobileMenu}
                            className="flex h-9 w-9 items-center justify-center"
                            onClick={() => setMobileMenu(!mobileMenu)}
                        >
                            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSearchSubmit} className="relative mx-3 mb-5 flex lg:hidden sm:mx-4">
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => {
                            const nextValue = event.target.value
                            setSearchQuery(nextValue)
                            setShowSearchResults(nextValue.trim().length > 0)
                        }}
                        placeholder="Search products..."
                        aria-label="Search products"
                        className="w-full min-w-0 rounded-full border px-4 py-2 pr-12 outline-none"
                    />
                    <button
                        type="submit"
                        aria-label="Search products"
                        className="absolute right-0 top-0 flex h-full items-center rounded-r-full bg-[#4254bf] px-3 text-white hover:bg-[#3546ae]"
                    >
                        <Search size={20} />
                    </button>
                    {showSearchResults && searchQuery.trim() && (
                        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                            {searchResults.length > 0 ? searchResults.map((product) => {
                                const productId = product._id || product.id || product.slug
                                const productName = product.name || product.title || 'Product'
                                const categoryName = product.category?.name || product.category?.title || product.category || ''
                                return (
                                    <Link
                                        key={productId}
                                        to={buildSearchPath(productName)}
                                        className="block border-b border-gray-100 px-4 py-3 text-sm hover:bg-gray-50"
                                        onClick={() => {
                                            setSearchResults([])
                                            setShowSearchResults(false)
                                            setSearchQuery(productName)
                                        }}
                                    >
                                        <div className="font-semibold text-gray-900">{productName}</div>
                                        {categoryName && <div className="text-xs text-gray-500">{categoryName}</div>}
                                    </Link>
                                )
                            }) : (
                                <div className="px-4 py-3 text-sm text-gray-500">No products found</div>
                            )}
                        </div>
                    )}
                </form>

                {/* Navigation */}
                <nav className="hidden md:block" style={{ boxShadow: '0 0 5px #ccc' }}>

                    <div className="mx-auto overflow-x-auto">
                        <ul className="flex w-max min-w-full gap-4 whitespace-nowrap px-4 py-4 font-medium lg:gap-8">
                            <li>
                                <Link to="/" className="hover:text-[#4254bf]">
                                    Home
                                </Link>
                            </li>
                            {/* <li>
                                <Link to="/products" className="hover:text-[#4254bf]">
                                    Products
                                </Link>
                            </li> */}
                            {/* <li className="group relative">

                                <button className="flex items-center gap-1 hover:text-[#4254bf]">
                                    Product by Category <ChevronDown size={16} />
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

                            </li> */}
                            {categories.length > 0 ? (
                                categories.slice(0, 8).map((category) => {
                                    const categoryId = category._id || category.id || category.slug || category.name
                                    const categoryName = category.name || category.title || category.category || 'Category'
                                    const isActive = String(categoryId).toLowerCase() === activeCategoryId.toLowerCase()
                                    return (
                                        <li key={category._id} className="hover:text-[#4254bf]">
                                            <Link
                                                key={categoryId}
                                                to={`/category/${categoryId}`}
                                                aria-current={isActive ? 'page' : undefined}
                                                className={isActive ? 'border-b-2 border-[#4254bf] pb-1 font-semibold text-[#4254bf]' : 'hover:text-[#4254bf]'}
                                            >
                                                {categoryName}
                                            </Link>
                                        </li>
                                    )
                                })
                            ) : (
                                <span className="block px-4 py-3 text-sm text-gray-500">Loading categories...</span>
                            )}
                            {/* <li>
                                <a href="#" className="hover:text-[#4254bf]">
                                    New Arrivals
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-[#4254bf]">
                                    Best Sellers
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-[#4254bf]">
                                    Deals
                                </a>
                            </li>

                            <li>
                                <a href="#" className="hover:text-[#4254bf]">
                                    Brands
                                </a>
                            </li> */}
                            {/* <li>
                                <Link to="/about" className="hover:text-[#4254bf]">About Us</Link>
                           </li>
                            <li>
                                <Link to="/contact" className="hover:text-[#4254bf]">Contact Us</Link>
                            </li> */}
                        </ul>

                    </div>
                </nav>

               
                {mobileMenu && (
                    <div className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t bg-white md:hidden">
                        <div className="p-4">
                            <ul className="space-y-1">
                                <li>
                                    <Link to="/" onClick={() => setMobileMenu(false)} className="block rounded px-2 py-3 hover:text-[#4254bf]">
                                        Home
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link to="/products" className="hover:text-[#4254bf]">
                                        Products
                                    </Link>
                                </li> */}

                                {categories.length > 0 ? (
                                    categories.slice(0, 6).map((category) => {
                                        const categoryId = category._id || category.id || category.slug || category.name
                                        const categoryName = category.name || category.title || category.category || 'Category'
                                        const isActive = String(categoryId).toLowerCase() === activeCategoryId.toLowerCase()
                                        return (
                                            <li key={categoryId} className="hover:text-[#4254bf]">
                                                <Link
                                                    to={`/category/${categoryId}`}
                                                    aria-current={isActive ? 'page' : undefined}
                                                    onClick={() => setMobileMenu(false)}
                                                    className={`${isActive ? 'font-semibold text-[#4254bf]' : 'hover:text-[#4254bf]'} block rounded px-2 py-3`}
                                                >
                                                    {categoryName}
                                                </Link>
                                            </li>
                                        )
                                    })
                                ) : (
                                    <span className="block px-4 py-3 text-sm text-gray-500">Loading categories...</span>
                                )}

                                <li>
                                    <Link to="/about" onClick={() => setMobileMenu(false)} className="block rounded px-2 py-3 hover:text-[#4254bf]">About Us</Link>
                                </li>
                                <li>
                                    <Link to="/contact" onClick={() => setMobileMenu(false)} className="block rounded px-2 py-3 hover:text-[#4254bf]">Contact Us</Link>
                                </li>
                                {!isLogged && (
                                    <>
                                        <li><Link to="/login" onClick={() => setMobileMenu(false)} className="block rounded px-2 py-3 hover:text-[#4254bf]">Login</Link></li>
                                        <li><Link to="/register" onClick={() => setMobileMenu(false)} className="block rounded px-2 py-3 hover:text-[#4254bf]">Register</Link></li>
                                    </>
                                )}
                            </ul>

                        </div>

                    </div>
                )}
            </header>
        </>
    )
}

export default Header
