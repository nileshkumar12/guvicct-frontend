import React from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from "axios";
import { API_URL } from "../../utils/config";
import { useEffect, useState } from 'react';
const SellerOrderDetails = () => {
    const { id: orderId } = useParams();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const userId = JSON.parse(user)._id;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/seller/orders/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrder(response.data.data);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching orders:", error);
                setLoading(false);
            }

        };
        fetchOrders();

    }, []);


    const steps = [
        "Order Placed",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
    ];

    const getStepIndex = (status) => {
        const map = {
            Pending: 0,
            Accepted: 1,
            Packed: 2,
            Shipped: 3,
            "In Transit": 3,
            Delivered: 4,
        };
        return map[status] ?? 0;
    };


    const statusStyles = {
        Pending: "bg-amber-50 text-amber-700 border-amber-200",
        Accepted: "bg-blue-50 text-blue-700 border-blue-200",
        Packed: "bg-purple-50 text-purple-700 border-purple-200",
        Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
        "In Transit": "bg-orange-50 text-orange-700 border-orange-200",
        Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    const OrderById = order?.find((o) => o._id === orderId);
    const OrdersellerById = OrderById?.items?.filter((item) => item.seller === userId);

    console.log("OrderById:", OrderById);
    console.log("OrdersellerById:", OrdersellerById);

    if (!OrderById) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Order not found
                    </h1>
                    <p className="mt-2 text-slate-500">
                        We couldn't find the order you're looking for.
                    </p>
                    <Link
                        to="/admin/sellerorders"
                        className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
                    >
                        Back to Orders
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    to="/admin/sellerorders"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                >
                    <span>←</span>
                    Back to Orders
                </Link>
                <div className="mb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                                Order Details
                            </p>

                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                {OrderById.orderNumber}
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Ordered on {OrderById.createdAt}
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                            Payment: {OrderById.paymentStatus}
                        </span>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="space-y-6">
                        <section
                            key=""
                            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                        >
                            {OrdersellerById && OrdersellerById.length > 0 ? (
                                OrdersellerById.map((seller) => (
                                    <div key={seller._id}>
                                        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    {/* <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                                        Total Amount
                                                    </p> */}

                                                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                                                        {/* {seller.seller} */} Total Amount
                                                    </h2>
                                                </div>

                                                <span
                                                    className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold
                                                    }`}
                                                >
                                                    {/* ${statusStyles[seller.status] */}
                                                    {seller.total.toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        </div>



                                        <div className="divide-y divide-slate-100">

                                            <div
                                                key={seller._id}
                                                className="flex gap-4 p-5 sm:p-6"
                                            >
                                                {seller._id}
                                                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-28">
                                                    <img
                                                        src={seller.product.image}
                                                        alt={seller.product.image}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                                                        {seller.productName}
                                                    </h3>

                                                    <p className="mt-2 text-sm text-slate-500">
                                                        Quantity: {seller.quantity}
                                                    </p>

                                                    <p className="mt-2 text-base font-bold text-slate-900">
                                                        ₹{seller.price.toLocaleString("en-IN")}
                                                    </p>

                                                    <div className="w-full max-w-[12rem] flex-shrink-0 sm:max-w-[16rem]">
                                                    <strong>Payment Details</strong>
                                                    <p className="text-sm font-medium text-slate-900">
                                                    Payment Method: {seller.paymentMethod}
                                                    </p>
                                                    <p className="text-sm font-medium text-slate-900">
                                                    Payment Type: {seller.paymentType}
                                                    </p>
                                                </div>
                                                </div>

                                               

                                            </div>
                                            

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading...</p>
                            )}


                            {/* 
                                    {seller.shipment?.trackingNumber && (
                                        <div className="border-t border-slate-100 p-5 sm:p-6">
                                            <div className="rounded-2xl border border-slate-200 p-4">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-xs text-slate-400">
                                                            Courier
                                                        </p>

                                                        <p className="mt-1 font-semibold text-slate-900">
                                                            {seller.shipment.courier}ffff
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-400">
                                                            Tracking Number
                                                        </p>

                                                        <p className="mt-1 font-semibold text-slate-900">
                                                            {seller.shipment.trackingNumber}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                                                    >
                                                        Track Package
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )} */}
                        </section>


                    </div>


                    {/* <aside className="space-y-6">


                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-base font-bold text-slate-900">
                                Delivery Address
                            </h2>

                            <div className="mt-5 space-y-1 text-sm text-slate-600">
                                <p className="font-semibold text-slate-900">
                                    {order.shippingAddress.name}
                                </p>

                                <p>{order.shippingAddress.address}</p>

                                <p>
                                    {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.state}
                                </p>

                                <p>{order.shippingAddress.pincode}</p>

                                <p className="pt-2">
                                    {order.shippingAddress.phone}
                                </p>
                            </div>
                        </section>


                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-base font-bold text-slate-900">
                                Payment Details
                            </h2>

                            <div className="mt-5 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Payment Method
                                    </span>

                                    <span className="font-medium text-slate-900">
                                        {order.paymentMethod}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Payment Status
                                    </span>

                                    <span className="font-semibold text-emerald-600">
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </section>


                        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-base font-bold text-slate-900">
                                Order Summary
                            </h2>

                            <div className="mt-5 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium">
                                        ₹{order.subtotal.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Shipping
                                    </span>

                                    <span className="font-medium">
                                        ₹{order.shipping.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-slate-500">
                                        Discount
                                    </span>

                                    <span className="font-medium text-emerald-600">
                                        -₹{order.discount.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <div className="my-4 h-px bg-slate-100" />

                                <div className="flex justify-between">
                                    <span className="font-bold text-slate-900">
                                        Total
                                    </span>

                                    <span className="text-lg font-bold text-slate-900">
                                        ₹{order.total.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </aside> */}
                </div>
            </div>
        </main>
    );
}

export default SellerOrderDetails