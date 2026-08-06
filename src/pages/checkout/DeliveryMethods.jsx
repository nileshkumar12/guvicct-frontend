import React from 'react'
import { useFormContext } from "react-hook-form";

const DeliveryMethods = () => {
    const { register, formState: { errors } } = useFormContext();

  return (
    <>
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                                    <h2 className="text-xl font-semibold mb-5">
                                        🚚 Delivery Method
                                    </h2>

                                    <div className="space-y-4">

                                        <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer">
                                            <div>
                                                <p className="font-semibold">Standard Delivery</p>
                                                <span className="text-sm text-gray-500">3-5 Business Days</span>
                                            </div>

                                            <input type="radio" value="standard" {...register("deliveryMethod", {
                                                required: "Select delivery method",
                                            })} />
                                        </label>

                                        <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer">
                                            <div>
                                                <p className="font-semibold">Express Delivery</p>
                                                <span className="text-sm text-gray-500">1-2 Business Days</span>
                                            </div>

                                            <input type="radio" value="express" {...register("deliveryMethod", {
                                                required: "Select delivery method",
                                            })} />
                                        </label>

                                        {errors.deliveryMethod && (
                                            <p className='error'>{errors.deliveryMethod.message}</p>
                                        )}

                                    </div>

                                </div>
    </>
  )
}

export default DeliveryMethods