import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL, API_URLS } from "../../utils/config";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const decodeJwtPayload = (token) => {
    if (!token) return null;

    try {
        const payloadPart = `${token}`.split(".")[1];
        if (!payloadPart) return null;
        const normalizedPayload = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(normalizedPayload));
    } catch (error) {
        return null;
    }
};

const getStoredSellerId = () => {
    try {
        const rawUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        const tokenPayload = decodeJwtPayload(token);

        const parsedUser = rawUser ? JSON.parse(rawUser) : null;
        const userCandidates = [parsedUser, parsedUser?.user, parsedUser?.userData, parsedUser?.data, parsedUser?.data?.user, parsedUser?.seller, parsedUser?.sellerData].filter(Boolean);

        const collectCandidateIds = (value) => {
            if (!value || typeof value !== "object") return [];

            return [
                value?._id,
                value?.id,
                value?.sellerId,
                value?.seller_id,
                value?.userId,
                value?.userID,
                value?.ownerId,
                value?.owner_id,
                value?.user?._id,
                value?.user?.id,
                value?.user?.sellerId,
                value?.user?.seller_id,
                value?.seller?._id,
                value?.seller?.id,
                value?.seller?.sellerId,
                value?.seller?.seller_id,
            ].filter(Boolean).map((candidate) => `${candidate}`.trim());
        };

        const ids = userCandidates.flatMap(collectCandidateIds);
        const tokenIds = [tokenPayload?._id, tokenPayload?.id, tokenPayload?.sellerId, tokenPayload?.seller_id, tokenPayload?.userId, tokenPayload?.userID, tokenPayload?.sub].filter(Boolean).map((candidate) => `${candidate}`.trim());

        return [...new Set([...ids, ...tokenIds])][0] || "";
    } catch (error) {
        return "";
    }
};

const getNestedId = (value) => {
    if (!value) return "";
    if (typeof value === "string" || typeof value === "number") return `${value}`;
    if (typeof value === "object") return `${value._id || value.id || value.sellerId || value.seller_id || ""}`;
    return "";
};

const isSellerMatch = (value, sellerId) => {
    if (!sellerId) return true;
    const normalizedSellerId = `${sellerId}`.trim();
    if (!normalizedSellerId) return true;

    const candidate = getNestedId(value);
    if (!candidate) return false;
    return candidate === normalizedSellerId;
};

const getSellerMatchValue = (item, sellerId) => {
    const candidates = [
        item?.seller,
        item?.sellerId,
        item?.seller_id,
        item?.owner,
        item?.ownerId,
        item?.owner_id,
        item?.user,
        item?.userId,
        item?.user_id,
        item?.product?.seller,
        item?.product?.sellerId,
        item?.product?.seller_id,
        item?.product?.owner,
        item?.product?.ownerId,
        item?.productId?.seller,
        item?.productId?.sellerId,
        item?.productId?.seller_id,
        item?.productId?.owner,
        item?.productId?.ownerId,
    ];

    return candidates.find((value) => isSellerMatch(value, sellerId));
};

const getOrderStatusLabel = (status) => {
    if (!status) return "Processing";
    const normalized = `${status}`.trim().toLowerCase();

    if (normalized.includes("delivered")) return "Delivered";
    if (normalized.includes("shipped")) return "Shipped";
    if (normalized.includes("pending")) return "Pending";
    if (normalized.includes("processing")) return "Processing";
    if (normalized.includes("cancel")) return "Cancelled";
    return status;
};

const SellerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const sellerId = useMemo(() => getStoredSellerId(), []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const baseUrl = API_URLS || API_URL || "";
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                };

                const buildSellerEndpoints = (path) => {
                    const baseEndpoint = `${baseUrl}${path}`;
                    if (!sellerId) return [baseEndpoint];

                    const queryVariants = [
                        `seller=${encodeURIComponent(sellerId)}`,
                        `sellerId=${encodeURIComponent(sellerId)}`,
                        `user=${encodeURIComponent(sellerId)}`,
                        `userId=${encodeURIComponent(sellerId)}`,
                        `owner=${encodeURIComponent(sellerId)}`,
                        `ownerId=${encodeURIComponent(sellerId)}`,
                    ];

                    return [...new Set([baseEndpoint, ...queryVariants.map((query) => `${baseEndpoint}?${query}`)])];
                };

                const fetchJsonWithFallback = async (endpoints) => {
                    let lastError = null;

                    for (const endpoint of endpoints) {
                        try {
                            const response = await fetch(endpoint, { headers, credentials: "include" });
                            if (!response.ok) {
                                throw new Error(`Request failed with ${response.status}`);
                            }

                            return await response.json();
                        } catch (error) {
                            lastError = error;
                        }
                    }

                    throw lastError || new Error("Request failed");
                };

                const productEndpoints = buildSellerEndpoints("/api/products");
                const orderEndpoints = buildSellerEndpoints("/api/orders");

                const productsData = await fetchJsonWithFallback(productEndpoints);
                const ordersData = await fetchJsonWithFallback(orderEndpoints);

                const allProducts = Array.isArray(productsData)
                    ? productsData
                    : productsData.products || productsData.data || productsData.result || [];
                const allOrders = Array.isArray(ordersData)
                    ? ordersData
                    : ordersData.orders || ordersData.data || ordersData.result || [];

                const filteredProducts = sellerId
                    ? allProducts.filter((product) => {
                        const sellerValue = getNestedId(product?.seller);
                        if (sellerValue && sellerValue === sellerId) return true;

                        const fallbackSeller = getSellerMatchValue(product, sellerId);
                        return Boolean(fallbackSeller);
                    })
                    : allProducts;

                const filteredOrders = sellerId
                    ? allOrders.filter((order) => {
                        const orderSellerValue = getNestedId(order?.seller) || getNestedId(order?.sellerId) || getNestedId(order?.seller_id);
                        if (orderSellerValue && orderSellerValue === sellerId) {
                            return true;
                        }

                        const orderUserValue = getNestedId(order?.user) || getNestedId(order?.userId) || getNestedId(order?.user_id);
                        if (orderUserValue && orderUserValue === sellerId) {
                            return true;
                        }

                        const items = order?.items || order?.products || order?.cartItems || [];
                        return Array.isArray(items)
                            ? items.some((item) => getSellerMatchValue(item, sellerId))
                            : false;
                    })
                    : allOrders;

                setProducts(sellerId && filteredProducts.length === 0 && allProducts.length > 0 ? allProducts : filteredProducts);
                setOrders(sellerId && filteredOrders.length === 0 && allOrders.length > 0 ? allOrders : filteredOrders);
            } catch (fetchError) {
                setError(fetchError.message || "Unable to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();



    }, [sellerId]);

    const stats = useMemo(() => {
        const totalSales = orders.reduce((sum, order) => {
            const orderTotal = Number(
                order?.total ||
                order?.grandTotal ||
                order?.payableAmount ||
                order?.amount ||
                order?.totalAmount ||
                order?.orderAmount ||
                order?.price ||
                0
            );

            if (orderTotal) {
                return sum + orderTotal;
            }

            const items = order?.items || order?.products || order?.cartItems || [];
            const itemsTotal = Array.isArray(items)
                ? items.reduce((itemSum, item) => {
                    const price = Number(item?.price || item?.productPrice || item?.unitPrice || item?.amount || item?.total || 0);
                    const quantity = Number(item?.quantity || item?.qty || item?.count || 1);
                    return itemSum + price * quantity;
                }, 0)
                : 0;

            return sum + itemsTotal;
        }, 0);
  
        const totalOrders = orders.length;

        const pendingOrders = orders.filter((order) => {
            const status = `${order?.status || order?.orderStatus || ""}`.trim().toLowerCase();
            return status.includes("pending") || status.includes("processing") || status.includes("confirmed");
        }).length;
        const productCount = products.length;

        return [
            {
                title: "Total Sales",
                value: formatCurrency(totalSales),
                change: `${totalOrders} orders tracked`,
                icon: "💰",
                bg: "bg-green-100",
                color: "text-green-600",
            },
            {
                title: "Total Orders",
                value: `${totalOrders}`,
                change: `${pendingOrders} pending`,
                icon: "📦",
                bg: "bg-blue-100",
                color: "text-blue-600",
            },
            {
                title: "Products",
                value: `${productCount}`,
                change: `${products.filter((product) => Number(product?.stock || 0) <= 3).length} low stock`,
                icon: "🛍️",
                bg: "bg-purple-100",
                color: "text-purple-600",
            },
            {
                title: "Pending Orders",
                value: `${pendingOrders}`,
                change: "Needs attention",
                icon: "⏳",
                bg: "bg-yellow-100",
                color: "text-yellow-600",
            },
        ];
    }, [orders, products]);

    const recentOrders = useMemo(() => {
        return orders
            .slice(0, 5)
            .map((order, index) => ({
                id: order?.orderNo || order?.orderNumber || `ORD-${index + 1}`,
                customer: order?.shippingAddress?.fullName || order?.customer?.name || order?.user?.name || "Customer",
                amount: formatCurrency(order?.total || order?.grandTotal || 0),
                status: getOrderStatusLabel(order?.status || order?.orderStatus || "Processing"),
            }));
    }, [orders]);

    const lowStockProducts = useMemo(() => {
        const sortedProducts = [...products].sort((a, b) => Number(a?.stock || 0) - Number(b?.stock || 0));
        return sortedProducts.slice(0, 4).map((product) => ({
            name: product?.name || product?.title || "Unnamed Product",
            stock: Number(product?.stock || 0),
            sold: Number(product?.sold || product?.soldCount || product?.sales || 0),
        }));
    }, [products]);

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

                    <Link to="/admin/products/add"
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

                {error ? (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                {loading ? (
                    <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                        Loading dashboard data...
                    </div>
                ) : null}

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

                            <Link to="/admin/products/add" className="w-full flex items-center gap-3 border rounded-lg p-4 hover:bg-gray-50 text-left">

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


                            <Link to="/admin/shipment" className="w-full flex items-center gap-3 border rounded-lg p-4 hover:bg-gray-50 text-left">

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
                                {lowStockProducts.length} items
                            </span>

                        </div>


                        <div className="p-5 space-y-4">

                            {lowStockProducts.length > 0 ? (
                                lowStockProducts.map((product, index) => (
                                    <div
                                        key={`${product.name}-${index}`}
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
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No low stock products found.</p>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default SellerDashboard;