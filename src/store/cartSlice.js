import { createSlice, createSelector } from '@reduxjs/toolkit'
import { calculateCartGst, round2 } from '../utils/gst'

const getCurrentUserIdentifier = () => {
  if (typeof window === 'undefined') return 'guest'

  try {
    const rawUser = window.localStorage.getItem('user')
    if (!rawUser) return 'guest'

    const user = JSON.parse(rawUser)
    const email = `${user?.email || ''}`.trim().toLowerCase()
    return email || user?.id || user?._id || user?.name || 'guest'
  } catch (error) {
    return 'guest'
  }
}

const getCartStorageKey = (userIdentifier = getCurrentUserIdentifier()) => {
  const normalizedKey = `${userIdentifier || 'guest'}`.trim()
  return normalizedKey && normalizedKey !== 'guest'
    ? `cart:${normalizedKey}`
    : 'cart:guest'
}

const loadCartFromLocalStorage = () => {
  try {
    const raw = window.localStorage.getItem(getCartStorageKey())
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    return []
  }
}

const getItemId = (item = {}) => item.id || item._id || item.productId || item.product || item.key || ''

const normalizeItemKey = (item = {}) => `${item.key || getItemId(item)}`

const getVariantAttributes = (item = {}) => ({
  ...(item.selectedVariant?.attributes || {}),
  ...(item.attributes || {}),
  ...(item.variantAttributes || {}),
})

const getAddons = (item = {}) => (Array.isArray(item.addons) ? item.addons : [])

const initialState = {
  items: loadCartFromLocalStorage(),
  coupon: null,
  userIdentifier: getCurrentUserIdentifier(),
}

const normalizeCartItem = (item = {}) => {
  const key = normalizeItemKey(item)
  const variantAttributes = getVariantAttributes(item)
  return {
    ...item,
    id: item.id || item._id || item.productId || getItemId(item),
    _id: item._id || item.id || item.productId || getItemId(item),
    key,
    quantity: Number(item.quantity) || 1,
    stock: item.stock != null ? Number(item.stock) : Infinity,
    isSelected: item.isSelected !== false,
    variantId: item.variantId || '',
    variantSku: item.variantSku || '',
    variantAttributes,
    addons: getAddons(item),
    selectedSize: item.selectedSize || '',
    selectedFinish: item.selectedFinish || '',
    // Backward compatible defaults for products/orders created before GST support.
    hsnCode: item.hsnCode || '',
    gstRate: Number(item.gstRate) || 0,
    priceIncludesGST: item.priceIncludesGST === true,
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCartForUser(state, action) {
      const userIdentifier = action.payload || getCurrentUserIdentifier()
      const key = getCartStorageKey(userIdentifier)

      state.userIdentifier = userIdentifier

      try {
        const raw = window.localStorage.getItem(key)
        state.items = raw ? JSON.parse(raw) : []
      } catch (error) {
        state.items = []
      }

      state.coupon = null
    },
    setCartItems(state, action) {
      const incomingItems = Array.isArray(action.payload) ? action.payload : []
      const mergedByKey = new Map(state.items.map((item) => [normalizeItemKey(item), item]))

      incomingItems.forEach((item) => {
        const key = normalizeItemKey(item)
        const existing = mergedByKey.get(key)
        const normalized = normalizeCartItem(item)

        if (existing) {
          mergedByKey.set(key, {
            ...existing,
            ...normalized,
            key,
            quantity: Math.max(Number(existing.quantity) || 0, Number(normalized.quantity) || 0),
            price: normalized.price ?? existing.price,
            stock: normalized.stock ?? existing.stock,
            variantAttributes: { ...existing.variantAttributes, ...normalized.variantAttributes },
            addons: normalized.addons?.length ? normalized.addons : existing.addons || [],
            // Backend cart APIs may not echo GST fields yet; keep whatever was already known locally.
            hsnCode: item.hsnCode || existing.hsnCode || '',
            gstRate: item.gstRate != null ? Number(item.gstRate) || 0 : (Number(existing.gstRate) || 0),
            priceIncludesGST: item.priceIncludesGST != null ? item.priceIncludesGST === true : existing.priceIncludesGST === true,
          })
        } else {
          mergedByKey.set(key, normalized)
        }
      })

      const mergedItems = Array.from(mergedByKey.values())
      state.items = mergedItems.length > 0 ? mergedItems : []
    },
    replaceCartItems(state, action) {
      const incomingItems = Array.isArray(action.payload) ? action.payload : []
      const previousByKey = new Map(state.items.map((item) => [normalizeItemKey(item), item]))
      const byKey = new Map()

      incomingItems.forEach((item) => {
        const previous = previousByKey.get(normalizeItemKey(item))
        const normalized = normalizeCartItem(item)
        if (previous) {
          // Backend cart APIs may not echo GST fields yet; keep whatever was already known locally.
          normalized.hsnCode = item.hsnCode || previous.hsnCode || ''
          normalized.gstRate = item.gstRate != null ? Number(item.gstRate) || 0 : (Number(previous.gstRate) || 0)
          normalized.priceIncludesGST = item.priceIncludesGST != null ? item.priceIncludesGST === true : previous.priceIncludesGST === true
        }
        const existing = byKey.get(normalized.key)

        if (existing) {
          byKey.set(normalized.key, {
            ...existing,
            ...normalized,
            quantity: Number(normalized.quantity) || Number(existing.quantity) || 1,
            variantAttributes: { ...existing.variantAttributes, ...normalized.variantAttributes },
            addons: normalized.addons?.length ? normalized.addons : existing.addons || [],
          })
          return
        }

        byKey.set(normalized.key, normalized)
      })

      state.items = Array.from(byKey.values())
    },
    addItem(state, action) {
      const item = action.payload
      const key = normalizeItemKey(item)
      const quantity = Number(item.quantity) || 1
      const stock = item.stock != null ? Number(item.stock) : Infinity
      const existing = state.items.find((cartItem) => cartItem.key === key)

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, stock)
        existing.selectedSize = item.selectedSize || existing.selectedSize
        existing.selectedFinish = item.selectedFinish || existing.selectedFinish
        existing.variantId = item.variantId || existing.variantId
        existing.variantSku = item.variantSku || existing.variantSku
        existing.variantAttributes = { ...existing.variantAttributes, ...getVariantAttributes(item) }
        existing.addons = item.addons?.length ? item.addons : existing.addons || []
        existing.hsnCode = item.hsnCode || existing.hsnCode || ''
        existing.gstRate = item.gstRate != null ? Number(item.gstRate) || 0 : (Number(existing.gstRate) || 0)
        existing.priceIncludesGST = item.priceIncludesGST != null ? item.priceIncludesGST === true : existing.priceIncludesGST === true
      } else {
        state.items.push({
          ...item,
          id: item.id || item._id || item.productId || getItemId(item),
          _id: item._id || item.id || item.productId || getItemId(item),
          key,
          quantity: Math.min(quantity, stock),
          stock,
          isSelected: item.isSelected !== false,
          variantId: item.variantId || '',
          variantSku: item.variantSku || '',
          variantAttributes: getVariantAttributes(item),
          addons: getAddons(item),
          selectedSize: item.selectedSize || '',
          selectedFinish: item.selectedFinish || '',
          hsnCode: item.hsnCode || '',
          gstRate: Number(item.gstRate) || 0,
          priceIncludesGST: item.priceIncludesGST === true,
        })
      }
    },
    toggleItemSelection(state, action) {
      const { key, isSelected } = action.payload
      const item = state.items.find((cartItem) => cartItem.key === key)

      if (item) {
        item.isSelected = isSelected !== false
      }
    },
    toggleAllSelections(state, action) {
      const isSelected = action.payload !== false
      state.items.forEach((item) => {
        item.isSelected = isSelected
      })
    },
    updateQuantity(state, action) {
      const { key, quantity } = action.payload
      const nextQuantity = Number(quantity)

      if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
        state.items = state.items.filter((cartItem) => cartItem.key !== key)
        return
      }

      const item = state.items.find((cartItem) => cartItem.key === key)
      if (item) {
        item.quantity = Math.min(nextQuantity, item.stock ?? Infinity)
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.key !== action.payload)
    },
      removeSelectedItems(state) {
      state.items = state.items.filter(item => !item.isSelected);
    },
    clearCart(state) {
       state.items = []
       state.coupon = null
    },
    applyCoupon(state, action) {
      state.coupon = action.payload ? action.payload.trim().toUpperCase() : null
    },
  },
})

