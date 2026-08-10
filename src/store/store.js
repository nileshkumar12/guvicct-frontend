import { configureStore } from '@reduxjs/toolkit'
import cartReducer, { getCartStorageKey, replaceCartItems } from './cartSlice'
import wishlistReducer, { getWishlistStorageKey, replaceWishlistItems } from './wishlistSlice'
import { API_URLS } from '../utils/config'

let isAuthTokenInvalid = false

const normalizeAuthToken = (value) => {
  if (!value) return ''
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    const withoutBearer = trimmed.replace(/^Bearer\s+/i, '')
    return withoutBearer
  }
  if (typeof value === 'object') {
    return normalizeAuthToken(value.token || value.accessToken || value.authToken || value.jwt || '')
  }
  return `${value}`.trim()
}

const normalizeUserPayload = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  if (value.user && typeof value.user === 'object' && !Array.isArray(value.user)) {
    return value.user
  }

  if (value.userData && typeof value.userData === 'object' && !Array.isArray(value.userData)) {
    return value.userData
  }

  if (value.data && typeof value.data === 'object' && !Array.isArray(value.data)) {
    if (value.data.user && typeof value.data.user === 'object' && !Array.isArray(value.data.user)) {
      return value.data.user
    }
    if (value.data.userData && typeof value.data.userData === 'object' && !Array.isArray(value.data.userData)) {
      return value.data.userData
    }
    if (value.data.id || value.data._id || value.data.email || value.data.name || value.data.role) {
      return value.data
    }
  }

  if (value.id || value._id || value.email || value.name || value.role) {
    return value
  }

  return null
}

const getStoredUser = () => {
  if (typeof window === 'undefined') return null

  try {
    const rawUser = window.localStorage.getItem('user')
    if (!rawUser) return null

    const parsedUser = JSON.parse(rawUser)
    return normalizeUserPayload(parsedUser) || parsedUser
  } catch (error) {
    return null
  }
}

const getJwtPayload = (token) => {
  if (!token) return null

  try {
    const payloadPart = token.split('.')[1]
    if (!payloadPart) return null
    const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(window.atob(normalizedPayload))
  } catch (error) {
    return null
  }
}

const isTokenUsable = (token) => {
  if (!token) return false
  if (isAuthTokenInvalid) return false

  const payload = getJwtPayload(token)
  if (!payload || !payload.exp) return true

  const nowInSeconds = Math.floor(Date.now() / 1000)
  return Number(payload.exp) > nowInSeconds
}

const markTokenUnauthorized = () => {
  if (typeof window === 'undefined') return

  isAuthTokenInvalid = true
  ;['token', 'accessToken', 'authToken', 'jwt'].forEach((key) => {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      // ignore storage write errors
    }
  })
}

const getUserIdentifier = () => {
  const user = getStoredUser()
  const email = `${user?.email || ''}`.trim().toLowerCase()
  return email || user?.id || user?._id || user?.name || 'guest'
}

const getApiUserIdentifier = () => {
  const user = getStoredUser()
  if (user?.id || user?._id || user?.userId || user?.sub) {
    return user?.id || user?._id || user?.userId || user?.sub || ''
  }

  const token = getAuthToken()
  if (!token) return ''

  try {
    const payloadPart = token.split('.')[1]
    if (!payloadPart) return ''
    const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = JSON.parse(window.atob(normalizedPayload))
    return decodedPayload?.sub || decodedPayload?.userId || decodedPayload?.id || decodedPayload?._id || ''
  } catch (error) {
    return ''
  }
}

const getAuthToken = () => {
  if (typeof window === 'undefined') return ''

  if (isAuthTokenInvalid) return ''

  const candidates = [
    window.localStorage.getItem('token'),
    window.localStorage.getItem('accessToken'),
    window.localStorage.getItem('authToken'),
    window.localStorage.getItem('jwt'),   
  ]

  for (const candidate of candidates) {
    const normalized = normalizeAuthToken(candidate)
    if (normalized && isTokenUsable(normalized)) return normalized
  }

  try {
    const storedUser = window.localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      const normalized = normalizeAuthToken(parsedUser?.token || parsedUser?.accessToken || parsedUser?.authToken || parsedUser?.jwt)
      if (normalized && isTokenUsable(normalized)) return normalized
    }
  } catch (error) {
    // ignore
  }

  return ''
}

