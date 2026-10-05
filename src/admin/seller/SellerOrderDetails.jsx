import React from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from "axios";
import { API_URL } from "../../utils/config";
import { useEffect, useState } from 'react';
import  Loader  from '../../components/Loader.jsx';
import {
    ArrowLeft,
    ChevronDown,
    ChevronRight,
    Check,
    Printer,
    Download,
    MoreHorizontal,
    Package,
    Truck,
    CreditCard,
    User,
    Clock3,
    FileText,
    MapPin,
    Pencil,
    Eye,
    RotateCcw,
    Star,
    Phone,
    Mail,
    ExternalLink,
    Plus,
    X,
    CheckCircle2,
    AlertCircle,
    Store,
    MessageSquare,
    CalendarDays,
    Hash,
} from "lucide-react";


const formatPrice = (value) =>
    `₹${value.toLocaleString("en-IN")}`;




function Card({ children, className = "" }) {
    return (
        <div
            className={`rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] ${className}`}
        >
            {children}
        </div>
    );
}

function SectionHeader({
    icon: Icon,
    title,
    action,
    actionIcon: ActionIcon,
}) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
                {Icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Icon size={16} />
                    </div>
                )}

                <h2 className="text-[15px] font-bold text-slate-900">
                    {title}
                </h2>
            </div>

            {action && (
                <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
                    {ActionIcon && <ActionIcon size={14} />}
                    {action}
                </button>
            )}
        </div>
    );
}

function StatusBadge({ children }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {children}
        </span>
    );
}

