import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { API_URLS, getImageUrl } from '../../utils/config'
import { addItem, selectCartTotalQuantity } from '../../store/cartSlice'
import { useToast } from '../../components/ToastProvider'

const normalizeAuthToken = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value.trim().replace(/^Bearer\s+/i, '')
  return ''
}

const getStoredUser = () => {
  try {
    const raw = window.localStorage.getItem('user')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.user || parsed?.userData || parsed
  } catch (error) {
    return null
  }
}

const getAuthToken = () => {
  const candidates = [
    window.localStorage.getItem('token'),
    window.localStorage.getItem('accessToken'),
    window.localStorage.getItem('authToken'),
    window.localStorage.getItem('jwt'),
  ]

  for (const candidate of candidates) {
    const normalized = normalizeAuthToken(candidate)
    if (normalized) return normalized
  }

  const user = getStoredUser()
  const fallbackToken = normalizeAuthToken(user?.token || user?.accessToken || user?.authToken || user?.jwt)
  if (fallbackToken) return fallbackToken

  const sessionUser = window.sessionStorage?.getItem?.('user')
  if (sessionUser) {
    try {
      const parsed = JSON.parse(sessionUser)
      const sessionToken = normalizeAuthToken(parsed?.token || parsed?.accessToken || parsed?.authToken || parsed?.jwt)
      if (sessionToken) return sessionToken
    } catch (error) {
      // Ignore malformed session data.
    }
  }

  return ''
}

