import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../utils/config";
const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Accepted: "bg-blue-50 text-blue-700 border-blue-200",
  Packed: "bg-purple-50 text-purple-700 border-purple-200",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "In Transit": "bg-orange-50 text-orange-700 border-orange-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const SellerOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/seller/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setOrders(data.data);

      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
    // Log the fetched orders for debugging
  }, []);
  console.log("Fetched orders:", orders);


  if (!orders.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <span className="text-3xl">🛍️</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No orders yet
          </h2>

          <p className="mt-2 text-slate-500">
            Your orders will appear here once you place an order.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">

        <div className="mb-8">

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Track and manage all your purchases.
              </p>
            </div>

            <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
              {orders.length} Orders
            </span>
          </div>
        </div>


        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >

              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {order.orderNumber}
                      </span>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {order.paymentStatus}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Ordered on {order.createdAt}
                    </p>
                  </div>

                  <Link
                    to={`/admin/sellerorders/${order._id}`}
                    className="inline-flex w-fit items-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                  >
                    View Details
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>


              {/* <div className="divide-y divide-slate-100">
                    {order.sellers.map((seller) => (
                      <div key={seller.sellerId} className="p-5 sm:p-6">
    
                       
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                              Seller
                            </p>
    
                            <h3 className="mt-1 text-base font-bold text-slate-900">
                              {seller.storeName}
                            </h3>
                          </div>
    
                          <span
                            className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${
                              statusStyles[seller.status]
                            }`}
                          >
                            {seller.status}
                          </span>
                        </div>
    
                        
                        <div className="space-y-4">
                          {seller.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex gap-4"
                            >
                              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-24">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
    
                              <div className="min-w-0 flex-1">
                                <h4 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">
                                  {item.name}
                                </h4>
    
                                <p className="mt-1 text-sm text-slate-500">
                                  Qty: {item.quantity}
                                </p>
    
                                <p className="mt-2 text-sm font-bold text-slate-900">
                                  ₹{item.price.toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
    
                       
                        {seller.shipment?.trackingNumber && (
                          <div className="mt-5 flex flex-col gap-2 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xs text-slate-400">
                                Shipment
                              </p>
    
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {seller.shipment.courier}
                              </p>
                            </div>
    
                            <div>
                              <p className="text-xs text-slate-400">
                                Tracking Number
                              </p>
    
                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {seller.shipment.trackingNumber}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
     */}

              {/* <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <span className="text-sm text-slate-500">
                      {order.sellers.length} Seller
                      {order.sellers.length > 1 ? "s" : ""}
                    </span>
    
                    <p className="text-base font-bold text-slate-900">
                      Total: ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div> */}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default SellerOrders