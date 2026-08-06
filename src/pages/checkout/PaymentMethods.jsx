import React from 'react'
import { useFormContext } from "react-hook-form";
const PaymentMethods = () => {
    const { register, formState: { errors } } = useFormContext();


    return (
        <>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-5">
                    💳 Payment Method
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                   

                    <label className="border rounded-xl p-4 cursor-pointer">
                        <input type="radio" value="razorpay" {...register("paymentMethod", {
                            required: "Select payment method",
                        })} />
                        &nbsp; Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)
                    </label>

                    <label className="border rounded-xl p-4 cursor-pointer">
                        <input type="radio" value="cod" {...register("paymentMethod", {
                            required: "Select payment method",
                        })} />
                         &nbsp; Cash on Delivery
                    </label>
                    {errors.paymentMethod && (
                        <p className='error'>{errors.paymentMethod.message}</p>
                    )}
                </div>

            </div>
        </>
    )
}

export default PaymentMethods