const getApiUserIdentifier = () => {
  const user = getStoredUser()
  return user?.id || user?._id || user?.userId || user?.sub || ''
}

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`

const formatDateTime = (value) => {
  if (!value) return 'Unknown date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown date'
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const normalizeOrderItems = (value) => {
  if (!Array.isArray(value)) return []

  return value.map((item, index) => {
    const product = item?.product || item?.productId || {}
    const productId = typeof product === 'object' ? product?._id || product?.id : product

    return {
      key: `${item?.key || item?._id || item?.id || productId || index}`,
      productId: `${productId || item?.productId || item?._id || item?.id || ''}`,
      title: item?.title || item?.name || product?.title || product?.name || 'Product',
      image: item?.image || product?.image || '',
      quantity: Number(item?.quantity || item?.qty || 1),
      price: Number(item?.price || product?.price || 0),
    }
  })
}

const isMongoLikeId = (value) => /^[a-f0-9]{24}$/i.test(`${value || ''}`)

const sanitizeLabel = (value, fallback = '') => {
  const text = `${value || ''}`.trim().replace(/[\/_\s]+$/g, '')
  return text || fallback
}

const buildPublicOrderNumber = (order, index) => {
  const preferredRaw =
    order?.orderNo ||
    order?.orderNumber ||
    order?.order_number ||
    order?.publicOrderId ||
    order?.displayOrderId ||
    order?.displayOrderNumber ||
    ''
  const preferred = sanitizeLabel(preferredRaw)
  if (preferred && !isMongoLikeId(preferred)) {
    return `${preferred}`
  }

  const rawId = `${order?._id || order?.id || order?.orderId || ''}`
  const createdAt = order?.createdAt || order?.date || order?.orderedAt
  const date = createdAt ? new Date(createdAt) : null
  const datePart = date && !Number.isNaN(date.getTime())
    ? [date.getFullYear(), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')].join('')
    : `${new Date().getFullYear()}`
  const suffixSource = rawId && isMongoLikeId(rawId) ? rawId.slice(-6).toUpperCase() : `${index + 1}`.padStart(4, '0')

  return `ORD-${datePart}-${suffixSource}`
}

const normalizeOrder = (order, index) => {
  const orderId = order?._id || order?.id || order?.orderId || `ORD-${index + 1}`
  const items = normalizeOrderItems(order?.items || order?.orderItems || order?.products || order?.cartItems || [])
  const subtotal = Number(order?.subtotal ?? order?.subTotal ?? 0)
  const discount = Number(order?.discount ?? order?.couponDiscount ?? 0)
  const shippingCost = Number(order?.shippingCost ?? order?.shipping ?? order?.shippingCharge ?? 0)
  const tax = Number(order?.tax ?? order?.taxAmount ?? 0)
  const calculatedTotal = subtotal + shippingCost + tax - discount
  const total = Number(order?.total ?? order?.grandTotal ?? order?.payableAmount ?? calculatedTotal)

  return {
    id: `${orderId}`,
    orderNo: buildPublicOrderNumber(order, index),
    createdAt: order?.createdAt || order?.date || order?.orderedAt || null,
    status: sanitizeLabel(order?.status || order?.orderStatus || order?.order_state || 'Processing', 'Processing'),
    paymentMethod: sanitizeLabel(order?.paymentMethod || order?.paymentType || order?.payment_mode || 'N/A', 'N/A'),
    deliveryMethod: sanitizeLabel(
      order?.deliveryMethod ||
      order?.shippingMethod ||
      order?.shippingAddress?.deliveryMethod ||
      order?.shippingAddress?.shippingMethod ||
      order?.shippingAddress?.type ||
      'N/A',
      'N/A',
    ),
    subtotal,
    discount,
    shipping: shippingCost,
    shippingCost,
    tax,
    total,
    shippingAddress: order?.shippingAddress || order?.shipping_address || order?.address || {},
    items,
  }
}

const getOrderArrays = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return [value]
  if (typeof value !== 'object') return []

  const keys = ['orders', 'items', 'data', 'result', 'payload']
  const arrays = []

  keys.forEach((key) => {
    const next = value[key]
    if (Array.isArray(next)) {
      arrays.push(next)
      return
    }
    if (next && typeof next === 'object') {
      arrays.push(...getOrderArrays(next))
    }
  })

  return arrays
}

const OrderList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToast, openConfirmPopup } = useToast()
  const cartQuantity = useSelector(selectCartTotalQuantity)

  const [orders, setOrders] = useState([])
  const [openOrderId, setOpenOrderId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingOrderId, setDeletingOrderId] = useState('')
  const [cancellingOrderId, setCancellingOrderId] = useState('')
  const [requiresLogin, setRequiresLogin] = useState(false)

  const nonCancelableStatuses = useMemo(
    () => new Set(['confirmed', 'shipped', 'delivered', 'cancelled']),
    []
  )

  const fetchOrders = useCallback(async () => {
    if (!API_URLS) {
      setRequiresLogin(false)
      setError('Order API is not configured.')
      setLoading(false)
      return
    }

    const token = getAuthToken()
    if (!token) {
      setRequiresLogin(true)
      setError('Please login to view your orders.')
      setOrders([])
      setLoading(false)
      return
    }

    setRequiresLogin(false)

    const userId = getApiUserIdentifier()
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-auth-token': token,
      'x-access-token': token,
    }

    const endpoints = ['/api/orders']
    const queries = [
      userId ? `?user=${encodeURIComponent(userId)}` : '',
      '',
    ].filter((value, index, all) => value || index === all.indexOf(''))

    let bestOrders = []
    let loaded = false

    for (const endpoint of endpoints) {
      for (const query of queries) {
        try {
          const response = await fetch(`${API_URLS}${endpoint}${query}`, {
            method: 'GET',
            credentials: 'include',
            headers,
          })

          if (response.status === 404) continue
          if (response.status === 401) {
            setRequiresLogin(true)
            setError('Your session expired. Please login again.')
            setOrders([])
            setLoading(false)
            return
          }
          if (!response.ok) continue

          const json = await response.json()
          const arrays = getOrderArrays(json)
          const candidate = arrays
            .map((arr) => arr.map((item, index) => normalizeOrder(item, index)))
            .sort((a, b) => b.length - a.length)[0] || []

          loaded = true
          if (candidate.length > bestOrders.length) {
            bestOrders = candidate
          }
        } catch (fetchError) {
          // Try the next endpoint/query pair.
          continue
        }
      }
    }

    if (!loaded) {
      setError('Unable to load orders right now. Please try again.')
      setOrders([])
      setLoading(false)
      return
    }

    setError('')
    setRequiresLogin(false)
    setOrders(bestOrders)

    setOpenOrderId((current) => current || bestOrders[0]?.id || '')
    setLoading(false)
  }, [])

  useEffect(() => {
    setLoading(true)
  
    void fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    const onFocus = () => {
      //void fetchOrders()
       
    }

    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [fetchOrders])

  const totalItems = useMemo(
    () => orders.reduce((sum, order) => sum + order.items.reduce((acc, item) => acc + item.quantity, 0), 0),
    [orders]
  )

  const handleBuyAgain = (order) => {
    if (!order?.items?.length) {
      addToast('No products found in this order.', 'error')
      return
    }

    order.items.forEach((item) => {
      dispatch(addItem({
        id: item.productId || item.key,
        _id: item.productId || item.key,
        key: item.productId || item.key,
        name: item.title,
        title: item.title,
        image: item.image,
        price: Number(item.price || 0),
        quantity: Math.max(1, Number(item.quantity || 1)),
        isSelected: true,
      }))
    })

    addToast('Added order items to cart.', 'success')
    navigate('/cart')
  }

  const deleteOrderFromApi = async (orderId) => {
    const token = getAuthToken()
    if (!token || !API_URLS) return false

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-auth-token': token,
      'x-access-token': token,
    }

    const endpoints = ['/api/orders']

    for (const endpoint of endpoints) {
      try {
        let response = await fetch(`${API_URLS}${endpoint}/${encodeURIComponent(orderId)}`, {
          method: 'DELETE',
          credentials: 'include',
          headers,
        })

        if (response.status === 401) {
          setError('Your session expired. Please login again.')
          return false
        }

        if (!response.ok && [404, 405].includes(response.status)) {
          response = await fetch(`${API_URLS}${endpoint}?orderId=${encodeURIComponent(orderId)}`, {
            method: 'DELETE',
            credentials: 'include',
            headers,
          })
        }

        if (!response.ok && [404, 405].includes(response.status)) {
          response = await fetch(`${API_URLS}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: JSON.stringify({
              orderId,
              action: 'delete',
            }),
          })
        }

        if (response.ok) return true
      } catch (requestError) {
        continue
      }
    }

    return false
  }

  

  const cancelOrderInApi = async (orderId, order) => {
  const token = getAuthToken();

  if (!token || !API_URLS) {
    return {
      ok: false,
      message: "Authentication required.",
    };
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(
      `${API_URLS}/api/orders/${encodeURIComponent(orderId)}/cancel`,
      {
        method: "PUT",
        credentials: "include",
        headers,
        body: JSON.stringify({
          reason: "Cancelled by customer",
        }),
      }
    );

    const data = await response.json().catch(() => null);

    if (response.status === 401) {
      setError("Your session expired. Please login again.");

      return {
        ok: false,
        message: "Session expired. Please login again.",
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        message:
          data?.message ||
          "Unable to cancel order.",
      };
    }

    return {
      ok: true,
      message:
        data?.message ||
        "Order cancelled successfully.",
    };
  } catch (error) {
    console.error("Cancel order error:", error);

    return {
      ok: false,
      message: "Unable to cancel order right now.",
    };
  }
};

  const handleCancelOrder = async (order) => {
    const orderId = `${order?.id || ''}`
    if (!orderId) return

    const shouldCancel = await openConfirmPopup({
      title: 'Cancel Order',
      message: `Cancel order #${order.orderNo}?`,
      confirmText: 'Yes, Cancel',
      cancelText: 'No',
    })

    if (!shouldCancel) {
      addToast('Order cancel cancelled.', 'error')
      return
    }

    setCancellingOrderId(orderId)
    const result = await cancelOrderInApi(orderId, order)

    if (result.ok) {
      await fetchOrders()
      addToast(`Order #${order.orderNo} cancelled successfully.`, 'success')
    } else {
      const fallbackMessage = `Unable to cancel order #${order.orderNo} right now.`
      const reason = `${result.message || ''}`.trim()
      addToast(reason || fallbackMessage, 'error')
    }

    setCancellingOrderId('')
  }

  const handleDeleteOrder = async (order) => {
    const orderId = `${order?.id || ''}`
    if (!orderId) return

    const shouldDelete = await openConfirmPopup({
      title: 'Delete Order History',
      message: `Delete order #${order.orderNo}? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    })

    if (!shouldDelete) {
      addToast('Order delete cancelled.', 'error')
      return
    }

    setDeletingOrderId(orderId)
    addToast(`Deleting order #${order.orderNo}...`, 'success')
    const isDeleted = await deleteOrderFromApi(orderId)

    if (isDeleted) {
      setOrders((previous) => previous.filter((item) => item.id !== orderId))
      setOpenOrderId((current) => (current === orderId ? '' : current))
      addToast(`Order #${order.orderNo} deleted from history.`, 'success')
    } else {
      addToast('Unable to delete order right now.', 'error')
    }

    setDeletingOrderId('')      
  }


  const statusClasses = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Processing: "bg-purple-100 text-purple-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};


  return (
    <section className="min-h-[70vh]  from-slate-50 via-white to-amber-50 py-6">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">Order history</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Your orders</h1>
          <p className="mt-2 text-slate-600">
            Track all purchases in one place. Click an order to see item details.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
              {orders.length} order(s) • {totalItems} item(s)
            </div>
            <Link to="/cart" className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
              Cart ({cartQuantity})
            </Link>
          </div>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
                <div className="h-5 w-48 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-72 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {!loading && requiresLogin && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-900">
            <h2 className="text-2xl font-bold">Login required</h2>
            <p className="mt-2 text-sm text-amber-800">Please login to view your order history.</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-amber-300 px-5 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {!loading && !requiresLogin && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
            <p className="font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                //void fetchOrders()
              }}
              className="mt-3 rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold transition hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">No orders yet</h2>
            <p className="mt-2 text-slate-500">Start shopping to see your orders here.</p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Continue shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const isOpen = openOrderId === order.id
              const normalizedStatus = `${order.status || ''}`.trim().toLowerCase()
              const canCancelOrder = !nonCancelableStatuses.has(normalizedStatus)
              const canDeleteOrderHistory = normalizedStatus === 'delivered'
              return (
                <article key={order.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenOrderId(isOpen ? '' : order.id)}
                    className="flex w-full flex-col gap-3 p-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">#{order.orderNo}</h3>
                      <p className="mt-1 text-sm text-slate-500">Placed on {formatDateTime(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        statusClasses[order.status]
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-base font-bold text-slate-900">{formatCurrency(order.total)}</p>
                      <span className="text-xl text-slate-400">{isOpen ? '−' : '+'}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-5">
                      <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-5">
                        <p><span className="font-semibold text-slate-900">Payment:</span> {order.paymentMethod}</p>
                        <p><span className="font-semibold text-slate-900">Delivery:</span> {order.deliveryMethod}</p>
                        <p><span className="font-semibold text-slate-900">Items:</span> {order.items.length}</p>
                        <p><span className="font-semibold text-slate-900">Shipping Cost:</span> {formatCurrency(order.shippingCost)}</p>
                        <p><span className="font-semibold text-slate-900">Subtotal:</span> {formatCurrency(order.subtotal)}</p>
                      </div>

                      <div className="mt-5 grid gap-3">
                        {order.items.map((item) => (
                          <div key={item.key} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
                            <img
                              src={getImageUrl(item.image) || 'https://via.placeholder.com/72x72?text=Item'}
                              alt={item.title}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-slate-900">{item.title}</p>
                              <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm">
                        <p className="font-semibold text-slate-900">Shipping Address</p>
                        <p className="mt-1 text-slate-600">
                          {order.shippingAddress?.fullName || order.shippingAddress?.name || ''}
                          {order.shippingAddress?.address1 || order.shippingAddress?.line1 ? `, ${order.shippingAddress.address1 || order.shippingAddress.line1}` : ''}
                          {order.shippingAddress?.address2 || order.shippingAddress?.line2 ? `, ${order.shippingAddress.address2 || order.shippingAddress.line2}` : ''}
                          {order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ''}
                          {order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''}
                          {order.shippingAddress?.country ? `, ${order.shippingAddress.country}` : ''}
                          {order.shippingAddress?.pincode || order.shippingAddress?.postalCode ? ` - ${order.shippingAddress.pincode || order.shippingAddress.postalCode}` : ''}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleBuyAgain(order)}
                          className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                        >
                          Buy Again
                        </button>
                        {canCancelOrder && (
                          <button
                            type="button"
                            onClick={() => void handleCancelOrder(order)}
                            disabled={cancellingOrderId === order.id}
                            className="rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                        {canDeleteOrderHistory && (
                          <button
                            type="button"
                            onClick={() => void handleDeleteOrder(order)}
                            disabled={deletingOrderId === order.id}
                            className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {deletingOrderId === order.id ? 'Deleting...' : 'Delete History'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default OrderList