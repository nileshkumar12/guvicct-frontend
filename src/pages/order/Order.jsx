import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../utils/config";
import { useNavigate } from 'react-router-dom';

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

const Order = () => {
  
  const { id } = useParams();
 const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!id) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    const fetchOrderById = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
        }else if (isTokenExpired(token)) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        const response = await fetch(
          `${API_URL}/api/orders/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Order API response:", data);

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch order details"
          );
        }

        if (!data.success || !data.data) {
          throw new Error("Order details not found");
        }

        setOrderDetails(data.data);

      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(error.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderById();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-gray-500">
            Loading order details...
          </p>
        </div>
      </section>
    );
  }

  // Error / Order not found
  if (error || !orderDetails) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Order status
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            Order not found
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            {error || "Unable to load your order details."}
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  const items = orderDetails.items || [];

  return (
    <section className="py-12">
      <div className="mx-auto  px-6">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Order confirmed
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            Thank you for your purchase
          </h1>

          <p className="mt-2 text-gray-500">
            Your order has been successfully placed.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">

          {/* LEFT */}
          <div className="space-y-4 lg:col-span-8">

            {/* Order Header */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Items ordered
                  </h2>

                  <p className="text-sm text-gray-500">
                    {items.length} item(s) in this order
                  </p>
                </div>

                <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  Order #{orderDetails.orderNumber}
                </div>

              </div>
            </div>

            {/* Items */}
            {items.map((item, index) => (
              <div
                key={item._id || item.product?._id || index}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.productName ||
                        item.product?.name ||
                        "Product"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity:{" "}
                      <span className="font-medium text-gray-700">
                        {item.quantity}
                      </span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      )}
                    </p>

                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.price)} each
                    </p>

                    {Number(item.gstRate) > 0 && (
                      <p className="text-xs text-gray-400">
                        HSN {item.hsnCode || '-'} · GST {item.gstRate}% ({formatCurrency(item.gstAmount)})
                      </p>
                    )}
                  </div>

                </div>
              </div>
            ))}

            {/* Payment Details */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-semibold text-gray-900">
                Payment details
              </h2>

              <div className="mt-5 space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Payment method
                  </span>

                  <span className="font-medium text-gray-900">
                    {orderDetails.paymentMethod === "razorpay"
                      ? "Razorpay"
                      : "Cash on Delivery"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Payment status
                  </span>

                  <span className="font-semibold text-green-600">
                    {orderDetails.paymentStatus}
                  </span>
                </div>

                {orderDetails.razorpayOrderId && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">
                      Razorpay Order ID
                    </span>

                    <span className="break-all font-medium text-gray-900">
                      {orderDetails.razorpayOrderId}
                    </span>
                  </div>
                )}

                {orderDetails.razorpayPaymentId && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">
                      Razorpay Payment ID
                    </span>

                    <span className="break-all font-medium text-gray-900">
                      {orderDetails.razorpayPaymentId}
                    </span>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-semibold text-gray-900">
                Order summary
              </h2>

              <div className="mt-6 space-y-3 text-sm text-gray-600">

                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>
                    {formatCurrency(orderDetails.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span>
                    - {formatCurrency(orderDetails.discount)}
                  </span>
                </div>

                {Number(orderDetails.igstAmount) > 0 ? (
                  <div className="flex items-center justify-between">
                    <span>IGST</span>
                    <span>{formatCurrency(orderDetails.igstAmount)}</span>
                  </div>
                ) : (Number(orderDetails.cgstAmount) > 0 || Number(orderDetails.sgstAmount) > 0) && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>CGST</span>
                      <span>{formatCurrency(orderDetails.cgstAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SGST</span>
                      <span>{formatCurrency(orderDetails.sgstAmount)}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>
                    {Number(orderDetails.shippingCost || 0) === 0
                      ? "Free"
                      : formatCurrency(orderDetails.shippingCost)}
                  </span>
                </div>

              </div>

              <div className="mt-5 border-t border-gray-200 pt-4">

                <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>

                  <span>
                    {formatCurrency(orderDetails.grandTotal || orderDetails.total)}
                  </span>
                </div>

              </div>

              {/* Order Status */}
              <div className="mt-6 rounded-xl bg-gray-50 p-4">

                <p className="text-sm text-gray-500">
                  Order status
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {orderDetails.status}
                </p>

              </div>

              <div className="mt-6 flex flex-col gap-3">

                <Link
                  to="/dashboard/orders"
                  className="rounded-full border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  My Orders
                </Link>

                <Link
                  to="/"
                  className="rounded-full bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Continue shopping
                </Link>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Order;