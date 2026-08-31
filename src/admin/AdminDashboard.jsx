import React, { useEffect, useState } from "react";
import { API_URL } from "../utils/config";


const AdminDashboard = () => {

  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [platform, setPlatform] = useState({});
  const [revenueOverview, setRevenueOverview] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSellers, setTotalSellers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [growth, setGrowth] = useState(0);
  const [allSellers, setAllSellers] = useState([]);

  console.log("Recent Orders dfff:", recentOrders);

  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        console.log("TOKEN:", token);

        const response = await fetch(
          `${API_URL}/api/admin/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Dashboard Data:", data);

        if (!response.ok) {
          console.error("Dashboard API Error:", data);
          return;
        }

        setRecentOrders(data.recentOrders || []);
        setAllSellers(data.allSellers || []);
        setStats(data.stats || []);
        setTopSellers(data.topSellers || []);
        setPlatform(data.platform || {});
        console.log("Stats Data:", data.stats);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchRecentOrders();

  }, [token]);


  const getStatusClass = (status) => {

    switch (status) {

      case "Confirmed":
      case "active":
        return "bg-green-100 text-green-700";

      case "delivered":
      case "active":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Monitor your entire ecommerce platform
            </p>

          </div>


          {/* <button
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
            Download Report
          </button> */}

        </div>


        {/* STAT CARDS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div  className="bg-white border rounded-xl p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Revenue
                </p>
                <h2 className="text-2xl font-bold mt-2">
                  Rs {stats.totalRevenue}
                </h2>
             </div>
             <div
                className={`w-11 h-11   rounded-lg  flex items-center   justify-center  text-xl `}>
                {stats.icon}
              </div>
            </div>
          </div>
                <div  className="bg-white border rounded-xl p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>
                <h2 className="text-2xl font-bold mt-2">
                  {stats.totalOrders}
                </h2>
             </div>
             <div
                className={`w-11 h-11   rounded-lg  flex items-center   justify-center  text-xl `}>
                {stats.icon}
              </div>
            </div>
          </div>
          <div  className="bg-white border rounded-xl p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Users
                </p>
                <h2 className="text-2xl font-bold mt-2">
                  {stats.totalUsers}
                </h2>
             </div>
             <div
                className={`w-11 h-11   rounded-lg  flex items-center   justify-center  text-xl `}>
                {stats.icon}
              </div>
            </div>
          </div>
           <div  className="bg-white border rounded-xl p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Sellers
                </p>
                <h2 className="text-2xl font-bold mt-2">
                  {stats.totalSellers}
                </h2>
             </div>
             <div
                className={`w-11 h-11   rounded-lg  flex items-center   justify-center  text-xl `}>
                {stats.icon}
              </div>
            </div>
          </div>
       </div>


      {/* ANALYTICS */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* REVENUE CHART */}

          <div className="lg:col-span-2 bg-white border rounded-xl">

            <div className="flex items-center justify-between px-5 py-4 border-b">

              <div>

                <h2 className="font-bold">
                  Revenue Overview
                </h2>

                <p className="text-sm text-gray-500">
                  Platform revenue performance
                </p>

              </div>


              <select
                className="
                  border
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                "
              >

                <option>Monthly</option>
                <option>Weekly</option>
                <option>Yearly</option>

              </select>

            </div>


            <div className="p-5">

              <div className="h-64 flex items-end gap-3 md:gap-5">

                {[
                  45,
                  65,
                  55,
                  75,
                  60,
                  85,
                  70,
                  95,
                  80,
                  90,
                  75,
                  100,
                ].map((height, index) => (

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
                      "
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    <span className="text-xs text-gray-400">
                      {index + 1}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>


          {/* PLATFORM SUMMARY */}

          <div className="bg-white border rounded-xl">

            <div className="px-5 py-4 border-b">

              <h2 className="font-bold">
                Platform Summary
              </h2>

            </div>


            <div className="p-5 space-y-5">

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm text-gray-500">
                    Active Sellers
                  </span>

                  <span className="font-semibold">
                    {/* {platform.totalSellers} / {platform.totalSellersActive} */}
                    {platform.totalSellers} / {platform.totalSellers}
                  </span>

                </div>

                <div className="h-2 bg-gray-100 rounded-full">

                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: "90%" }}
                  />

                </div>

              </div>


              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm text-gray-500">
                    Active Products
                  </span>

                  <span className="font-semibold">
                    {platform.activeProducts} / {platform.activeProducts}
                  </span>

                </div>

                <div className="h-2 bg-gray-100 rounded-full">

                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: "75%" }}
                  />

                </div>

              </div>


              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm text-gray-500">
                    Successful Orders
                  </span>

                  <span className="font-semibold">
                   {stats.totalOrders} / {stats.totalOrders}
                  </span>

                </div>

                <div className="h-2 bg-gray-100 rounded-full">

                  <div
                    className="h-2 bg-purple-500 rounded-full"
                    style={{ width: `${(stats.totalOrders / stats.totalOrders) * 100}%` }}
                  />

                </div>

              </div>


              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm text-gray-500">
                    Customer Satisfaction
                  </span>

                  <span className="font-semibold">
                    {platform.customerSatisfaction} %
                  </span> 

                </div>

                <div className="h-2 bg-gray-100 rounded-full">

                  <div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: `${platform.customerSatisfaction}%` }}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* BOTTOM */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">


          {/* RECENT ORDERS */}

          <div className="lg:col-span-2 bg-white border rounded-xl">

            <div className="flex justify-between px-5 py-4 border-b">

              <h2 className="font-bold">
                Recent Orders
              </h2>

              <button className="text-red-500 text-sm font-semibold">
                View All
              </button>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

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
                      key={order._id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 font-semibold">
                        #{order.orderNumber}
                      </td>

                      <td className="px-5 py-4">
                        {order.user.name}
                      </td>


                      <td className="px-5 py-4 font-semibold">
                        {order.total}
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


          {/* SELLERS */}

          <div className="bg-white border rounded-xl">

            <div className="flex justify-between px-5 py-4 border-b">

              <h2 className="font-bold">
                Top Sellers
              </h2>

              <button className="text-red-500 text-sm">
                View All
              </button>

            </div>


            <div className="p-5 space-y-5">

              {topSellers.map((seller, index) => (

                <div
                  key={index}
                  className="flex items-center gap-3"
                >

                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                      font-bold
                    "
                  >
                    {seller.sellerName.charAt(0)}
                  </div>


                  <div className="flex-1 min-w-0">

                    <p className="font-semibold truncate">
                      {seller.sellerName}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {seller.sellerEmail}
                    </p>

                  </div>


                  <div className="text-right">

                    <p className="font-semibold text-sm">
                      {seller.revenue}
                    </p>

                    <span
                      className={`
                        text-xs
                        px-2
                        py-1
                        rounded-full
                        ${getStatusClass(
                          seller.status
                        )}
                      `}
                    >
                      {seller.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;