const SellerOrderDetails = () => {
    const { id: orderId } = useParams();
    const [status, setStatus] = useState("Delivered");
    const [note, setNote] = useState("");
    const [orderbyid, setOrderById] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const [shipmentdetails, setShipmentDetails] = useState([]);

    useEffect(() => {
        let isCurrentRequest = true;
       setLoading(true);
        setOrderById(null);
        setError("");

        if (!token || !orderId) {
            setError(!token ? "Please log in to view this order." : "Order ID is missing.");
            setLoading(false);
            return () => {
                isCurrentRequest = false;
            };
        }

        const fetchOrderById = async () => {
            setLoading(true);
            try {
              
                const response = await axios.get(
                    `${API_URL}/api/seller/orders/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data?.success && response.data.data) {
                    const order = response.data.data;
                    if (isCurrentRequest) {
                        setOrderById({
                            ...order,
                            items: Array.isArray(order.items) ? order.items : [],
                            user: order.user || {},
                        });
                       // setLoading(false);
                    }
                } else {
                    throw new Error(response.data?.message || "Order details were not found.");
                }
            } catch (error) {
                if (isCurrentRequest) {
                    setError(error.response?.data?.message || error.message || "Unable to load order details.");
                }
            } finally {
                if (isCurrentRequest) {
                  //  setLoading(false);
                }
            }
        };

        fetchOrderById();

        return () => {
            isCurrentRequest = false;
        };
    }, [token, orderId]);

    useEffect(() => {
       
        if (!token) return;

        const getShipments = async () => {
            
            try {
               
                setError("");

                const response = await axios.get(
                    `${API_URL}/api/shipments`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Shipment API Response:", response.data);

                if (
                    response.data?.success &&
                    Array.isArray(response.data?.shipments)
                ) {
                    setShipmentDetails(response.data.shipments);
                    
                } else {
                    throw new Error(
                        response.data?.message ||
                        "Shipment details were not found."
                    );
                }
            } catch (error) {
                console.error(
                    "Shipment details error:",
                    error.response?.data || error.message
                );
                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to load shipment details."
                );
                setShipmentDetails([]);

            } finally {
                setLoading(false);
            }
        };

        getShipments();

    }, [token]);

    const shipmentByOrderId = shipmentdetails?.filter(
        (shipment) =>
            shipment?.orderNumber === orderbyid?.orderNumber
    );
    const shipmentByOrderIdHistoryLenght = shipmentByOrderId?.[0]?.statusHistory?.length > 0;

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
    console.log("Nilesh", orderbyid);
    const isSameSeller = orderbyid?.items?.every(
        (item) => String(item.seller?._id) === String(orderbyid.sellerId)
    );

    if (loading) {
        <Loader loading={loading}/>
    }

    if (error || !orderbyid) {
        return (
            // <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
            //     <p className="text-sm text-slate-600">{error || "Order details are unavailable."}</p>
            //     <Link to="/admin/sellerorders" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            //         Back to orders
            //     </Link>
            // </div>
            <Loader loading={loading}/>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
             <Loader loading={loading}/>
            <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
                    <span>Orders</span>
                    <ChevronRight size={13} />
                    <span className="font-medium text-slate-600">
                        Order Details
                    </span>
                </div>

                {/* =====================================================
            ORDER HEADER
        ====================================================== */}
                <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link to="/admin/sellerorders" className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                                <ArrowLeft size={15} />
                            </Link>

                            <h1 className="text-2xl font-black tracking-tight text-slate-950">
                                #{orderbyid.orderNumber}
                            </h1>

                            <StatusBadge>{orderbyid.status}</StatusBadge>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            <span>
                                Placed on{" "}
                                <strong className="text-slate-700">
                                    {new Date(orderbyid.createdAt).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </strong>
                            </span>

                            <span className="text-slate-300">•</span>

                            <span>
                                <strong className="text-slate-700">
                                    {orderbyid.items.length} items
                                </strong>
                            </span>

                            <span className="text-slate-300">•</span>

                            <span>
                                Customer:{" "}
                                <strong className="text-slate-700">
                                    {orderbyid.user.name || "N/A"}
                                </strong>
                            </span>

                            <span className="text-slate-300">•</span>

                            <span>
                                Seller:{" "}
                                <strong className="text-slate-700">
                                    {isSameSeller ? "Multiple" : "Single"}
                                </strong>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">
                            <Printer size={15} />
                            Print
                        </button>

                        <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">
                            <Download size={15} />
                            Download Invoice
                        </button>
                    </div>
                </div>

                <Card className="mb-6 overflow-hidden">
                    <div className="px-6 py-6">
                        <div className="relative">
                            {/* Connecting line */}
                            <div className="absolute left-[5%] right-[5%] top-4 hidden h-0.5 bg-emerald-500 md:block" />

                            <div className="relative grid grid-cols-2 gap-y-7 md:grid-cols-6 md:gap-y-0">
                            
                                {shipmentByOrderIdHistoryLenght ? (
                                    shipmentByOrderId?.[0]?.statusHistory?.map((item, index) => (
                                        <div
                                            key={item?._id || index}
                                            className="relative flex flex-col items-center text-center"
                                        >
                                            <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-sm">
                                                <Check size={13} strokeWidth={3} />
                                            </div>

                                            <p className="mt-2 text-[11px] font-bold text-slate-800 uppercase">
                                                {item.status}
                                            </p>

                                            <p className="mt-1 text-[9px] text-slate-400">
                                                {item.updatedAt
                                                    ? new Date(item.updatedAt).toLocaleString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })
                                                    : "-"}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="relative flex flex-col items-center text-center">
                                        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-sm">
                                            <Check size={13} strokeWidth={3} />
                                        </div>

                                        <p className="mt-2 text-[11px] font-bold text-slate-800 uppercase">
                                            Order Placed
                                        </p>

                                        <p className="mt-1 text-[9px] text-slate-400">
                                            {orderbyid?.createdAt
                                                ? new Date(orderbyid.createdAt).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })
                                                : "-"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>


                <div className="grid gap-6">

                    <div className="min-w-0 space-y-6">

                        {/* Order Summary */}
                        <Card>
                            <SectionHeader
                                icon={FileText}
                                title="Order Summary"
                            />

                            <div className="space-y-3 p-5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">
                                        Item Total ({orderbyid.items.length} items)
                                    </span>

                                    <span className="font-semibold text-slate-800">
                                        ₹ {orderbyid.subtotal}
                                    </span>
                                </div>

                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">
                                        Item Discount
                                    </span>

                                    <span className="font-semibold text-emerald-600">
                                        - ₹ {orderbyid.discount}
                                    </span>
                                </div>

                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">
                                        Shipping Charges
                                    </span>

                                    <span className="font-semibold text-slate-800">
                                        ₹ {orderbyid.shippingCost}
                                    </span>
                                </div>

                                {/* <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">
                                        Platform Fee
                                    </span>

                                    <span className="font-semibold text-slate-800">
                                        ₹0
                                    </span>
                                </div> */}

                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">
                                        GST (Included)
                                    </span>

                                    <span className="font-semibold text-slate-800">
                                        ₹ {orderbyid.gstAmount}
                                    </span>
                                </div>

                                <div className="my-3 h-px bg-slate-100" />

                                <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                                    <span className="text-sm font-bold text-slate-800">
                                        Total Amount Paid
                                    </span>

                                    <span className="text-lg font-black text-slate-950">
                                        ₹ {orderbyid.total}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Order Items */}
                        <Card className="overflow-hidden">
                            <SectionHeader
                                icon={Package}
                                title="Order Items"
                            />


                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full min-w-[900px] text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/70">
                                            <th className="w-12 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                #
                                            </th>

                                            <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Product
                                            </th>

                                            {/* <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Seller
                                            </th> */}

                                            <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Price
                                            </th>

                                            <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Qty
                                            </th>

                                            <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Total
                                            </th>

                                            {/* <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                Action
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderbyid.items.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/40"
                                            >
                                                <td className="px-5 py-4 text-xs font-semibold text-slate-400">
                                                    {index + 1}
                                                </td>

                                                <td className="px-3 py-4">
                                                    <div className="flex min-w-[280px] gap-3">
                                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                                            <img
                                                                src={item.product.image}
                                                                alt={item.product.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h3 className="line-clamp-2 font-bold text-slate-800">
                                                                {item.product.name}


                                                            </h3>
                                                            <p><small className='text-[10px]'>
                                                                <span className='text-[10px] block w-full'>Category: {item.product.category}</span>
                                                                <span className='text-[10px] block w-full'> Sub Category: {item.product.subcategory}</span>
                                                            </small>
                                                            </p>

                                                            <div>
                                                                {Array.isArray(item?.addons) && item.addons.length > 0 && (
                                                                    <div className="space-y-1">
                                                                        {item.addons.map((addon, index) => (
                                                                            <div
                                                                                key={addon?._id || index}
                                                                                className="flex items-center gap-2"
                                                                            >
                                                                                <span className="font-medium text-slate-700">
                                                                                    {addon?.name}:
                                                                                </span>

                                                                                <span className="text-slate-600">
                                                                                    ₹ {addon?.price}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>

                                                                {item?.variantAttributes &&
                                                                    Object.entries(item.variantAttributes).map(([key, value]) => (
                                                                        <div key={key} className="flex gap-2">
                                                                            <span className="font-medium text-slate-700">
                                                                                {key}:
                                                                            </span>

                                                                            <span className="text-slate-600">
                                                                                {value}
                                                                            </span>
                                                                        </div>
                                                                    ))}

                                                                {item?.variantSku && (
                                                                    <p className="mt-1 text-slate-500">
                                                                        Variant SKU: {item.variantSku}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-400">
                                                                <Hash size={10} />
                                                                {item.product._id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* <td className="px-3 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                            <Store size={13} />
                                                        </div>

                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-700">
                                                                {item.seller}
                                                            </p>
                                                            <p className="text-[9px] text-slate-400">
                                                                ID: {item.sellerId}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td> */}

                                                <td className="px-3 py-4">
                                                    <p className="text-xs font-bold text-slate-800">
                                                        {formatPrice(item.price)}
                                                    </p>

                                                    {/* <p className="text-[9px] text-slate-400 line-through">
                                                        {formatPrice(item.mrp)}
                                                    </p> */}

                                                    {/* <span className="mt-1 inline-flex rounded-md bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600">
                                                        {item.discount}% off
                                                    </span> */}
                                                </td>

                                                <td className="px-3 py-4 text-xs font-semibold text-slate-700">
                                                    {item.quantity}
                                                </td>

                                                <td className="px-3 py-4 text-xs font-black text-slate-900">
                                                    {formatPrice(item.price * item.quantity)}
                                                </td>

                                                {/* <td className="px-5 py-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <button className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[9px] font-semibold text-slate-600 hover:bg-slate-50">
                                                            <Eye size={11} />
                                                            View
                                                        </button>

                                                        <button className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[9px] font-semibold text-slate-600 hover:bg-slate-50">
                                                            <RotateCcw size={11} />
                                                            Return
                                                        </button>

                                                        <button className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[9px] font-semibold text-slate-600 hover:bg-slate-50">
                                                            <Star size={11} />
                                                            Review
                                                        </button>
                                                    </div>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="divide-y divide-slate-100 lg:hidden">
                                {orderbyid.items.map((item,index) => (
                                    <div key={index} className="p-4">
                                        <div className="flex gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-20 w-20 rounded-xl border border-slate-100 object-cover"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-bold text-slate-800">
                                                    {item.name}
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {item.variant}
                                                </p>

                                                {/* <p className="mt-1 text-xs font-bold text-slate-900">
                                                    {formatPrice(item.price)}
                                                    <span className="ml-2 text-xs font-normal text-slate-400 line-through">
                                                        {formatPrice(item.mrp)}
                                                    </span>
                                                </p> */}

                                                <p className="mt-1 text-[10px] text-slate-400">
                                                    SKU: {item.sku} · Qty: {item.qty}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex gap-2">
                                            <button className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-semibold">
                                                View
                                            </button>

                                            <button className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-semibold">
                                                Return
                                            </button>

                                            <button className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-semibold">
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>


                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <SectionHeader
                                    icon={User}
                                    title="Customer Information"
                                    action="Edit"
                                    actionIcon={Pencil}
                                />

                                <div className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-700">
                                            {orderbyid?.user?.name?.charAt(0)}
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">
                                                {orderbyid.user.name}
                                            </h3>

                                            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                                                <Mail size={11} />
                                                {orderbyid.user.email}
                                            </p>

                                            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                                                <Phone size={11} />
                                                {orderbyid.user.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <button className="rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                                            View Profile
                                        </button>

                                        <button className="rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                                            Order History
                                        </button>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <SectionHeader
                                    icon={MapPin}
                                    title="Delivery Address"
                                    action="Edit"
                                    actionIcon={Pencil}
                                />

                                <div className="p-5">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        {orderbyid.user.name}
                                    </h3>

                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        {orderbyid.shippingAddress.line1}
                                        <br />
                                        {orderbyid.shippingAddress.line2}
                                        <br />
                                        {orderbyid.shippingAddress.city}, {orderbyid.shippingAddress.state}
                                        <br />
                                        {orderbyid.shippingAddress.country},  {orderbyid.shippingAddress.postalCode}
                                    </p>
                                    <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                                        <Mail size={12} />
                                        {orderbyid.user.email}
                                    </div>
                                    <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                                        <Phone size={12} />
                                        {orderbyid.user.phone}
                                    </div>

                                    <button className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
                                        View on Map
                                        <ExternalLink size={12} />
                                    </button>
                                </div>
                            </Card>
                        </div>

                        {/* Seller Information */}
                        {/* <Card>
                            <SectionHeader
                                icon={Store}
                                title="Seller Information"
                            />

                            <div className="grid gap-3 p-5 md:grid-cols-2">
                                {[
                                    {
                                        name: "Vyason Retail",
                                        id: "S001",
                                        rating: "4.6",
                                        orders: "1.2M+ orders",
                                    },
                                    {
                                        name: "ClickTech",
                                        id: "S028",
                                        rating: "4.4",
                                        orders: "980K+ orders",
                                    },
                                ].map((seller) => (
                                    <div
                                        key={seller.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                                                {seller.name.charAt(0)}
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold text-slate-800">
                                                    {seller.name}
                                                </p>

                                                <p className="mt-1 text-[10px] text-slate-400">
                                                    Seller ID: {seller.id}
                                                </p>

                                                <div className="mt-1 flex items-center gap-1 text-[10px]">
                                                    <Star
                                                        size={11}
                                                        className="fill-amber-400 text-amber-400"
                                                    />
                                                    <span className="font-bold text-slate-700">
                                                        {seller.rating}
                                                    </span>
                                                    <span className="text-slate-400">
                                                        · {seller.orders}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50">
                                            View Store
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card> */}

                        {/* Shipment */}
                        {/* <Card>
              <SectionHeader
                icon={Truck}
                title="Tracking & Shipment"
              />

              <div className="grid gap-4 p-5 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Courier
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    Delhivery
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Tracking Number
                  </p>

                  <p className="mt-1 text-sm font-bold text-blue-600">
                    123456789012
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Estimated Delivery
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    15 Aug 2024
                  </p>
                </div>
              </div>
            </Card> */}
                    </div>

                    {/* ===================================================
              RIGHT SIDEBAR
          ==================================================== */}
                    <aside className="space-y-6">

                        {/* Status Update */}
                        {/* <Card>
              <SectionHeader
                icon={Clock3}
                title="Order Status Update"
              />

              <div className="p-5">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Current Status
                </label>

                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Packed</option>
                    <option>Shipped</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                    <option>Returned</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-3 text-slate-400"
                  />
                </div>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add internal note (optional)..."
                  rows={4}
                  className="mt-3 w-full resize-none rounded-xl border border-slate-200 p-3 text-xs outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <button className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                  <CheckCircle2 size={15} />
                  Update Status
                </button>
              </div>
            </Card> */}

                        {/* Payment */}
                        <Card>
                            <SectionHeader
                                icon={CreditCard}
                                title="Payment Information"
                                action="View Details"
                            />
                            {orderbyid?.paymentMethod?.toLowerCase() !== "cod" ? (
                                <div className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                            <CreditCard size={20} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-bold text-slate-800 uppercase">
                                                    {orderbyid?.paymentMethod}
                                                </p>
                                                <p className="text-sm font-black text-slate-900">
                                                    ₹ {orderbyid?.grandTotal}
                                                </p>
                                            </div>
                                            <p className="mt-1 text-[10px] text-slate-400">
                                                Transaction ID: {orderbyid?.razorpayPaymentId || "-"}
                                            </p>
                                            <p className="mt-1 text-[10px] text-slate-400">
                                                {orderbyid?.updatedAt
                                                    ? new Date(orderbyid.updatedAt).toLocaleString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-2 text-[10px] font-bold text-emerald-700">
                                        <CheckCircle2 size={12} />
                                        Payment Successful
                                    </div>
                                </div>

                            ) : (


                                <div className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                            <CreditCard size={20} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-bold text-slate-800 uppercase">
                                                    {orderbyid?.paymentMethod}

                                                </p>
                                                <p>Payment will be collected on delivery</p>
                                                <p className="text-sm font-black text-slate-900">
                                                    ₹ {orderbyid?.grandTotal}
                                                </p>
                                            </div>
                                            <p className="mt-1 text-[10px] text-slate-400">
                                                Payment: {orderbyid?.paymentStatus || "-"}
                                            </p>
                                            {orderbyid?.paymentStatus === "Paid" && (
                                                <p className="mt-1 text-[10px] text-slate-400">
                                                    Collection:{" "}
                                                    {orderbyid?.updatedAt
                                                        ? new Date(orderbyid.updatedAt).toLocaleString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })
                                                        : "-"}
                                                </p>
                                            )}
                                        </div>


                                    </div>

                                    <div className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 py-2 text-[10px] font-bold text-amber-700">
                                        <Clock3 size={12} />
                                        Pending
                                    </div>
                                </div>




                            )}




                        </Card>

                        {/* Notes */}
                        {/* <Card>
                            <SectionHeader
                                icon={MessageSquare}
                                title="Order Notes"
                                action="Add Note"
                                actionIcon={Plus}
                            />

                            <div className="p-5">
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs leading-5 text-slate-600">
                                        Customer requested fast delivery.
                                    </p>

                                    <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                                        <span>12 Aug 2024, 11:30 AM</span>
                                        <span>•</span>
                                        <span>Admin</span>
                                    </div>
                                </div>

                                <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-500 hover:border-blue-300 hover:text-blue-600">
                                    <Plus size={14} />
                                    Add Internal Note
                                </button>
                            </div>
                        </Card> */}

                        {/* Quick Actions */}
                        {/* <Card className="overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-bold text-slate-900">
                  Quick Actions
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2 p-4">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <Phone size={14} />
                  Contact
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <Mail size={14} />
                  Email
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <RotateCcw size={14} />
                  Refund
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl border border-red-100 py-3 text-xs font-semibold text-red-600 hover:bg-red-50">
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </Card> */}
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default SellerOrderDetails