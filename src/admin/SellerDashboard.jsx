import React from "react";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
    const stats = [
        {
            title: "Total Sales",
            value: "₹1,24,500",
            change: "+12.5%",
            icon: "💰",
            bg: "bg-green-100",
            color: "text-green-600",
        },
        {
            title: "Total Orders",
            value: "248",
            change: "+8.2%",
            icon: "📦",
            bg: "bg-blue-100",
            color: "text-blue-600",
        },
        {
            title: "Products",
            value: "86",
            change: "+4",
            icon: "🛍️",
            bg: "bg-purple-100",
            color: "text-purple-600",
        },
        {
            title: "Pending Orders",
            value: "18",
            change: "Need action",
            icon: "⏳",
            bg: "bg-yellow-100",
            color: "text-yellow-600",
        },
    ];

    const recentOrders = [
        {
            id: "ORD-1001",
            customer: "Nilesh Kumar",
            amount: "₹2,499",
            status: "Delivered",
        },
        {
            id: "ORD-1002",
            customer: "Rahul Sharma",
            amount: "₹1,799",
            status: "Shipped",
        },
        {
            id: "ORD-1003",
            customer: "Amit Kumar",
            amount: "₹3,299",
            status: "Pending",
        },
        {
            id: "ORD-1004",
            customer: "Rohit Singh",
            amount: "₹999",
            status: "Processing",
        },
        {
            id: "ORD-1005",
            customer: "Priya Sharma",
            amount: "₹4,499",
            status: "Delivered",
        },
    ];

    const products = [
        {
            name: "Premium T-Shirt",
            stock: 5,
            sold: 42,
        },
        {
            name: "Running Shoes",
            stock: 3,
            sold: 31,
        },
        {
            name: "Leather Wallet",
            stock: 8,
            sold: 27,
        },
        {
            name: "Smart Watch",
            stock: 2,
            sold: 19,
        },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-700";

            case "Shipped":
                return "bg-blue-100 text-blue-700";

            case "Pending":
                return "bg-yellow-100 text-yellow-700";

            case "Processing":
                return "bg-purple-100 text-purple-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">

            <div className="max-w-7xl mx-auto">

                {/* ================= HEADER ================= */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Seller Dashboard
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Welcome back! Here's what's happening with your store.
                        </p>
                    </div>

                    <Link to="/admin/addproduct"
                        className="
              bg-red-500
              hover:bg-red-600
              text-white
              font-semibold
              px-5
              py-3
              rounded-lg
            "
                    >
                        + Add Product
                    </Link>

                </div>


                {/* ================= STAT CARDS ================= */}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                    {stats.map((stat, index) => (

                        <div
                            key={index}
                            className="bg-white border rounded-xl p-5"
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        {stat.title}
                                    </p>

                                    <h2 className="text-2xl font-bold text-gray-900 mt-2">
                                        {stat.value}
                                    </h2>

                                    <p className={`text-xs mt-2 ${stat.color}`}>
                                        {stat.change}
                                    </p>

                                </div>

                                <div
                                    className={`
                    w-11
                    h-11
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    text-xl
                    ${stat.bg}
                  `}
                                >
                                    {stat.icon}
                                </div>

                            </div>

                        </div>

                    ))}

                </div>


                {/* ================= MAIN GRID ================= */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* SALES OVERVIEW */}

                    <div className="lg:col-span-2 bg-white border rounded-xl">

                        <div className="flex items-center justify-between px-5 py-4 border-b">

                            <div>
                                <h2 className="font-bold text-gray-900">
                                    Sales Overview
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Your sales performance
                                </p>
                            </div>

                            <select
                                className="
                  border
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  outline-none
                "
                            >
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>

                        </div>


                        {/* SIMPLE CHART */}

                        <div className="p-5">

                            <div className="h-64 flex items-end gap-3 md:gap-6">

                                {[40, 65, 50, 80, 55, 90, 75].map(
                                    (height, index) => (

                                        <div
                                            key={index}
                                            className="flex-1 flex flex-col items-center gap-2"
                                        >

                                            <div
                                                className="
                          w-full
                          bg-red-500
                          hover:bg-red-600
                          rounded-t-lg
                          transition
                        "
                                                style={{
                                                    height: `${height}%`,
                                                }}
                                            />

                                            <span className="text-xs text-gray-400">
                                                {
                                                    [
                                                        "Mon",
                                                        "Tue",
                                                        "Wed",
                                                        "Thu",
                                                        "Fri",
                                                        "Sat",
                                                        "Sun",
                                                    ][index]
                                                }
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>


                    {/* QUICK ACTIONS */}

                    <div className="bg-white border rounded-xl">

                        <div className="px-5 py-4 border-b">

                            <h2 className="font-bold text-gray-900">
                                Quick Actions
                            </h2>

                        </div>


                        <div className="p-5 space-y-3">

                            <Link to="/admin/addproduct" className="w-full flex items-center gap-3 border rounded-lg p-4 hover:bg-gray-50 text-left">

                                <span className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    ➕
                                </span>

                                <div>
                                    <p className="font-semibold">
                                        Add Product
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Create a new product
                                    </p>
                                </div>

                            </Link>


                            <button className="w-full flex items-center gap-3 border rounded-lg p-4 hover:bg-gray-50 text-left">

                                <span className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                    📦
                                </span>

                                <div>
                                    <p className="font-semibold">
                                        Manage Orders
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        View pending orders
                                    </p>
                                </div>

                            </button>


                            <Link to="/admin/shipments" className="w-full flex items-center gap-3 border rounded-lg p-4 hover:bg-gray-50 text-left">

                                <span className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    🚚
                                </span>

                                <div>
                                    <p className="font-semibold">
                                        Shipments
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Manage shipments
                                    </p>
                                </div>

                            </Link>


                            <Link to="/admin/notifications" className="w-full flex items-center gap-3 border rounded-lg p-4 hover:bg-gray-50 text-left">

                                <span className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    🔔
                                </span>

                                <div>
                                    <p className="font-semibold">
                                        Notifications
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Check notifications
                                    </p>
                                </div>

                            </Link>

                        </div>

                    </div>

                </div>


                {/* ================= BOTTOM GRID ================= */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">


                    {/* RECENT ORDERS */}

                    <div className="lg:col-span-2 bg-white border rounded-xl">

                        <div className="flex items-center justify-between px-5 py-4 border-b">

                            <h2 className="font-bold text-gray-900">
                                Recent Orders
                            </h2>

                            <button className="text-red-500 text-sm font-semibold">
                                View All
                            </button>

                        </div>


                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[650px]">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="text-left px-5 py-3 text-xs text-gray-500">
                                            ORDER
                                        </th>

                                        <th className="text-left px-5 py-3 text-xs text-gray-500">
                                            CUSTOMER
                                        </th>

                                        <th className="text-left px-5 py-3 text-xs text-gray-500">
                                            AMOUNT
                                        </th>

                                        <th className="text-left px-5 py-3 text-xs text-gray-500">
                                            STATUS
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {recentOrders.map((order) => (

                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4">

                                                <p className="font-semibold text-gray-900">
                                                    #{order.id}
                                                </p>

                                            </td>


                                            <td className="px-5 py-4 text-gray-700">
                                                {order.customer}
                                            </td>


                                            <td className="px-5 py-4 font-semibold">
                                                {order.amount}
                                            </td>


                                            <td className="px-5 py-4">

                                                <span
                                                    className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold
                            ${getStatusClass(
                                                        order.status
                                                    )}
                          `}
                                                >
                                                    {order.status}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* LOW STOCK */}

                    <div className="bg-white border rounded-xl">

                        <div className="flex items-center justify-between px-5 py-4 border-b">

                            <h2 className="font-bold text-gray-900">
                                Low Stock
                            </h2>

                            <span className="text-red-500 text-sm">
                                {products.length} items
                            </span>

                        </div>


                        <div className="p-5 space-y-4">

                            {products.map((product, index) => (

                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >

                                    <div>

                                        <p className="font-semibold text-gray-900">
                                            {product.name}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {product.sold} sold
                                        </p>

                                    </div>


                                    <span className="text-sm font-semibold text-red-500">
                                        {product.stock} left
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default SellerDashboard;