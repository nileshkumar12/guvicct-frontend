import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
})

store.subscribe(() => {
  try {
    const state = store.getState()
    window.localStorage.setItem('cart', JSON.stringify(state.cart.items))
  } catch (error) {
    // ignore persistence errors
  }
})

export default store