const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
})

const normalizeCartResponse = (responseItems) => {
  if (!Array.isArray(responseItems)) return []

  return responseItems.map((item) => {
    const product = item.product || item.productId || item._id || item.id || {}
    const productId = typeof product === 'object' ? product._id || product.id : product
    const quantity = Number(item.quantity || item.qty || 1)
    const price = Number(item.price || product.price || 0)
    const key = `${productId || item.id || item._id || item.productId || 'item'}`

    return {
      id: productId || item.id || item._id || item.key,
      _id: productId || item._id || item.id || item.key,
      key,
      name: item.name || item.title || product.name || product.title || '',
      title: item.title || item.name || product.title || product.name || '',
      price,
      quantity,
      stock: item.stock != null ? Number(item.stock) : Infinity,
      isSelected: item.isSelected !== false,
      selectedSize: item.selectedSize || '',
      selectedFinish: item.selectedFinish || '',
      image: item.image || product.image || '',
    }
  })
}

const normalizeWishlistResponse = (responseItems) => {
  if (!Array.isArray(responseItems)) return []

  return responseItems.map((item) => {
    const product = item.product || item.productId || item._id || item.id || {}
    const productId = typeof product === 'object' ? product._id || product.id : product
    const key = `${productId || item.id || item._id || item.productId || item.key || ''}`

    return {
      id: productId || item.id || item._id || item.key,
      _id: productId || item._id || item.id || item.key,
      key,
      name: item.name || item.title || product.name || product.title || '',
      title: item.title || item.name || product.title || product.name || '',
      price: Number(item.price || product.price || 0),
      image: item.image || product.image || '',
    }
  }).filter((item) => item.key)
}

const extractWishlistArrays = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return [value]
  if (typeof value !== 'object') return []

  const candidates = []
  const keys = ['items', 'wishlist', 'wishlistItems', 'products', 'data', 'result']

  keys.forEach((key) => {
    const nextValue = value[key]
    if (Array.isArray(nextValue)) {
      candidates.push(nextValue)
      return
    }

    if (nextValue && typeof nextValue === 'object') {
      candidates.push(...extractWishlistArrays(nextValue))
    }
  })

  return candidates
}

const normalizeWishlistFromUnknownShape = (data) => {
  const arrays = extractWishlistArrays(data)
  if (arrays.length === 0) return []

  const normalizedCandidates = arrays.map((items) => normalizeWishlistResponse(items))
  normalizedCandidates.sort((a, b) => b.length - a.length)
  return normalizedCandidates[0] || []
}

const loadCartFromApi = async (apiUserIdentifier) => {
  if (!API_URLS) return null

  const token = getAuthToken()
  if (!token) return null
  const storedUser = getStoredUser()
  const userEmail = `${storedUser?.email || ''}`.trim().toLowerCase()

  try {
    const response = await fetch(`${API_URLS}/api/cart?user=${encodeURIComponent(apiUserIdentifier || 'guest')}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-auth-token': token,
        'x-access-token': token,
        'x-user-email': userEmail,
      },
    })

    if (response.status === 401) {
      markTokenUnauthorized()
      return null
    }

    if (!response.ok) return null

    const data = await response.json()
    const responseItems = Array.isArray(data)
      ? data
      : data.items || data.cartItems || data.cart || data.data || data.products || []

    if (Array.isArray(responseItems)) {
      return normalizeCartResponse(responseItems)
    }

    if (responseItems && typeof responseItems === 'object') {
      const nestedItems = responseItems.items || responseItems.cartItems || responseItems.cart || responseItems.data || []
      return normalizeCartResponse(Array.isArray(nestedItems) ? nestedItems : [])
    }

    return []
  } catch (error) {
    console.warn('Cart load failed', error)
    return null
  }
}

const loadWishlistFromApi = async (apiUserIdentifier) => {
  if (!API_URLS) return null

  const token = getAuthToken()
  if (!token) return null

  const endpoints = []
  const userQueries = [
    apiUserIdentifier ? `?user=${encodeURIComponent(apiUserIdentifier)}` : '',
    '',
  ].filter((value, index, all) => value || index === all.indexOf(''))

  let bestItems = null
  let hasSuccessfulResponse = false

  for (const endpoint of endpoints) {
    for (let index = 0; index < userQueries.length; index += 1) {
      const userQuery = userQueries[index]
      try {
        const response = await fetch(`${API_URLS}${endpoint}${userQuery}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'x-auth-token': token,
            'x-access-token': token,
          },
        })

        if (response.status === 404) {
          continue
        }

        if (response.status === 401) {
          markTokenUnauthorized()
          return null
        }

        if (!response.ok) {
          continue
        }

        const data = await response.json()
        const normalizedItems = normalizeWishlistFromUnknownShape(data)
        hasSuccessfulResponse = true

        if (!bestItems || normalizedItems.length > bestItems.length) {
          bestItems = normalizedItems
        }
      } catch (error) {
        console.warn('Wishlist load failed', error)
        continue
      }
    }
  }

  if (hasSuccessfulResponse) {
    return bestItems || []
  }

  return null
}

