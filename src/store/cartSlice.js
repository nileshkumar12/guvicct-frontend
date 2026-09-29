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
    return raw ? mergeCartItems(JSON.parse(raw)) : []
  } catch (error) {
    return []
  }
}

const getItemId = (item = {}) => {
  const product = item.productId || item.product || item.id || item._id || item.key || ''
  return typeof product === 'object' ? product._id || product.id || '' : product
}

const getBrandName = (brand) => {
  if (typeof brand === 'string') return brand.trim()
  if (!brand || typeof brand !== 'object') return ''
  return `${brand.name || brand.brandName || brand.title || brand.label || ''}`.trim()
}

const getVariantId = (item = {}) => {
  const variant = item.selectedVariant || (typeof item.variant === 'object' ? item.variant : {})
  const variantSku = item.variantSku || item.variantSKU || item.sku || variant.sku || ''
  const variantId = variant._id || variant.id || variant.variantId || item.variantId || item.variant_id ||
    (typeof item.variant === 'string' ? item.variant : '') || ''
  return `${variantId}` === `${variantSku}` ? '' : variantId
}

const getVariantAttributes = (item = {}) => ({
  ...(item.selectedVariant?.attributes || {}),
  ...(item.attributes || {}),
  ...(item.variantAttributes || {}),
})

const getVariantIdentity = (item = {}) => {
  const variant = item.selectedVariant || (typeof item.variant === 'object' ? item.variant : {})
  const attributes = Object.entries(getVariantAttributes(item))
    .map(([name, value]) => [name.trim().toLowerCase(), `${value}`.trim().toLowerCase()])
    .filter(([, value]) => value)
    .sort(([left], [right]) => left.localeCompare(right))
  if (attributes.length) return JSON.stringify(['attributes', attributes])

  const sku = item.variantSku || item.variantSKU || item.sku || variant.sku || ''
  if (sku) return `sku:${`${sku}`.trim().toLowerCase()}`

  const variantId = getVariantId(item)
  if (variantId) return `id:${variantId}`

  return JSON.stringify({
    name: item.variantName || variant.name || variant.title || variant.variantName || '',
    selectedSize: item.selectedSize || '',
    selectedFinish: item.selectedFinish || '',
  })
}

const hasSameVariantConfiguration = (left = {}, right = {}) => {
  const leftId = getVariantId(left)
  const rightId = getVariantId(right)
  if (leftId && rightId && `${leftId}` === `${rightId}`) return true

  const leftSku = left.variantSku || left.variantSKU || left.sku || left.selectedVariant?.sku || ''
  const rightSku = right.variantSku || right.variantSKU || right.sku || right.selectedVariant?.sku || ''
  if (leftSku && rightSku && `${leftSku}`.toLowerCase() === `${rightSku}`.toLowerCase()) return true

  const attributesSignature = (item) => JSON.stringify(
    Object.entries(getVariantAttributes(item)).sort(([leftName], [rightName]) => leftName.localeCompare(rightName)),
  )
  const leftAttributes = attributesSignature(left)
  const rightAttributes = attributesSignature(right)
  return leftAttributes !== '[]' && leftAttributes === rightAttributes
}

const normalizeAddon = (addon = {}) => {
  const addonId = addon.addonId || addon._id || addon.id || addon.key || addon.name || ''
  const price = Number(addon.price) || 0
  const quantity = Math.max(1, Number(addon.quantity) || 1)
  return {
    ...addon,
    addonId: `${addonId}`,
    key: `${addon.key || addonId}`,
    name: addon.name || addon.title || 'Add-on',
    price,
    quantity,
    total: Number(addon.total ?? price * quantity) || 0,
  }
}

const normalizeItemKey = (item = {}) => {
  const productId = getItemId(item)
  if (!productId) return `${item.key || ''}`
  const addons = (Array.isArray(item.addons) ? item.addons : [])
    .map(normalizeAddon)
    .map((addon) => [addon.addonId || addon.name.toLowerCase(), addon.quantity])
    .sort(([leftId], [rightId]) => `${leftId}`.localeCompare(`${rightId}`))
  return JSON.stringify([`${productId}`, getVariantIdentity(item), addons])
}

