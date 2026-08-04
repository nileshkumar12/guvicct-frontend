import { Link } from "react-router-dom"

const OrderSummary = ({ subtotal, discount, shipping, total, coupon, onClearCart, hasItems }) => {
    return (
        <div className="rounded-[10px] border border-[#e9e2d9] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1c1c1c]">Order summary</h2>
            <div className="mt-6 space-y-4 text-sm text-[#5d4e3f]">
                <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span>−₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#e9e2d9] pt-4 flex items-center justify-between text-xl font-semibold text-[#1c1c1c]">
                    <span>Grand Total</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
            </div>

            <button
                type="button"
                className="mt-3 block text-center  w-full rounded-full bg-[#1aa184] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#168864] disabled:cursor-not-allowed disabled:bg-[#cbd5d1] disabled:bg-[#cbd5d1]"
                disabled={!hasItems}
            >
                Proceed to Checkout
            </button>
 <Link
                to="/"
                className="mt-3 block w-full text-sm text-center rounded-full border  rounded-full bg-[#b68a3b] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#b68a3b]"
            >
               Continue Shopping
            </Link>
            <button
                type="button"
                onClick={onClearCart}
                className="mt-3 w-full rounded-full border border-[#e9e2d9] bg-white px-6 py-4 text-sm font-semibold text-[#5d4e3f] transition hover:bg-[#f4f4f1] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!hasItems}
            >
                Clear Cart
            </button>
           
           

            {coupon && (
                <p className="mt-4 rounded-2xl bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]">
                    Applied coupon: <strong>{coupon}</strong>
                </p>
            )}
        </div>
    )
}

export default OrderSummary
