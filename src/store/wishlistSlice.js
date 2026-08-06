import { createSlice } from '@reduxjs/toolkit'

const getCurrentUserIdentifier = () => {
  if (typeof window === 'undefined') return 'guest'

  try {
    const rawUser = window.localStorage.getItem('user')
    if (!rawUser) return 'guest'

    const user = JSON.parse(rawUser)
    const email = `${user?.email || ''}`.trim().toLowerCase()
    return email || user?.id || user?._id  || 'guest'
  } catch (error) {
    return 'guest'
  }
}

const getWishlistStorageKey = (userIdentifier = getCurrentUserIdentifier()) => {
  const normalizedKey = `${userIdentifier || 'guest'}`.trim()
  return normalizedKey && normalizedKey !== 'guest'
    ? `wishlist:${normalizedKey}`
    : 'wishlist:guest'
}

const loadWishlistFromLocalStorage = () => {
  try {
    return JSON.parse(window.localStorage.getItem(getWishlistStorageKey()) || '[]')
  } catch (error) {
    return []
  }
}

const initialState = {
  items: loadWishlistFromLocalStorage(),
}

const normalizeWishlistItem = (item = {}) => {
  const id = item.id || item._id || item.productId || item.product || item.key || ''
  const key = `${id}`

  return {
    ...item,
    id,
    _id: item._id || item.id || item.productId || id,
    key,
    name: item.name || item.title || '',
    title: item.title || item.name || '',
    price: Number(item.price || 0),
    image: item.image || item.imageUrl || item.image_url || '',
  }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    hydrateWishlistForUser(state, action) {
      const userIdentifier = action.payload || getCurrentUserIdentifier()
      const key = getWishlistStorageKey(userIdentifier)

      try {
        state.items = JSON.parse(window.localStorage.getItem(key) || '[]')
      } catch (error) {
        state.items = []
      }
    },
    addToWishlist(state, action) {
      const product = normalizeWishlistItem(action.payload)
      const exists = state.items.some((item) => item.key === product.key)
      if (!exists) {
        state.items.push(product)
      }
    },
    replaceWishlistItems(state, action) {
      const incomingItems = Array.isArray(action.payload) ? action.payload : []
      const byKey = new Map()

      incomingItems.forEach((item) => {
        const normalized = normalizeWishlistItem(item)
        if (normalized.key) {
          byKey.set(normalized.key, normalized)
        }
      })

      state.items = Array.from(byKey.values())
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((item) => item.key !== action.payload)
    },
  },
})

export const { hydrateWishlistForUser, addToWishlist, replaceWishlistItems, removeFromWishlist } = wishlistSlice.actions
export { getWishlistStorageKey }
export default wishlistSlice.reducer
