import React, { useState, useEffect } from "react";
import { API_URL } from "../../utils/config.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Shipment = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);
const[shipments, setShipments] = useState([]);


  // const [shipments] = useState([
  //   {
  //     _id: "66c123456789",
  //     orderId: {
  //       _id: "66a76782176c",
  //       orderNumber: "ORD-1001",
  //     },
  //     sellerId: "66seller123",
  //     trackingNumber: "DL123456789",
  //     carrier: "delhivery",
  //     status: "shipped",

  //     shippingAddress: {
  //       name: "Nilesh Kumar",
  //       address: "Sector 15, Gurgaon",
  //       city: "Gurgaon",
  //       state: "Haryana",
  //       pincode: "122001",
  //       phone: "9876543210",
  //     },

  //     estimatedDelivery: "2026-08-12",

  //     statusHistory: [
  //       {
  //         status: "pending",
  //         note: "Shipment created",
  //         updatedAt: "2026-08-08T10:20:00",
  //       },
  //       {
  //         status: "packed",
  //         note: "Product packed successfully",
  //         updatedAt: "2026-08-08T12:30:00",
  //       },
  //       {
  //         status: "shipped",
  //         note: "Package handed over to Delhivery",
  //         updatedAt: "2026-08-08T15:15:00",
  //       },
  //     ],
  //   },

  //   {
  //     _id: "66c123456790",
  //     orderId: {
  //       _id: "66a76782177c",
  //       orderNumber: "ORD-1002",
  //     },
  //     sellerId: "66seller123",
  //     trackingNumber: "BD987654321",
  //     carrier: "bluedart",
  //     status: "packed",

  //     shippingAddress: {
  //       name: "Rahul Sharma",
  //       address: "Sector 21",
  //       city: "Noida",
  //       state: "Uttar Pradesh",
  //       pincode: "201301",
  //       phone: "9876543211",
  //     },

  //     estimatedDelivery: "2026-08-13",

  //     statusHistory: [
  //       {
  //         status: "pending",
  //         note: "Shipment created",
  //         updatedAt: "2026-08-08T09:20:00",
  //       },
  //       {
  //         status: "packed",
  //         note: "Product packed",
  //         updatedAt: "2026-08-08T11:30:00",
  //       },
  //     ],
  //   },

  //   {
  //     _id: "66c123456791",
  //     orderId: {
  //       _id: "66a76782178d",
  //       orderNumber: "ORD-1003",
  //     },
  //     sellerId: "66seller123",
  //     trackingNumber: "DT987654321",
  //     carrier: "dtdc",
  //     status: "out_for_delivery",

  //     shippingAddress: {
  //       name: "Amit Kumar",
  //       address: "MG Road",
  //       city: "Delhi",
  //       state: "Delhi",
  //       pincode: "110001",
  //       phone: "9876543212",
  //     },

  //     estimatedDelivery: "2026-08-09",

  //     statusHistory: [
  //       {
  //         status: "pending",
  //         note: "Shipment created",
  //         updatedAt: "2026-08-07T09:20:00",
  //       },
  //       {
  //         status: "packed",
  //         note: "Product packed",
  //         updatedAt: "2026-08-07T12:30:00",
  //       },
  //       {
  //         status: "shipped",
  //         note: "Package shipped",
  //         updatedAt: "2026-08-08T08:30:00",
  //       },
  //       {
  //         status: "out_for_delivery",
  //         note: "Package is out for delivery",
  //         updatedAt: "2026-08-09T09:00:00",
  //       },
  //     ],
  //   },
  // ]);

useEffect(() => {
  fetchShipments();
}, []);

