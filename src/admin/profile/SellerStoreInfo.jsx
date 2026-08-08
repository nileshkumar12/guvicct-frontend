import React, { useState } from "react";

const SellerStoreInfo = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    sellerName: "",
    email: "",
    phone: "",
    category: "",
    gstin: "",
    pan: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    openingTime: "",
    closingTime: "",
    storeLogo: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      storeLogo: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Store Information:", formData);

    // API call here
  };

  const handleCancel = () => {
    setFormData({
      storeName: "",
      storeDescription: "",
      sellerName: "",
      email: "",
      phone: "",
      category: "",
      gstin: "",
      pan: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      openingTime: "",
      closingTime: "",
      storeLogo: null,
    });

    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Store Information
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your store profile and business information
          </p>

        </div>


        <form onSubmit={handleSubmit} className="space-y-6">

          {/* STORE PROFILE */}

          <div className="bg-white border rounded-xl overflow-hidden">

            <div className="px-5 py-4 border-b">

              <h2 className="text-lg font-bold text-gray-900">
                Store Profile
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Basic information about your store
              </p>

            </div>


            <div className="p-5">

              <div className="flex flex-col md:flex-row gap-6">

                {/* LOGO */}

                <div className="flex flex-col items-center">

                  <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">

                    {preview ? (
                      <img
                        src={preview}
                        alt="Store Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">
                        🏪
                      </span>
                    )}

                  </div>

                  <label className="mt-3 cursor-pointer">

                    <span className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800">
                      Upload Logo
                    </span>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                    />

                  </label>

                  <p className="text-xs text-gray-400 mt-2">
                    JPG, PNG or WebP
                  </p>

                </div>


                {/* STORE NAME/DESCRIPTION */}

                <div className="flex-1 space-y-5">

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Name
                    </label>

                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      placeholder="Enter store name"
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
                        focus:border-red-500
                      "
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Store Description
                    </label>

                    <textarea
                      name="storeDescription"
                      value={formData.storeDescription}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell customers about your store..."
                      className="
                        w-full
                        border
                        border-gray-300
                        rounded-lg
                        px-4
                        py-3
                        outline-none
                        resize-none
                        focus:ring-2
                        focus:ring-red-200
                        focus:border-red-500
                      "
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* SELLER INFORMATION */}

          <div className="bg-white border rounded-xl">

            <div className="px-5 py-4 border-b">

              <h2 className="text-lg font-bold">
                Seller Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your contact and business details
              </p>

            </div>


            <div className="p-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seller Name
                  </label>

                  <input
                    type="text"
                    name="sellerName"
                    value={formData.sellerName}
                    onChange={handleChange}
                    placeholder="Enter seller name"
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seller@example.com"
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    maxLength={10}
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Store Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      outline-none bg-white
                      focus:ring-2 focus:ring-red-200
                    "
                  >

                    <option value="">
                      Select Category
                    </option>

                    <option value="fashion">
                      Fashion
                    </option>

                    <option value="electronics">
                      Electronics
                    </option>

                    <option value="home">
                      Home & Kitchen
                    </option>

                    <option value="beauty">
                      Beauty
                    </option>

                    <option value="sports">
                      Sports
                    </option>

                    <option value="grocery">
                      Grocery
                    </option>

                    <option value="other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

            </div>

          </div>


          {/* BUSINESS DETAILS */}

          <div className="bg-white border rounded-xl">

            <div className="px-5 py-4 border-b">

              <h2 className="text-lg font-bold">
                Business Details
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Legal and tax information
              </p>

            </div>


            <div className="p-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GSTIN
                  </label>

                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="Enter GSTIN"
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      uppercase outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PAN Number
                  </label>

                  <input
                    type="text"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    placeholder="Enter PAN number"
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      uppercase outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>

              </div>

            </div>

          </div>


          {/* STORE ADDRESS */}

          <div className="bg-white border rounded-xl">

            <div className="px-5 py-4 border-b">

              <h2 className="text-lg font-bold">
                Store Address
              </h2>

            </div>


            <div className="p-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter complete business address"
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      resize-none outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    placeholder="Enter pincode"
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>

              </div>

            </div>

          </div>


          {/* BUSINESS HOURS */}

          <div className="bg-white border rounded-xl">

            <div className="px-5 py-4 border-b">

              <h2 className="text-lg font-bold">
                Business Hours
              </h2>

            </div>


            <div className="p-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Opening Time
                  </label>

                  <input
                    type="time"
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleChange}
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>


                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Closing Time
                  </label>

                  <input
                    type="time"
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleChange}
                    className="
                      w-full border border-gray-300
                      rounded-lg px-4 py-3
                      outline-none
                      focus:ring-2 focus:ring-red-200
                    "
                  />

                </div>

              </div>

            </div>

          </div>


          {/* ACTIONS */}

          <div className="bg-white border rounded-xl p-5">

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">

              <button
                type="button"
                onClick={handleCancel}
                className="
                  w-full sm:w-auto
                  px-6 py-3
                  rounded-lg
                  border border-gray-300
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
                  w-full sm:w-auto
                  px-6 py-3
                  rounded-lg
                  bg-red-500
                  text-white
                  font-semibold
                  hover:bg-red-600
                "
              >
                Save Store Information
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default SellerStoreInfo;