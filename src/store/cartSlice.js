import { createSlice, createSelector } from '@reduxjs/toolkit'

const loadCartFromLocalStorage = () => {
  try {
    const raw = window.localStorage.getItem('cart')
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    return []
  }
}

const normalizeItemKey = ({ id, selectedSize = '', selectedFinish = '' }) =>
  `${id}::${selectedSize}::${selectedFinish}`

const initialState = {
  items: loadCartFromLocalStorage(),
  coupon: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
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
      } else {
        state.items.push({
          ...item,
          key,
          quantity: Math.min(quantity, stock),
          stock,
          selectedSize: item.selectedSize || '',
          selectedFinish: item.selectedFinish || '',
        })
      }
    },
    updateQuantity(state, action) {
      const { key, quantity } = action.payload
      const item = state.items.find((cartItem) => cartItem.key === key)
      if (item) {
        item.quantity = Math.max(1, Math.min(Number(quantity), item.stock ?? Infinity))
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.key !== action.payload)
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

const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

const selectCartTotalQuantity = createSelector([selectCartItems], (items) =>
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
    if (subtotal === 0) return 0
    if (coupon === 'FREESHIP') return 0
    return 99
  },
)

const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCartDiscount, selectShipping],
  (subtotal, discount, shipping) => Math.max(0, subtotal - discount + shipping),
)

export const {
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  applyCoupon,
} = cartSlice.actions

export {
  selectCartItems,
  selectCartCoupon,
  selectCartSubtotal,
  selectCartTotalQuantity,
  selectCartDiscount,
  selectShipping,
  selectCartTotal,
}

export default cartSlice.reducer