const buildCartSyncSignature = (items = [], userIdentifier = 'guest') => {
  const normalized = (items || [])
    .map((item) => `${item.key || item.id || item._id}:${Number(item.quantity) || 0}`)
    .sort()
    .join('|')
  return `${userIdentifier}::${normalized}`
}

const syncCartToApi = async (cartState, apiUserIdentifier) => {
  if (!API_URLS) return

  const token = getAuthToken()
  if (!token) return false

  try {
    const normalizedItems = (cartState.items || []).map((item) => ({
      id: item.id || item._id || item.key,
      productId: item.id || item._id || item.key,
      key: item.key,
      name: item.name || item.title || '',
      title: item.title || item.name || '',
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      stock: Number(item.stock ?? 0),
      isSelected: item.isSelected !== false,
      selectedSize: item.selectedSize || '',
      selectedFinish: item.selectedFinish || '',
      image: item.image || '',
    }))

    const storedUser = getStoredUser()
    const userEmail = storedUser?.email || storedUser?.user?.email || ''

    const payload = {
      email: userEmail,
      items: normalizedItems.map((item) => ({
        product: item.productId || item._id,
        productId: item.productId || item._id,
        quantity: item.quantity,
        price: item.price,
        isSelected: item.isSelected !== false,
        name: item.name || item.title || '',
        title: item.title || item.name || '',
      })),
      cartItems: normalizedItems.map((item) => ({
        product: item.productId || item._id,
        productId: item.productId || item._id,
        quantity: item.quantity,
        price: item.price,
        isSelected: item.isSelected !== false,
        name: item.name || item.title || '',
        title: item.title || item.name || '',
      })),
    }

    if (apiUserIdentifier) {
      payload.userId = apiUserIdentifier
      payload.user = apiUserIdentifier
    }

    let response = await fetch(`${API_URLS}/api/cart`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-auth-token': token,
        'x-access-token': token,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok && [404, 405].includes(response.status)) {
      response = await fetch(`${API_URLS}/api/cart`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-auth-token': token,
          'x-access-token': token,
        },
        body: JSON.stringify(payload),
      })
    }

    if (response.status === 401) {
      markTokenUnauthorized()
      return false
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.warn('Cart sync failed', response.status, errorText)
      return false
    }

    return true
  } catch (error) {
    console.warn('Cart sync failed', error)
    return false
  }
}

const buildWishlistSyncSignature = (items = [], userIdentifier = 'guest') => {
  const normalized = (items || [])
    .map((item) => `${item.key || item.id || item._id}`)
    .sort()
    .join('|')
  return `${userIdentifier}::${normalized}`
}

const requestWishlistMutation = async ({ endpoint, method, token, payload, productId }) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'x-auth-token': token,
    'x-access-token': token,
  }

  const body = JSON.stringify(payload)

  if (!endpoint) {
    return false
  }

  if (method === 'DELETE' && productId) {
    const deletePathResponse = await fetch(`${API_URLS}${endpoint}/${encodeURIComponent(productId)}`, {
      method,
      credentials: 'include',
      headers,
      body,
    })

    if (deletePathResponse.status === 401) {
      markTokenUnauthorized()
      return false
    }

    if (deletePathResponse.ok) return true

    const deleteQueryResponse = await fetch(`${API_URLS}${endpoint}?productId=${encodeURIComponent(productId)}`, {
      method,
      credentials: 'include',
      headers,
      body,
    })

    if (deleteQueryResponse.status === 401) {
      markTokenUnauthorized()
      return false
    }

    if (deleteQueryResponse.ok) return true
  }

  const baseResponse = await fetch(`${API_URLS}${endpoint}`, {
    method,
    credentials: 'include',
    headers,
    body,
  })

  if (baseResponse.status === 401) {
    markTokenUnauthorized()
    return false
  }

  if (baseResponse.ok) return true

  if (![404, 405].includes(baseResponse.status) || !productId) {
    return false
  }

  const paramResponse = await fetch(`${API_URLS}${endpoint}/${encodeURIComponent(productId)}`, {
    method,
    credentials: 'include',
    headers,
    body,
  })

  if (paramResponse.status === 401) {
    markTokenUnauthorized()
    return false
  }

  return paramResponse.ok
}