const getAddons = (item = {}) => (Array.isArray(item.addons) ? item.addons.map(normalizeAddon) : [])

const normalizeCartItem = (item = {}) => {
  const addons = getAddons(item)
  const addonTotal = addons.reduce((sum, addon) => sum + addon.total, 0)
  const variant = item.selectedVariant || (typeof item.variant === 'object' ? item.variant : {})
  const product = item.product || item.productId || {}
  const price = Number(item.price ?? item.unitPrice ?? 0)
  const basePrice = Number(item.basePrice ?? Math.max(0, price - addonTotal))
  const key = normalizeItemKey({ ...item, addons })
  const variantAttributes = getVariantAttributes(item)
  return {
    ...item,
    id: item.id || item._id || item.productId || getItemId(item),
    _id: item._id || item.id || item.productId || getItemId(item),
    brand: getBrandName(item.brand) || getBrandName(product.brand),
    key,
    quantity: Number(item.quantity) || 1,
    stock: item.stock != null ? Number(item.stock) : Infinity,
    isSelected: item.isSelected !== false,
    variantId: getVariantId(item),
    variantName: item.variantName || variant.name || variant.title || variant.variantName || '',
    variantSku: item.variantSku || item.variantSKU || item.sku || variant.sku || '',
    variantAttributes,
    selectedVariant: Object.keys(variant).length ? variant : item.selectedVariant,
    hasVariantSnapshot: item.hasVariantSnapshot !== false && Boolean(
      getVariantId(item) ||
      item.variantName ||
      item.variantSku ||
      Object.keys(variantAttributes).length ||
      item.selectedSize ||
      item.selectedFinish
    ),
    basePrice,
    addonTotal: Number(item.addonTotal ?? addonTotal) || 0,
    price: price || basePrice + addonTotal,
    addons,
    hasAddonSnapshot: item.hasAddonSnapshot !== false && Array.isArray(item.addons),
    selectedSize: item.selectedSize || '',
    selectedFinish: item.selectedFinish || '',
    // Backward compatible defaults for products/orders created before GST support.
    hsnCode: item.hsnCode || '',
    gstRate: Number(item.gstRate) || 0,
    priceIncludesGST: item.priceIncludesGST === true,
  }
}

const mergeCartItems = (items = []) => {
  const itemsByKey = new Map()

  items.forEach((item) => {
    const normalized = normalizeCartItem(item)
    const existing = itemsByKey.get(normalized.key)
    if (!existing) {
      itemsByKey.set(normalized.key, normalized)
      return
    }

    const stock = Math.min(Number(existing.stock ?? Infinity), Number(normalized.stock ?? Infinity))
    itemsByKey.set(normalized.key, {
      ...existing,
      ...normalized,
      key: normalized.key,
      quantity: Math.min(
        (Number(existing.quantity) || 0) + (Number(normalized.quantity) || 0),
        stock,
      ),
      stock,
      brand: normalized.brand || existing.brand || '',
      variantAttributes: { ...existing.variantAttributes, ...normalized.variantAttributes },
      selectedVariant: normalized.selectedVariant || existing.selectedVariant,
      addons: normalized.addons?.length ? normalized.addons : existing.addons || [],
    })
  })

  return Array.from(itemsByKey.values())
}

