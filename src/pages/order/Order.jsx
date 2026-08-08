import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  selectCartItems,
  selectCheckedCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectShipping,
  selectCartTotal,
  selectCartCoupon,
} from '../../store/cartSlice'

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`

const buildOrderSignature = (items = [], total = 0) => {
  const itemPart = items
    .map((item) => `${item.key || item.id || item._id}:${Number(item.quantity || 0)}`)
    .sort()
    .join('|')

  return `${itemPart}::${Number(total || 0)}`
}

const buildPublicOrderNumber = (items = []) => {
  const now = new Date()
  const datePart = [
    now.getFullYear(),
    `${now.getMonth() + 1}`.padStart(2, '0'),
    `${now.getDate()}`.padStart(2, '0'),
  ].join('')

  const firstKey = `${items[0]?.key || items[0]?.id || items[0]?._id || '000000'}`
  const compactKey = firstKey.replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase() || '000000'

  return `ORD-${datePart}-${compactKey}`
}

const Order = () => {
  const cartItems = useSelector(selectCartItems)
  const items = useSelector(selectCheckedCartItems)
  const subtotal = useSelector(selectCartSubtotal)
  const discount = useSelector(selectCartDiscount)
  const shipping = useSelector(selectShipping)
  const total = useSelector(selectCartTotal)
  const coupon = useSelector(selectCartCoupon)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  
  
  const orderNumber = useMemo(() => {
    if (typeof window === 'undefined' || !items.length) {
      return buildPublicOrderNumber(items)
    }

    const signature = buildOrderSignature(items, total)
    const storageKey = 'latestOrderSummaryId'

    try {
      const raw = window.sessionStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.signature === signature && parsed?.orderNo) {
          return parsed.orderNo
        }
      }
    } catch (error) {
      // ignore invalid cached summary id
    }

    const nextOrderNo = buildPublicOrderNumber(items)

    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify({
        signature,
        orderNo: nextOrderNo,
      }))
    } catch (error) {
      // ignore storage errors
    }

    return nextOrderNo
  }, [items, total])

  if (!cartItems.length) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Order status
          </p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">No order found</h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Your cart is empty right now, so there is nothing to display here yet.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    )
  }

  if (!items.length) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Order status
          </p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">No selected items</h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            You have products in your cart, but none are selected for checkout.
            Please choose items from your cart and continue.
          </p>
          <Link
            to="/cart"
            className="mt-8 inline-flex rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go to cart
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Order confirmed
          </p>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            Thank you for your purchase
          </h1>
          <p className="mt-2 text-gray-500">
            Your order summary is ready and is being pulled directly from the Redux cart state.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Items ordered</h2>
                  <p className="text-sm text-gray-500">{itemCount} item(s) in this order</p>
                </div>
                <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  Order ID: {orderNumber}
                </div>
              </div>
            </div>

            {items.map((item) => (
              <div key={item.key} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: <span className="font-medium text-gray-700">{item.quantity}</span>
                    </p>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                    )}
                    {item.selectedFinish && (
                      <p className="text-sm text-gray-500">Finish: {item.selectedFinish}</p>
                    )}
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">Order summary</h2>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {coupon ? `Coupon applied: ${coupon}` : 'No coupon applied'}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/cart"
                  className="rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Back to cart
                </Link>
                <Link
                  to="/"
                  className="rounded-full bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Order