const syncWishlistToApi = async (wishlistState, apiUserIdentifier) => {
  if (!API_URLS) return false

  const token = getAuthToken()
  if (!token) return false

  const normalizedItems = (wishlistState.items || []).map((item) => ({
    id: item.id || item._id || item.key,
    product: item.id || item._id || item.key,
    productId: item.id || item._id || item.key,
    key: item.key,
    name: item.name || item.title || '',
    title: item.title || item.name || '',
    price: Number(item.price || 0),
    image: item.image || '',
  }))

  const storedUser = getStoredUser()
  const userEmail = storedUser?.email || storedUser?.user?.email || ''

  const payload = {
    email: userEmail,
    productId: normalizedItems[0]?.productId || normalizedItems[0]?.id || '',
    product: normalizedItems[0]?.productId || normalizedItems[0]?.id || '',
    productIds: normalizedItems.map((item) => item.productId || item.id).filter(Boolean),
    items: normalizedItems,
    wishlist: normalizedItems.map((item) => ({
      productId: item.productId || item.id,
      product: item.productId || item.id,
      id: item.id,
      key: item.key,
      name: item.name,
      title: item.title,
      price: item.price,
      image: item.image,
    })),
    wishlistItems: normalizedItems.map((item) => ({
      productId: item.productId || item.id,
      product: item.productId || item.id,
      id: item.id,
      key: item.key,
      name: item.name,
      title: item.title,
      price: item.price,
      image: item.image,
    })),
  }

  const endpoints = ['/api/wishlist']

  try {
    const previousItems = Array.isArray(syncWishlistToApi.lastItems) ? syncWishlistToApi.lastItems : []
    const previousIds = new Set(previousItems.map((item) => `${item.productId || item.id || item._id || item.key}`).filter(Boolean))
    const currentIds = new Set(normalizedItems.map((item) => `${item.productId || item.id || item._id || item.key}`).filter(Boolean))

    const itemsToAdd = normalizedItems.filter((item) => !previousIds.has(`${item.productId || item.id || item._id || item.key}`))
    const itemsToRemove = previousItems.filter((item) => !currentIds.has(`${item.productId || item.id || item._id || item.key}`))

    const operations = [
      ...itemsToAdd.map((item) => ({ type: 'add', item })),
      ...itemsToRemove.map((item) => ({ type: 'remove', item })),
    ]

    if (operations.length === 0) {
      syncWishlistToApi.lastItems = normalizedItems
      return true
    }

    for (const operation of operations) {
      const productId = `${operation.item.productId || operation.item.id || operation.item._id || operation.item.key}`
      if (!productId) continue

      const mutationPayload = {
        email: userEmail,
        productId,
        product: productId,
        item: {
          ...operation.item,
          productId,
          product: productId,
        },
      }

      let operationSucceeded = false

      for (const endpoint of endpoints) {
        const method = operation.type === 'add' ? 'POST' : 'DELETE'
        const ok = await requestWishlistMutation({
          endpoint,
          method,
          token,
          payload: mutationPayload,
          productId,
        })

        if (ok) {
          operationSucceeded = true
          break
        }
      }

      if (!operationSucceeded) {
        console.warn('Wishlist sync failed for product', productId)
        return false
      }
    }

    syncWishlistToApi.lastItems = normalizedItems
    return true
  } catch (error) {
    console.warn('Wishlist sync failed', error)
    return false
  }
}

syncWishlistToApi.lastItems = []

let lastSyncedCartSignature = ''
let pendingSyncSignature = ''
let lastSyncedWishlistSignature = ''
let pendingWishlistSyncSignature = ''