const initialState = {
  items: loadCartFromLocalStorage(),
  coupon: null,
  userIdentifier: getCurrentUserIdentifier(),
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
        state.items = raw ? mergeCartItems(JSON.parse(raw)) : []
      } catch (error) {
        state.items = []
      }

      state.coupon = null
    },
    setCartItems(state, action) {
      const incomingItems = mergeCartItems(Array.isArray(action.payload) ? action.payload : [])
      const mergedByKey = new Map(state.items.map((item) => {
        const normalized = normalizeCartItem(item)
        return [normalized.key, normalized]
      }))

      incomingItems.forEach((item) => {
        const normalized = normalizeCartItem(item)
        const key = normalized.key
        const existing = mergedByKey.get(key)

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
      const incomingItems = mergeCartItems(Array.isArray(action.payload) ? action.payload : [])
      const previousByKey = new Map(state.items.map((item) => {
        const normalized = normalizeCartItem(item)
        return [normalized.key, normalized]
      }))
      const byKey = new Map()

      incomingItems.forEach((item) => {
        let normalized = normalizeCartItem(item)
        let previous = previousByKey.get(normalized.key)
        const productMatches = Array.from(previousByKey.values()).filter((candidate) =>
          `${getItemId(candidate)}` === `${getItemId(normalized)}` &&
          (!normalized.hasVariantSnapshot || hasSameVariantConfiguration(candidate, normalized)),
        )

        if (!previous && (!normalized.hasVariantSnapshot || !normalized.hasAddonSnapshot)) {
          if (productMatches.length > 1) {
            productMatches.forEach((candidate) => byKey.set(candidate.key, candidate))
            return
          }
          if (productMatches.length === 1) previous = productMatches[0]
        }

        if (previous) {
          normalized.variantId = normalized.hasVariantSnapshot ? normalized.variantId : previous.variantId
          normalized.variantName = normalized.variantName || previous.variantName
          normalized.variantSku = normalized.variantSku || previous.variantSku
          normalized.variantAttributes = {
            ...previous.variantAttributes,
            ...normalized.variantAttributes,
          }
          normalized.selectedVariant = Object.keys(normalized.selectedVariant || {}).length
            ? normalized.selectedVariant
            : previous.selectedVariant
          normalized.selectedSize = normalized.selectedSize || previous.selectedSize
          normalized.selectedFinish = normalized.selectedFinish || previous.selectedFinish
          if (!normalized.hasVariantSnapshot || !normalized.hasAddonSnapshot) {
            normalized.basePrice = previous.basePrice
            normalized.addonTotal = previous.addonTotal
            normalized.price = previous.price
          }
          if (!normalized.hasVariantSnapshot) normalized.hasVariantSnapshot = previous.hasVariantSnapshot
          if (!normalized.hasAddonSnapshot) {
            normalized.addons = previous.addons
            normalized.hasAddonSnapshot = previous.hasAddonSnapshot
          }
          normalized.key = previous.key
          normalized.quantity = Number(item.quantity || item.qty || previous.quantity) || 1
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
      const item = normalizeCartItem(action.payload)
      const key = item.key
      const quantity = Number(item.quantity) || 1
      const stock = item.stock != null ? Number(item.stock) : Infinity
      const existing = state.items.find((cartItem) => cartItem.key === key)

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, stock)
        existing.selectedSize = item.selectedSize || existing.selectedSize
        existing.selectedFinish = item.selectedFinish || existing.selectedFinish
        existing.variantName = item.variantName || existing.variantName
        existing.variantId = item.variantId || existing.variantId
        existing.variantSku = item.variantSku || existing.variantSku
        existing.variantAttributes = { ...existing.variantAttributes, ...item.variantAttributes }
        existing.selectedVariant = item.selectedVariant || existing.selectedVariant
        existing.basePrice = item.basePrice
        existing.addonTotal = item.addonTotal
        existing.price = item.price
        existing.addons = item.addons
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
          variantName: item.variantName || '',
          variantSku: item.variantSku || '',
          variantAttributes: item.variantAttributes,
          selectedVariant: item.selectedVariant,
          basePrice: item.basePrice,
          addonTotal: item.addonTotal,
          price: item.price,
          addons: item.addons,
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

const selectCartGstSummary = createSelector([selectCheckedCartItems], (items) =>
  calculateCartGst(items, ''),
)

const selectCartSubtotal = createSelector([selectCheckedCartItems], (items) =>
  round2(items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0)),
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
  [selectCartSubtotal, selectCartGstSummary, selectCartDiscount, selectShipping],
  (subtotal, gstSummary, discount, shipping) =>
    round2(Math.max(0, subtotal + gstSummary.gstAmount - discount + shipping)),
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
