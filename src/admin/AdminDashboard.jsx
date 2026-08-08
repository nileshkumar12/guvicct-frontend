import React from "react";

const AdminDashboard = () => {

  const stats = [
    {
      title: "Total Revenue",
      value: "₹18,42,500",
      change: "+18.5%",
      icon: "💰",
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: "2,486",
      change: "+12.4%",
      icon: "📦",
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Total Users",
      value: "12,845",
      change: "+9.8%",
      icon: "👥",
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Total Sellers",
      value: "348",
      change: "+6.2%",
      icon: "🏪",
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
  ];


  const recentOrders = [
    {
      id: "ORD-1001",
      customer: "Nilesh Kumar",
      seller: "Fashion Store",
      amount: "₹2,499",
      status: "Delivered",
    },
    {
      id: "ORD-1002",
      customer: "Rahul Sharma",
      seller: "Tech World",
      amount: "₹5,999",
      status: "Shipped",
    },
    {
      id: "ORD-1003",
      customer: "Amit Kumar",
      seller: "Sports Hub",
      amount: "₹3,299",
      status: "Pending",
    },
    {
      id: "ORD-1004",
      customer: "Rohit Singh",
      seller: "Fashion Store",
      amount: "₹1,999",
      status: "Processing",
    },
  ];


  const sellers = [
    {
      name: "Fashion Store",
      email: "fashion@example.com",
      sales: "₹4,52,000",
      status: "Active",
    },
    {
      name: "Tech World",
      email: "tech@example.com",
      sales: "₹3,84,500",
      status: "Active",
    },
    {
      name: "Sports Hub",
      email: "sports@example.com",
      sales: "₹2,75,300",
      status: "Pending",
    },
    {
      name: "Home Store",
      email: "home@example.com",
      sales: "₹1,98,400",
      status: "Active",
    },
  ];


  const getStatusClass = (status) => {

    switch (status) {

      case "Delivered":
      case "Active":
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


          <button
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
          </button>

        </div>


        {/* STAT CARDS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          {stats.map((stat, index) => (

            <div
              key={index}
              className="bg-white border rounded-xl p-5"
            >

              <div className="flex justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="text-2xl font-bold mt-2">
                    {stat.value}
                  </h2>

                  <p className={`text-xs mt-2 ${stat.color}`}>
                    {stat.change} from last month
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
                    312 / 348
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
                    8,425
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
                    92%
                  </span>

                </div>

                <div className="h-2 bg-gray-100 rounded-full">

                  <div
                    className="h-2 bg-purple-500 rounded-full"
                    style={{ width: "92%" }}
                  />

                </div>

              </div>


              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-sm text-gray-500">
                    Customer Satisfaction
                  </span>

                  <span className="font-semibold">
                    96%
                  </span>

                </div>

                <div className="h-2 bg-gray-100 rounded-full">

                  <div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: "96%" }}
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
                      SELLER
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

                      <td className="px-5 py-4 font-semibold">
                        #{order.id}
                      </td>

                      <td className="px-5 py-4">
                        {order.customer}
                      </td>

                      <td className="px-5 py-4">
                        {order.seller}
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

              {sellers.map((seller, index) => (

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
                    {seller.name.charAt(0)}
                  </div>


                  <div className="flex-1 min-w-0">

                    <p className="font-semibold truncate">
                      {seller.name}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {seller.email}
                    </p>

                  </div>


                  <div className="text-right">

                    <p className="font-semibold text-sm">
                      {seller.sales}
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