store.subscribe(() => {
  try {
    const state = store.getState()
    if (typeof window === 'undefined') return

    const normalizedUserKey = getUserIdentifier()
    const apiUserIdentifier = getApiUserIdentifier()
    const authToken = getAuthToken()
    const cartStorageKey = getCartStorageKey(normalizedUserKey)
    const wishlistStorageKey = getWishlistStorageKey(normalizedUserKey)

    window.localStorage.setItem(cartStorageKey, JSON.stringify(state.cart.items))
    window.localStorage.setItem(wishlistStorageKey, JSON.stringify(state.wishlist.items))

    if (apiUserIdentifier) {
      const signature = buildCartSyncSignature(state.cart.items, apiUserIdentifier)
      if (signature !== lastSyncedCartSignature && signature !== pendingSyncSignature) {
        pendingSyncSignature = signature
        void syncCartToApi(state.cart, apiUserIdentifier).then((isSynced) => {
          if (isSynced) {
            lastSyncedCartSignature = signature
          }

          if (pendingSyncSignature === signature) {
            pendingSyncSignature = ''
          }
        })
      }
    }

    if (authToken && typeof window !== 'undefined' && !isWishlistHydratingFromApi) {
      const wishlistSignature = buildWishlistSyncSignature(state.wishlist.items, apiUserIdentifier)
      if (wishlistSignature !== lastSyncedWishlistSignature && wishlistSignature !== pendingWishlistSyncSignature) {
        pendingWishlistSyncSignature = wishlistSignature
        void syncWishlistToApi(state.wishlist, apiUserIdentifier).then((isSynced) => {
          if (isSynced) {
            lastSyncedWishlistSignature = wishlistSignature
          }

          if (pendingWishlistSyncSignature === wishlistSignature) {
            pendingWishlistSyncSignature = ''
          }
        })
      }
    }
  } catch (error) {
    // ignore persistence errors
  }
})

let lastHydratedUser = null
let isHydratingFromApi = false
let lastWishlistHydratedUser = null
let isWishlistHydratingFromApi = false
let wishlistRefreshIntervalId = null

const hydrateCartFromApi = async (apiUserIdentifier) => {
  if (!apiUserIdentifier || isHydratingFromApi) return

  isHydratingFromApi = true
  lastHydratedUser = apiUserIdentifier

  try {
    const items = await loadCartFromApi(apiUserIdentifier)
    if (Array.isArray(items)) {
      store.dispatch(replaceCartItems(items))
      const hydratedSignature = buildCartSyncSignature(items, apiUserIdentifier)
      lastSyncedCartSignature = hydratedSignature
      pendingSyncSignature = ''
    }
  } catch (error) {
    console.warn('Cart hydration failed', error)
  } finally {
    isHydratingFromApi = false
  }
}

const hydrateWishlistFromApi = async (apiUserIdentifier) => {
  const token = getAuthToken()
  if (!token || isWishlistHydratingFromApi) return

  isWishlistHydratingFromApi = true
  lastWishlistHydratedUser = apiUserIdentifier

  try {
    const items = await loadWishlistFromApi(apiUserIdentifier)
    if (Array.isArray(items) && items.length > 0) {
      store.dispatch(replaceWishlistItems(items))
      syncWishlistToApi.lastItems = items.map((item) => ({
        id: item.id || item._id || item.productId || item.key,
        _id: item._id || item.id || item.productId || item.key,
        productId: item.productId || item.id || item._id || item.key,
        key: item.key || item.id || item._id || item.productId,
        name: item.name || item.title || '',
        title: item.title || item.name || '',
        price: Number(item.price || 0),
        image: item.image || '',
      }))
      const hydratedSignature = buildWishlistSyncSignature(items, apiUserIdentifier)
      lastSyncedWishlistSignature = hydratedSignature
      pendingWishlistSyncSignature = ''
      return
    }

    if (Array.isArray(items) && items.length === 0) {
      const existingItems = store.getState().wishlist.items

      if (!Array.isArray(existingItems) || existingItems.length === 0) {
        store.dispatch(replaceWishlistItems([]))
      }

      const baselineItems = Array.isArray(existingItems) ? existingItems : []
      syncWishlistToApi.lastItems = baselineItems.map((item) => ({
        id: item.id || item._id || item.productId || item.key,
        _id: item._id || item.id || item.productId || item.key,
        productId: item.productId || item.id || item._id || item.key,
        key: item.key || item.id || item._id || item.productId,
        name: item.name || item.title || '',
        title: item.title || item.name || '',
        price: Number(item.price || 0),
        image: item.image || '',
      }))

      const hydratedSignature = buildWishlistSyncSignature(baselineItems, apiUserIdentifier)
      lastSyncedWishlistSignature = hydratedSignature
      pendingWishlistSyncSignature = ''
    }
  } catch (error) {
    console.warn('Wishlist hydration failed', error)
  } finally {
    isWishlistHydratingFromApi = false
  }
}

