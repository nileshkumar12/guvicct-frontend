// Reusable GST calculation helpers shared by Cart, Checkout and Order/Invoice views.

export const SELLER_STATE = (import.meta.env.VITE_SELLER_STATE || 'Tamil Nadu').trim()

export const round2 = (value) => Math.round((Number(value) || 0) * 100) / 100

const normalizeState = (state = '') => `${state || ''}`.trim().toLowerCase()

// Unknown customer state defaults to intra-state (CGST + SGST) until shipping address is known.
export const isSameState = (stateA, stateB) => {
  if (!stateA || !stateB) return true
  return normalizeState(stateA) === normalizeState(stateB)
}

/**
 * Calculates the GST breakdown for a single order/cart line item.
 * Taxable Amount = Price x Quantity (or back-calculated when price already includes GST)
 * GST Amount = Taxable Amount x GST Rate / 100
 */
export const calculateItemGst = (
  { price = 0, quantity = 1, gstRate = 0, priceIncludesGST = false } = {},
  customerState = '',
  sellerState = SELLER_STATE,
) => {
  const safePrice = Math.max(0, Number(price) || 0)
  const safeQuantity = Math.max(0, Number(quantity) || 0)
  const safeGstRate = Math.min(100, Math.max(0, Number(gstRate) || 0))
  const grossAmount = round2(safePrice * safeQuantity)

  let taxableAmount
  let gstAmount
  if (priceIncludesGST && safeGstRate > 0) {
    taxableAmount = round2(grossAmount / (1 + safeGstRate / 100))
    gstAmount = round2(grossAmount - taxableAmount)
  } else {
    taxableAmount = grossAmount
    gstAmount = round2(taxableAmount * (safeGstRate / 100))
  }

  const sameState = isSameState(sellerState, customerState)
  const cgstAmount = sameState ? round2(gstAmount / 2) : 0
  const sgstAmount = sameState ? round2(gstAmount - cgstAmount) : 0
  const igstAmount = sameState ? 0 : gstAmount

  return {
    gstRate: safeGstRate,
    taxableAmount,
    gstAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    payableAmount: round2(taxableAmount + gstAmount),
    isInterState: !sameState,
  }
}

/**
 * Calculates a per-item GST breakdown plus aggregated totals for a list of items.
 * Each item can have its own gstRate, so totals are summed per item (not on a blended rate).
 */
export const calculateCartGst = (items = [], customerState = '', sellerState = SELLER_STATE) => {
  const breakdown = items.map((item) => ({
    ...item,
    ...calculateItemGst(
      { price: item.price, quantity: item.quantity, gstRate: item.gstRate, priceIncludesGST: item.priceIncludesGST },
      customerState,
      sellerState,
    ),
  }))

  const totals = breakdown.reduce(
    (acc, item) => ({
      taxableAmount: round2(acc.taxableAmount + item.taxableAmount),
      gstAmount: round2(acc.gstAmount + item.gstAmount),
      cgstAmount: round2(acc.cgstAmount + item.cgstAmount),
      sgstAmount: round2(acc.sgstAmount + item.sgstAmount),
      igstAmount: round2(acc.igstAmount + item.igstAmount),
      payableAmount: round2(acc.payableAmount + item.payableAmount),
    }),
    { taxableAmount: 0, gstAmount: 0, cgstAmount: 0, sgstAmount: 0, igstAmount: 0, payableAmount: 0 },
  )

  return {
    items: breakdown,
    isInterState: breakdown.some((item) => item.isInterState),
    ...totals,
  }
}
