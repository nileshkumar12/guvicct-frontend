import React from 'react'

const OrderNotes = () => {
    return (
        <>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">

                <h2 className="text-xl font-semibold mb-5">
                    📝 Order Notes
                </h2>

                <textarea
                    rows="4"
                    placeholder="Special instructions..."
                    className="w-full border rounded-lg px-4 py-3"></textarea>

            </div>
        </>
    )
}

export default OrderNotes