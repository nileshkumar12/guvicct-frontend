import React, { useState } from "react";
import { useToast } from "../../components/ToastProvider.jsx"
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/config.js";
const AddShipment = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

    const [formData, setFormData] = useState({
    orderNumber: "",
    sellerId: "",
    trackingNumber: "",
    carrier: "other",
    status: "pending",
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    estimatedDelivery: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    console.log("Validating form data:", formData);

    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = "Order ID is required";
    }

    if (!formData.trackingNumber.trim()) {
      newErrors.trackingNumber = "Tracking number is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter valid 6 digit pincode";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10 digit phone number";
    }

    if (!formData.estimatedDelivery) {
      newErrors.estimatedDelivery =
        "Estimated delivery date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const payload = {
  orderNumber: formData.orderNumber,
  sellerId: formData.sellerId,

  trackingNumber: formData.trackingNumber,

  carrier: formData.carrier,

  status: formData.status,

  shippingAddress: {
    name: formData.name,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    phone: formData.phone,
  },

  estimatedDelivery: formData.estimatedDelivery,
};

  console.log("Shipment Payload:", payload);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/shipments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create shipment");
    }

    console.log("Shipment Created:", data);
    addToast(data.message || "Shipment created successfully.", "success");
    navigate("/admin/shipment");


  } catch (error) {
    console.error("Create Shipment Error:", error);
    addToast(error.message || "Failed to create shipment", "error");
    // toast.error(error.message || "Failed to create shipment");
  }
};

  const handleCancel = () => {
    setFormData({
      orderNumber: "",
      sellerId: "",
      trackingNumber: "",
      carrier: "other",
      status: "pending",
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      estimatedDelivery: "",
    });

    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="">

        {/* ================= HEADER ================= */}

        <div className="mb-6">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create Shipment
          </h1>

          <p className="text-gray-500 mt-1">
            Create a new shipment for an order
          </p>

        </div>


        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ================= ORDER INFORMATION ================= */}

          <div className="bg-white border rounded-xl">

            <div className="px-5 py-4 border-b">

              <h2 className="text-lg font-bold text-gray-900">
                Order Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Enter the order and shipment details
              </p>

            </div>


            <div className="p-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Order ID */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Order ID
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    placeholder="Enter order ID"
                    className={`
                      w-full
                      border
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      ${
                        errors.orderNumber
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-red-200"
                      }
                    `}
                  />

                  {errors.orderNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.orderNumber}
                    </p>
                  )}

                </div>


                {/* Seller ID */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seller ID
                  </label>

                  <input
                    type="text"
                    name="sellerId"
                    value={formData.sellerId}
                    onChange={handleChange}
                    placeholder="Enter seller ID"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-red-200
                    "
                  />

                </div>


                {/* Tracking Number */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tracking Number
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="text"
                    name="trackingNumber"
                    value={formData.trackingNumber}
                    onChange={handleChange}
                    placeholder="e.g. DL123456789"
                    className={`
                      w-full
                      border
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      ${
                        errors.trackingNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                  />

                  {errors.trackingNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.trackingNumber}
                    </p>
                  )}

                </div>


                {/* Carrier */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Carrier
                    <span className="text-red-500"> *</span>
                  </label>

                  <select
                    name="carrier"
                    value={formData.carrier}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-red-200
                      bg-white
                    "
                  >

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


                {/* Status */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shipment Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-red-200
                      bg-white
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

                </div>


                {/* Estimated Delivery */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estimated Delivery
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="date"
                    name="estimatedDelivery"
                    value={formData.estimatedDelivery}
                    onChange={handleChange}
                    className={`
                      w-full
                      border
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      ${
                        errors.estimatedDelivery
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                  />

                  {errors.estimatedDelivery && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.estimatedDelivery}
                    </p>
                  )}

                </div>

              </div>

            </div>

          </div>


          {/* ================= SHIPPING ADDRESS ================= */}

          <div className="bg-white border rounded-xl">

            <div className="px-5 py-4 border-b">

              <h2 className="text-lg font-bold text-gray-900">
                Shipping Address
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Enter the customer's delivery address
              </p>

            </div>


            <div className="p-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Customer Name */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Name
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    className={`
                      w-full
                      border
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      ${
                        errors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                  />

                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name}
                    </p>
                  )}

                </div>


                {/* Phone */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter 10 digit phone"
                    className={`
                      w-full
                      border
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      ${
                        errors.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                  />

                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone}
                    </p>
                  )}

                </div>


                {/* Address */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                    <span className="text-red-500"> *</span>
                  </label>

                  <textarea
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number, street, area..."
                    className={`
                      w-full
                      border
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      resize-none
                      focus:ring-2
                      ${
                        errors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                  />

                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}

                </div>


                {/* City */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className={`
                      w-full
                      border
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      ${
                        errors.city
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                  />

                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city}
                    </p>
                  )}

                </div>


                {/* State */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className={`
                      w-full
                      border
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      ${
                        errors.state
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                  />

                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.state}
                    </p>
                  )}

                </div>


                {/* Pincode */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    placeholder="6 digit pincode"
                    className={`
                      w-full
                      border
                      rounded-lg
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      ${
                        errors.pincode
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                    `}
                  />

                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pincode}
                    </p>
                  )}

                </div>

              </div>

            </div>

          </div>


          {/* ================= ACTIONS ================= */}

          <div className="bg-white border rounded-xl p-5">

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

              <button
                type="button"
                onClick={handleCancel}
                className="
                  w-full
                  sm:w-auto
                  px-6
                  py-3
                  rounded-lg
                  border
                  border-gray-300
                  text-gray-700
                  font-semibold
                  hover:bg-gray-100
                "
              >
                Cancel
              </button>


              <button
                type="submit"
                className="
                  w-full
                  sm:w-auto
                  px-6
                  py-3
                  rounded-lg
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  font-semibold
                "
              >
                Create Shipment
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
    )
}



export default AddShipment;