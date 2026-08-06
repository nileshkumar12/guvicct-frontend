import React from 'react'
import { useFormContext } from "react-hook-form";

const ShippingAddress = () => {
    const { register, formState: { errors } } = useFormContext();


    return (
        <>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-5">
                    📍 Shipping Address
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                    <div className='form-group'>
                        <input type="text" placeholder="First Name"
                            className="border w-full rounded-lg px-4 py-3"  {...register("firstName", {
                                required: "First name is required",
                            })} />
                        {errors.firstName && (
                            <span className='error'>{errors.firstName.message}</span>
                        )}
                    </div>

                    <div className='form-group'>
                        <input type="text" placeholder="Last Name"
                            className="border w-full rounded-lg px-4 py-3"
                            {...register("lastName", {
                                required: "First name is required",
                            })} />
                        {errors.lastName && (
                            <span className='error'>{errors.lastName.message}</span>
                        )}
                    </div>

                         <div>
                        <input type="text" placeholder="Address Line 1"
                            className="md:col-span-2 w-full border rounded-lg px-4 py-3"   {...register("address1", {
                                required: "Address 1 is required",
                            })} />
                        {errors.address1 && (
                            <span className='error'>{errors.address1.message}</span>
                        )}
                    </div>
                        <div>
                        <input type="text" placeholder="Address Line 2"
                            className="md:col-span-2 w-full border rounded-lg px-4 py-3"   {...register("address2", {
                                required: "Address 2 is required",
                            })} />
                        {errors.address2 && (
                            <span className='error'>{errors.address2.message}</span>
                        )}
                        </div>
                    

                    <div>
                        <input type="text" placeholder="City"
                            className="border w-full rounded-lg px-4 py-3"   {...register("city", {
                                required: "City is required",
                            })} />
                        {errors.city && (
                            <span className='error'>{errors.city.message}</span>
                        )}
                    </div>

                    <div>

                        <input type="text" placeholder="State"
                            className="border w-full rounded-lg px-4 py-3" {...register("state", {
                                required: "State is required",
                            })} />
                        {errors.state && (
                            <span className='error'>{errors.state.message}</span>
                        )}
                    </div>

                    <div>
                        <input type="text" placeholder="Country"
                            className="border w-full rounded-lg px-4 py-3" {...register("country", {
                                required: "Country is required",
                            })} />
                        {errors.country && (
                            <span className='error'>{errors.country.message}</span>
                        )}
                    </div>

                    <div>
                        <input type="text" placeholder="PIN Code"
                            className="border w-full rounded-lg px-4 py-3"  {...register("pincode", {
                                required: "PIN Code is required",
                            })} />
                        {errors.pincode && (
                            <span className='error'>{errors.pincode.message}</span>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}

export default ShippingAddress