import React from 'react'

const PaymentMethods = () => {
    return (
        <>
            <div class="container mx-auto px-4 mt-10">

                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800">Payment Methods</h1>
                        <p class="text-gray-500 mt-1">Manage your saved payment methods.</p>
                    </div>

                    <button class="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition">
                        + Add New Card
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    <label
                        class="block bg-white border rounded-xl p-6 mb-5 cursor-pointer hover:border-black transition">

                        <div class="flex flex-col md:flex-row md:items-center md:justify-between">


                            <div class="flex items-start gap-4">


                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    checked
                                    class="mt-2 h-5 w-5 accent-black" />


                                <div class="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center text-3xl">
                                    💳
                                </div>


                                <div>

                                    <div class="flex items-center gap-3">
                                        <h3 class="text-lg font-semibold">
                                            Visa ending in 4567
                                        </h3>

                                        <span
                                            class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            Default
                                        </span>
                                    </div>

                                    <p class="text-gray-500 mt-1">
                                        John Smith
                                    </p>

                                    <p class="text-gray-500">
                                        Expires 08/28
                                    </p>

                                </div>

                            </div>


                            <div class="flex gap-3 mt-6 md:mt-0">

                                <button
                                    class="px-4 py-2 rounded-lg border hover:bg-gray-100">
                                    View
                                </button>

                                <button
                                    class="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600">
                                    Edit
                                </button>

                                <button
                                    class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
                                    Delete
                                </button>

                            </div>

                        </div>

                    </label>
                </div>

                <div style={{display:"none"}} >
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-gray-800">
                            Edit Payment Method
                        </h1>
                        <p class="text-gray-500 mt-2">
                            Update your saved payment details.
                        </p>
                    </div>


                    <form class="bg-white rounded-xl shadow-md p-8 space-y-6">


                        <div>
                            <label class="block mb-2 font-medium text-gray-700">
                                Card Holder Name
                            </label>
                            <input
                                type="text"
                                value="John Smith"
                                class="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                placeholder="Enter card holder name" />
                        </div>


                        <div>
                            <label class="block mb-2 font-medium text-gray-700">
                                Card Number
                            </label>
                            <input
                                type="text"
                                value="4111 1111 1111 4567"
                                class="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none"
                                placeholder="1234 5678 9012 3456" />
                        </div>


                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label class="block mb-2 font-medium text-gray-700">
                                    Expiry Date
                                </label>
                                <input
                                    type="month"
                                    value="2028-08"
                                    class="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none" />
                            </div>

                            <div>
                                <label class="block mb-2 font-medium text-gray-700">
                                    CVV
                                </label>
                                <input
                                    type="password"
                                    value="123"
                                    maxlength="4"
                                    class="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none" />
                            </div>

                        </div>


                        <div>
                            <label class="block mb-2 font-medium text-gray-700">
                                Card Type
                            </label>

                            <select class="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-black outline-none">
                                <option>Visa</option>
                                <option selected>Mastercard</option>
                                <option>RuPay</option>
                                <option>American Express</option>
                            </select>
                        </div>


                        <div class="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked
                                class="h-5 w-5 accent-black" />

                            <label class="text-gray-700">
                                Set as Default Payment Method
                            </label>
                        </div>


                        <div class="flex justify-end gap-4 pt-4">

                            <button
                                type="button"
                                class="px-6 py-3 border rounded-lg hover:bg-gray-100">
                                Cancel
                            </button>

                            <button
                                type="submit"
                                class="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
                                Save Changes
                            </button>

                        </div>

                    </form>
                </div>

            </div>
        </>
    )
}

export default PaymentMethods