const getNormalizedUserKey = () => getUserIdentifier()

const bootstrapCartForCurrentUser = () => {
  if (typeof window === 'undefined') return

  const userIdentifier = getNormalizedUserKey()
  const apiUserIdentifier = getApiUserIdentifier()
  const authToken = getAuthToken()
  const cartStorageKey = getCartStorageKey(userIdentifier)

  try {
    const storedCart = window.localStorage.getItem(cartStorageKey)
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart)
      if (Array.isArray(parsedCart) && parsedCart.length > 0) {
        store.dispatch(replaceCartItems(parsedCart))
      }
    }
  } catch (error) {
    // ignore
  }

  try {
    const wishlistStorageKey = getWishlistStorageKey(userIdentifier)
    const storedWishlist = window.localStorage.getItem(wishlistStorageKey)
    if (storedWishlist) {
      const parsedWishlist = JSON.parse(storedWishlist)
      if (Array.isArray(parsedWishlist)) {
        store.dispatch(replaceWishlistItems(parsedWishlist))
        syncWishlistToApi.lastItems = parsedWishlist.map((item) => ({
          id: item.id || item._id || item.productId || item.key,
          _id: item._id || item.id || item.productId || item.key,
          productId: item.productId || item.id || item._id || item.key,
          key: item.key || item.id || item._id || item.productId,
          name: item.name || item.title || '',
          title: item.title || item.name || '',
          price: Number(item.price || 0),
          image: item.image || '',
        }))
      }
    }
  } catch (error) {
    // ignore
  }

  if (apiUserIdentifier) {
    const shouldForceHydrate = lastHydratedUser !== apiUserIdentifier
    if (shouldForceHydrate || !isHydratingFromApi) {
      void hydrateCartFromApi(apiUserIdentifier)
    }
  }

  if (authToken) {
    const shouldForceWishlistHydrate = lastWishlistHydratedUser !== apiUserIdentifier
    if (shouldForceWishlistHydrate || !isWishlistHydratingFromApi) {
      void hydrateWishlistFromApi(apiUserIdentifier).catch(() => {})
    }
  }
}

const refreshWishlistFromApi = () => {
  const authToken = getAuthToken()
  const apiUserIdentifier = getApiUserIdentifier()
  if (!authToken) return
  void hydrateWishlistFromApi(apiUserIdentifier).catch(() => {})
}

const startWishlistAutoRefresh = () => {
  if (typeof window === 'undefined') return
  if (wishlistRefreshIntervalId) return

  // Keep cross-browser tabs in sync when local storage events are not shared.
  wishlistRefreshIntervalId = window.setInterval(() => {
    if (document.visibilityState !== 'visible') return
    refreshWishlistFromApi()
  }, 15000)
}

const stopWishlistAutoRefresh = () => {
  if (typeof window === 'undefined') return
  if (!wishlistRefreshIntervalId) return

  window.clearInterval(wishlistRefreshIntervalId)
  wishlistRefreshIntervalId = null
}

bootstrapCartForCurrentUser()

if (typeof window !== 'undefined') {
  startWishlistAutoRefresh()

  window.addEventListener('storage', (event) => {
    if (event.key === 'user' || event.key === 'token' || event.key === 'accessToken' || event.key === 'authToken' || event.key === 'jwt') {
      bootstrapCartForCurrentUser()
    }
  })

  window.addEventListener('focus', () => {
    bootstrapCartForCurrentUser()
    refreshWishlistFromApi()
  })

  window.addEventListener('load', () => {
    bootstrapCartForCurrentUser()
    refreshWishlistFromApi()
  })

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      refreshWishlistFromApi()
    }
  })

  window.addEventListener('beforeunload', () => {
    stopWishlistAutoRefresh()
  })
}

export default store
