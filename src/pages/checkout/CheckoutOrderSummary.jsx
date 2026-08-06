import React from 'react'
import { useSelector } from "react-redux";
import {
    selectCheckedCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectShipping,
  selectCartTotal,
  selectCartCoupon,
} from "../../store/cartSlice";

const CheckoutOrderSummary = ({ hasSelectedItems, isSubmitting }) => {

            const items = useSelector(selectCheckedCartItems);
      const subtotal = useSelector(selectCartSubtotal);
      const discount = useSelector(selectCartDiscount);
      const shipping = useSelector(selectShipping);
      const total = useSelector(selectCartTotal);
      const coupon = useSelector(selectCartCoupon);
    
    return (
        <>
            <div className="lg:col-span-4">

                <div className="sticky top-24 rounded-2xl bg-white border border-gray-200 shadow-sm p-6">

                    <h2 className="text-2xl font-bold mb-6">
                        Order Summary
                    </h2>

                    {/* Products */}

                    <div className="space-y-5">
                        {items.map(({ key, title, quantity, price })=>(
                                <div className="flex justify-between" key={key}>
                                <span>{title} × {quantity}</span>
                                <span>₹ {price*quantity}</span>
                                </div>

                        ))}

                       
                        

                        

                    </div>

                    <hr className="my-6" />



                    {/* Price */}

                    <div className="space-y-3">

                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹ {subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span>-₹ {discount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-green-600">₹ {shipping}</span>
                        </div>

                        

                        <div className="flex justify-between font-bold text-xl border-t pt-4">
                            <span>Grand Total</span>
                            <span>₹{total}</span>
                        </div>

                    </div>

                    {/* Button */}

                    <button
                        type="submit"
                        className="w-full mt-8 rounded-full bg-black text-white py-4 text-lg font-semibold hover:bg-gray-800 transition disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={!hasSelectedItems || isSubmitting}>

                        {isSubmitting ? 'Placing Order...' : 'Place Order'}

                    </button>



                    <div className="mt-8 space-y-3 text-sm text-gray-600">

                        <div>🔒 100% Secure Payment</div>

                        <div>🚚 Free Shipping</div>

                        <div>↩️ Easy Returns</div>

                        <div>✅ Quality Guaranteed</div>

                    </div>

                </div>

            </div>

        </>
    )
}

export default CheckoutOrderSummary