const fetchShipments = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/shipments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch shipments");
    }
    const data = await response.json();
    setShipments(data.shipments);
    console.log("Fetched Shipments:", data.shipments);
  } catch (error) {
    console.error("Error fetching shipments:", error);
  }
};


  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700";

      case "packed":
        return "bg-yellow-100 text-yellow-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "out_for_delivery":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "returned":
        return "bg-orange-100 text-orange-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    return status
      ?.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
 console.log(selectedShipment);
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Shipments
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and track your customer shipments
            </p>
          </div>

          <Link
            to="/admin/addshipment"
            className="
              bg-red-500
              hover:bg-red-600
              text-white
              font-semibold
              px-5
              py-3
              rounded-lg
              transition
            "
          >
            + Create Shipment
          </Link>

        </div>


        {/* ================= STAT CARDS ================= */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Total Shipments
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {shipments.length}
            </h2>
          </div>


          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h2 className="text-2xl font-bold text-gray-700 mt-2">
              {
                shipments.filter(
                  (item) => item.status === "pending"
                ).length
              }
            </h2>
          </div>


          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Shipped
            </p>

            <h2 className="text-2xl font-bold text-blue-600 mt-2">
              {
                shipments.filter(
                  (item) => item.status === "shipped"
                ).length
              }
            </h2>
          </div>


          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <h2 className="text-2xl font-bold text-green-600 mt-2">
              {
                shipments.filter(
                  (item) => item.status === "delivered"
                ).length
              }
            </h2>
          </div>

        </div>


        {/* ================= FILTER ================= */}

        <div className="bg-white border rounded-xl p-4 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
              type="text"
              placeholder="Search order number..."
              className="
                w-full
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-red-500
              "
            />
            
            <input
              type="text"
              placeholder="Search tracking number..."
              className="
                w-full
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-red-500
              "
            />


            


            <select
              className="
                w-full
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-red-500
              "
            >

              <option value="">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="packed">
                Packed
              </option>

              <option value="shipped">
                Shipped
              </option>

              <option value="out_for_delivery">
                Out for Delivery
              </option>

              <option value="delivered">
                Delivered
              </option>

              <option value="returned">
                Returned
              </option>

              <option value="cancelled">
                Cancelled
              </option>

            </select>


            <select
              className="
                w-full
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-red-500
              "
            >

              <option value="">
                All Carriers
              </option>

              <option value="delhivery">
                Delhivery
              </option>

              <option value="bluedart">
                Blue Dart
              </option>

              <option value="dtdc">
                DTDC
              </option>

              <option value="fedex">
                FedEx
              </option>

              <option value="ekart">
                Ekart
              </option>

              <option value="other">
                Other
              </option>

            </select>

          </div>

        </div>


        {/* ================= SHIPMENT TABLE ================= */}

        <div className="bg-white border rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b">

            <h2 className="text-lg font-bold text-gray-900">
              All Shipments
            </h2>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Order
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Tracking
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Carrier
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                    Delivery
                  </th>

                  <th className="text-right px-5 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y">

                {shipments.map((shipment) => (

                  <tr
                    key={shipment._id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* Order */}

                    <td className="px-5 py-4">

                      <p className="font-semibold text-gray-900">
                        #{shipment.orderNumber}
                      </p>

                      {/* <p className="text-xs text-gray-400 mt-1">
                        {shipment._id}
                      </p> */}

                    </td>


                    {/* Tracking */}

                    <td className="px-5 py-4">

                      <p className="font-medium text-gray-900">
                        {shipment.trackingNumber || "Not Assigned"}
                      </p>

                    </td>


                    {/* Carrier */}

                    <td className="px-5 py-4">

                      <span className="capitalize">
                        {shipment.carrier}
                      </span>

                    </td>


                    {/* Status */}

                    <td className="px-5 py-4">

                      <span
                        className={`
                          inline-flex
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-semibold
                          ${getStatusStyle(shipment.status)}
                        `}
                      >
                        {formatStatus(shipment.status)}
                      </span>

                    </td>


                    {/* Delivery */}

                    <td className="px-5 py-4 text-gray-600">

                      {shipment.estimatedDelivery
                        ? formatDate(shipment.estimatedDelivery)
                        : "Not available"}

                    </td>


                    {/* Action */}

                    <td className="px-5 py-4 text-right">

                      <button
                        onClick={() =>
                          setSelectedShipment(shipment)
                        }
                        className="
                          text-red-500
                          hover:text-red-700
                          font-semibold
                        "
                      >
                        View Details
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* ================= DETAILS ================= */}

        {selectedShipment && (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

            {/* LEFT */}

            <div className="lg:col-span-2 space-y-6">

              {/* Shipment Info */}

              <div className="bg-white border rounded-xl p-5">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

                  <div>

                    <h2 className="text-xl font-bold text-gray-900">
                      Shipment Details
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Shipment ID: {selectedShipment._id}
                    </p>

                  </div>


                  <span
                    className={`
                      inline-flex
                      w-fit
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-semibold
                      ${getStatusStyle(
                        selectedShipment.status
                      )}
                    `}
                  >
                    {formatStatus(
                      selectedShipment.status
                    )}
                  </span>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="border rounded-lg p-4">

                    <p className="text-sm text-gray-500">
                      Order Number
                    </p>

                    <p className="font-semibold mt-1">
                      #{selectedShipment.orderNumber}
                    </p>

                  </div>


                  <div className="border rounded-lg p-4">

                    <p className="text-sm text-gray-500">
                      Tracking Number
                    </p>

                    <p className="font-semibold mt-1">
                      {selectedShipment.trackingNumber ||
                        "Not Assigned"}
                    </p>

                  </div>


                  <div className="border rounded-lg p-4">

                    <p className="text-sm text-gray-500">
                      Carrier
                    </p>

                    <p className="font-semibold capitalize mt-1">
                      {selectedShipment.carrier}
                    </p>

                  </div>


                  <div className="border rounded-lg p-4">

                    <p className="text-sm text-gray-500">
                      Estimated Delivery
                    </p>

                    <p className="font-semibold mt-1">
                      {selectedShipment.estimatedDelivery
                        ? formatDate(
                            selectedShipment.estimatedDelivery
                          )
                        : "Not Available"}
                    </p>

                  </div>

                </div>


                {/* Update Status */}

                <div className="mt-6">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Update Shipment Status
                  </label>


                  <div className="flex flex-col sm:flex-row gap-3">

                    <select
                      defaultValue={
                        selectedShipment.status
                      }
                      className="
                        flex-1
                        border
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-red-500
                      "
                    >

                      <option value="pending">
                        Pending
                      </option>

                      <option value="packed">
                        Packed
                      </option>

                      <option value="shipped">
                        Shipped
                      </option>

                      <option value="out_for_delivery">
                        Out for Delivery
                      </option>

                      <option value="delivered">
                        Delivered
                      </option>

                      <option value="returned">
                        Returned
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>

                    </select>


                    <button
                      className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        font-semibold
                        px-6
                        py-3
                        rounded-lg
                      "
                    >
                      Update Status
                    </button>

                  </div>

                </div>

              </div>


              {/* Tracking Timeline */}

              <div className="bg-white border rounded-xl p-5">

                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Shipment History
                </h2>


                <div className="relative">

                  <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-gray-200">
                  </div>


                  <div className="space-y-7">

                    {selectedShipment.statusHistory
                      ?.slice()
                      .reverse()
                      .map((history, index) => (

                        <div
                          key={index}
                          className="relative flex gap-4"
                        >

                          <div
                            className={`
                              relative
                              z-10
                              w-8
                              h-8
                              rounded-full
                              flex
                              items-center
                              justify-center
                              text-white
                              text-sm
                              font-bold
                              ${
                                index === 0
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }
                            `}
                          >
                            {index === 0 ? "●" : "✓"}
                          </div>


                          <div className="flex-1">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

                              <h3 className="font-semibold text-gray-900">
                                {formatStatus(
                                  history.status
                                )}
                              </h3>

                              <span className="text-xs text-gray-400">
                                {formatDateTime(
                                  history.updatedAt
                                )}
                              </span>

                            </div>


                            <p className="text-sm text-gray-500 mt-1">
                              {history.note ||
                                "Status updated"}
                            </p>

                          </div>

                        </div>

                      ))}

                  </div>

                </div>

              </div>

            </div>


            {/* RIGHT */}

            <div className="space-y-6">

              {/* Customer Address */}

              <div className="bg-white border rounded-xl p-5">

                <h2 className="text-xl font-bold text-gray-900 mb-5">
                  Shipping Address
                </h2>


                <div className="space-y-4">

                  <div>

                    <p className="text-xs text-gray-500 uppercase">
                      Customer
                    </p>

                    <p className="font-semibold text-gray-900 mt-1">
                      {selectedShipment.shippingAddress.name}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500 uppercase">
                      Address
                    </p>

                    <p className="text-gray-700 mt-1 leading-6">
                      {selectedShipment.shippingAddress.address}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500 uppercase">
                      City
                    </p>

                    <p className="text-gray-700 mt-1">
                      {selectedShipment.shippingAddress.city}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500 uppercase">
                      State
                    </p>

                    <p className="text-gray-700 mt-1">
                      {selectedShipment.shippingAddress.state}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500 uppercase">
                      Pincode
                    </p>

                    <p className="text-gray-700 mt-1">
                      {selectedShipment.shippingAddress.pincode}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500 uppercase">
                      Phone
                    </p>

                    <p className="text-gray-700 mt-1">
                      {selectedShipment.shippingAddress.phone}
                    </p>

                  </div>

                </div>

              </div>


              {/* Tracking */}

              <div className="bg-white border rounded-xl p-5">

                <h2 className="text-lg font-bold text-gray-900">
                  Tracking
                </h2>


                <div className="mt-4 bg-gray-50 rounded-lg p-4">

                  <p className="text-xs text-gray-500">
                    Tracking Number
                  </p>

                  <p className="font-bold text-gray-900 mt-1 break-all">
                    {selectedShipment.trackingNumber ||
                      "Not Assigned"}
                  </p>


                  <p className="text-xs text-gray-500 mt-4">
                    Carrier
                  </p>

                  <p className="font-semibold capitalize mt-1">
                    {selectedShipment.carrier}
                  </p>

                </div>


                <button
                  className="
                    w-full
                    mt-4
                    border
                    border-gray-300
                    hover:bg-gray-50
                    font-semibold
                    py-3
                    rounded-lg
                  "
                >
                  Track Shipment
                </button>

              </div>


              {/* Close */}

              <button
                onClick={() => setSelectedShipment(null)}
                className="
                  w-full
                  bg-gray-700
                  hover:bg-gray-800
                  text-white
                  font-semibold
                  py-3
                  rounded-lg
                "
              >
                Close Details
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default Shipment;