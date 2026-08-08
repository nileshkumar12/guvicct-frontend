import React, { useEffect, useState } from "react";
import {
    Bell,
    Check,
    CheckCheck,
    ShoppingBag,
    Truck,
    XCircle,
    CreditCard,
    Clock,
} from "lucide-react";
import { API_URL } from "../utils/config";

const SellerNotifications = () => {
    const [notifications, setNotifications] = useState([]);
      const token = localStorage.getItem("token");
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
              
                const url = `${API_URL}/api/seller/notifications`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
                );

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to fetch notifications"
                    );
                }

                if (result.success) {
                    setNotifications(result.notifications || []
                    );
                }

            } catch (error) {
                console.error(
                    "❌ Failed to fetch notifications:",
                    error
                );
            }
        };
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter(
        (item) => !item.isRead
    ).length;

    const getIcon = (type) => {
        switch (type) {
            case "NEW_ORDER":
                return <ShoppingBag size={22} />;

            case "PAYMENT_SUCCESS":
                return <CreditCard size={22} />;

            case "SHIPMENT_CREATED":
                return <Truck size={22} />;

            case "ORDER_CANCELLED":
                return <XCircle size={22} />;

            default:
                return <Bell size={22} />;
        }
    };

    const markAsRead = async (id) => {
         try {
            
                const url = `${API_URL}/api/seller/notifications/${id}/read`;
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({ id }),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to fetch notifications"
                    );
                }

                if (result.success) {
                     setNotifications((prev) =>
            prev.map((notification) =>
                notification._id === id ? { ...notification,    isRead: true,} : notification
            )
        );
                }

            } catch (error) {
                console.error(
                    "❌ Failed to mark as read notifications:",
                    error
                );
            }
      
    };

    const markAllAsRead = async () => {
        try {
            
                const url = `${API_URL}/api/seller/notifications/read-all`;
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({}),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(
                        result.message || "Failed to fetch notifications"
                    );
                }

                if (result.success) {
                     setNotifications((prev) =>
            prev.map((notification) => ({  ...notification, isRead: true, }))
        );
                }

            } catch (error) {
                console.error(
                    "❌ Failed to mark as read notifications:",
                    error
                );
            }
       
    };
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">

            {/* Header */}
            <div className="">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center">
                                <Bell size={22} />
                            </div>

                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Notifications
                                </h1>

                                <p className="text-sm text-gray-500 mt-1">
                                    Stay updated with your orders and store activity
                                </p>
                            </div>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                        >
                            <CheckCheck size={17} />
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            Total Notifications
                        </p>

                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {notifications.length}
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            Unread
                        </p>

                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {unreadCount}
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            New Orders
                        </p>

                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {
                                notifications.filter(
                                    (item) => item.type === "NEW_ORDER"
                                ).length
                            }
                        </p>
                    </div>

                </div>

                {/* Notification List */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                    <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">
                            Recent Notifications
                        </h2>

                        {unreadCount > 0 && (
                            <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                {unreadCount} unread
                            </span>
                        )}
                    </div>

                    {notifications.length === 0 ? (
            
                        <div className="py-20 text-center">

                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <Bell size={28} />
                            </div>

                            <h3 className="mt-4 font-semibold text-gray-900">
                                No notifications
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                You're all caught up.
                            </p>

                        </div>

                    ) : (

                        <div>
                            {notifications.map((notification) => (

                                <div
                                    key={notification._id}
                                    className={`relative p-5 border-b border-gray-100 last:border-b-0 transition hover:bg-gray-50 ${!notification.isRead
                                            ? "bg-blue-50/40"
                                            : "bg-white"
                                        }`}
                                >

                                    <div className="flex gap-4">

                                        {/* Icon */}
                                        <div
                                            className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${!notification.isRead
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-gray-100 text-gray-500"
                                                }`}
                                        >
                                            {getIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">

                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                                                <div>
                                                    <div className="flex items-center gap-2">

                                                        <h3 className="font-semibold text-gray-900">
                                                            {notification.title}
                                                        </h3>

                                                        {!notification.isRead && (
                                                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                                                        )}

                                                    </div>

                                                    <p className="text-sm text-gray-600 mt-1 leading-6">
                                                        {notification.message}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                                                    <Clock size={13} />
                                                    {notification.createdAt}
                                                </div>

                                            </div>

                                            {/* Order + Action */}
                                            <div className="flex flex-wrap items-center gap-3 mt-4">

                                                {notification.orderNumber && (
                                                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                                                        {notification.orderNumber}
                                                    </span>
                                                )}

                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() =>
                                                            markAsRead(notification._id)
                                                        }
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black transition"
                                                    >
                                                        <Check size={15} />
                                                        Mark as read
                                                    </button>
                                                )}

                                            </div>

                                        </div>
                                    </div>

                                </div>

                            ))}
                        </div>

                    )}

                </div>

            </div>
        </div>
    );
};

export default SellerNotifications;