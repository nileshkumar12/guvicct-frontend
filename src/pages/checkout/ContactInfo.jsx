import React from 'react'
import { useFormContext } from "react-hook-form";
const ContactInfo = () => {
    const { register, formState: { errors }, } = useFormContext();



    return (

        <>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-5">
                    📧 Contact Information
                </h2>

                <div className="grid md:grid-cols-2 gap-5">
                    <div className='form-group'>
                    <input type="email" placeholder="Email Address"
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-red"   {...register("email", {
                            required: "Email is required",
                        })} />
                    {errors.email && (
                        <span className='error'>{errors.email.message}</span>
                    )}
                    </div>
                    <div>
                    <input type="tel"  max={12} placeholder="Mobile Number"
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-black"   {...register("mobile", {
                            required: "Mobile is required",
                        })} />
                    {errors.mobile && (
                        <p className='error' >{errors.mobile.message}</p>
                    )}
                    </div>
                </div>
            </div>


        </>

    )
}

export default ContactInfo