const selectCartItems = (state) => state.cart.items
const selectCartCoupon = (state) => state.cart.coupon
const selectCheckedCartItems = createSelector([selectCartItems], (items) =>
  items.filter((item) => item.isSelected !== false),
)

const selectCartSubtotal = createSelector([selectCheckedCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

// GST is computed per item since different products can carry different GST rates.
// Customer state is unknown at cart stage, so the split defaults to intra-state (CGST + SGST).
const selectCartGstSummary = createSelector([selectCheckedCartItems], (items) =>
  calculateCartGst(items, ''),
)

const selectCartTaxableAmount = createSelector([selectCartGstSummary], (summary) => summary.taxableAmount)
const selectCartGstAmount = createSelector([selectCartGstSummary], (summary) => summary.gstAmount)

const selectCartTotalQuantity = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
)

const selectCheckedCartQuantity = createSelector([selectCheckedCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
)

const selectCartDiscount = createSelector(
  [selectCartSubtotal, selectCartCoupon],
  (subtotal, coupon) => {
    if (!coupon) return 0
    if (coupon === 'SAVE10') return Math.round(subtotal * 0.1)
    return 0
  },
)

const selectShipping = createSelector(
  [selectCartSubtotal, selectCartCoupon],
  (subtotal, coupon) => {
    if (subtotal === 0) return 0;
    if (subtotal >= 1999) return 0;
    if (coupon === 'FREESHIP') return 0;
    return 99;
  },
)

const selectCartTotal = createSelector(
  [selectCartGstSummary, selectCartDiscount, selectShipping],
  (gstSummary, discount, shipping) =>
    round2(Math.max(0, gstSummary.taxableAmount + gstSummary.gstAmount - discount + shipping)),
)

export const {
  hydrateCartForUser,
  setCartItems,
  replaceCartItems,
  addItem,
  toggleItemSelection,
  toggleAllSelections,
  updateQuantity,
  removeItem,
  clearCart,
  applyCoupon,
  removeSelectedItems
} = cartSlice.actions

export {
  selectCartItems,
  selectCheckedCartItems,
  selectCartCoupon,
  selectCartSubtotal,
  selectCartTotalQuantity,
  selectCheckedCartQuantity,
  selectCartDiscount,
  selectShipping,
  selectCartTotal,
  selectCartGstSummary,
  selectCartTaxableAmount,
  selectCartGstAmount,
  getCartStorageKey,
}

export default cartSlice.reducer
