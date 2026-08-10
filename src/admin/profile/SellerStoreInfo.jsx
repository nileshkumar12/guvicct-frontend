import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL, getImageUrl, uploadImageToCloudinary } from "../../utils/config";
import { convertToTimeInput } from "../../utils/timeConverter";
const initialFormData = {
  storeName: "",
  slug: "",
  logo: "",
  banner: "",
  description: "",
  phone: "",
  email: "",

  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  },
  gstNumber: "",
  category: "",
  panNumber: "",
  openingTime: "",
  closingTime: "",
  sellerName: "",
};

const SellerStoreInfo = ({ mode }) => {
  const [addressText, setAddressText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isAddMode = mode === "add" || location.pathname.includes("/addsellerstore");
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(!isAddMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isAddMode) {

      setFormData(initialFormData);

      setPreview(null);
      return;
    }

    const fetchStoreInfo = async () => {
      const token = localStorage.getItem("token");

      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/stores/me`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error("No store found yet");
        }

        const data = await response.json();
        const store = data.store || data;

        const nextFormData = {
          ...initialFormData,
          storeName: store.storeName || "",
          slug: store.slug || "",
          logo: store.logo || "",
          banner: store.banner || "",
          description: store.description || "",
          phone: store.phone || "",
          email: store.email || "",
          address: store.address || "",
          gstNumber: store.gstNumber || "",
          category: store.category || "",
          panNumber: store.panNumber || "",
          openingTime: convertToTimeInput(store?.openingTime),
          closingTime: convertToTimeInput(store?.closingTime),
          sellerName: store.owner?.name || store.sellerName || "",
          city: store.city || "",
          state: store.state || "",
          pincode: store.pincode || "",
        };

        setFormData(nextFormData);

        setPreview(store.logo ? getImageUrl(store.logo) : null);
      } catch (err) {
        console.error(err);
        setError("Unable to load your store information right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreInfo();
    console.log(formData);
  }, [isAddMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    try {
      setIsSaving(true);
      const uploadedUrl = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, logo: uploadedUrl }));
      setPreview(getImageUrl(uploadedUrl));
      setError("");
    } catch (err) {
      setError(err.message || "Unable to upload the logo right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.storeName.trim()) {
      setError("Store name is required.");
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const payload = {
        storeName: formData.storeName,
        slug: formData.slug,
        logo: formData.logo || "",
        banner: formData.banner || "",
        description: formData.description,
        phone: formData.phone,
        email: formData.email,

        address: {
          street: formData.address?.street || "",
          city: formData.address?.city || "",
          state: formData.address?.state || "",
          country: formData.address?.country || "",
          pincode: formData.address?.pincode || "",
        },

        gstNumber: formData.gstNumber,
        category: formData.category,
        panNumber: formData.panNumber,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        sellerName: formData.sellerName,
      };

      const response = await fetch(`${API_URL}/api/stores${isAddMode ? "" : "/me"}`, {
        method: isAddMode ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let parsedResponse = responseText;

      try {
        parsedResponse = JSON.parse(responseText);
      } catch (err) {
        // Ignore JSON parse errors and use the plain text response
      }

      if (!response.ok) {
        throw new Error(parsedResponse?.message || "Unable to save your store information.");
      }

      setSuccess(isAddMode ? "Store created successfully." : "Store updated successfully.");
      setTimeout(() => navigate("/admin/adminprofile"), 800);
    } catch (err) {
      setError(err.message || "Unable to save your store information.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    navigate("/admin/adminprofile");
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {isAddMode ? "Add Store Information" : "Edit Store Information"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isAddMode
              ? "Create your store profile and business information"
              : "Update your store profile and business information"}
          </p>
      </div>
          
            <div className=" justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full mr-3 sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving || isLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {isSaving ? "Saving..." : isAddMode ? "Create Store Information" : "Save Store Information"}
              </button>
           
          </div>
</div>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">Store Profile</h2>
              <p className="text-sm text-gray-500 mt-1">Basic information about your store</p>
            </div>

            <div className="p-5">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {preview ? (
                      <img src={preview} alt="Store Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🏪</span>
                    )}
                  </div>

                  <label className="mt-3 cursor-pointer">
                    <span className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800">
                      {isSaving ? "Uploading..." : "Upload Logo"}
                    </span>
                    <input
                      type="file"
                      name="logo"
                      onChange={handleLogoChange}
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"

                    />
                  </label>

                  <p className="text-xs text-gray-400 mt-2">JPG, PNG or WebP</p>
                </div>

                <div className="flex-1 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName ?? ""}
                      onChange={handleChange}
                      placeholder="Enter store name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Store Description</label>
                    <textarea
                      name="description"
                      value={formData.description ?? ""}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell customers about your store..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl">
            <div className="px-5 py-4 border-b">
              <h2 className="text-lg font-bold">Seller Information</h2>
              <p className="text-sm text-gray-500 mt-1">Your contact and business details</p>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Seller Name</label>
                  <input
                    type="text"
                    name="sellerName"
                    value={formData.sellerName ?? ""}
                    onChange={handleChange}
                    placeholder="Enter seller name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email ?? ""}
                    onChange={handleChange}
                    placeholder="seller@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone ?? ""}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    maxLength={10}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Store Category</label>
                  <select
                    name="category"
                    value={formData.category ?? ""}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none bg-white focus:ring-2 focus:ring-red-200"
                  >
                    <option value="">Select Category</option>
                    <option value="Fashion & Clothing">Fashion & Clothing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Sports">Sports</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Gift & Souvenir">Gift & Souvenir</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>




          <div className="bg-white border rounded-xl">
            <div className="px-5 py-4 border-b">
              <h2 className="text-lg font-bold">Business Details</h2>
              <p className="text-sm text-gray-500 mt-1">Legal and tax information</p>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">GSTIN</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber ?? ""}
                    onChange={handleChange}
                    placeholder="Enter GSTIN"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 uppercase outline-none focus:ring-2 focus:ring-red-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber ?? ""}
                    onChange={handleChange}
                    placeholder="Enter PAN number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 uppercase outline-none focus:ring-2 focus:ring-red-200"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl">
            <div className="px-5 py-4 border-b">
              <h2 className="text-lg font-bold">Store Address</h2>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Street</label>
                  <textarea
                    name="street"
                    value={formData?.address?.street}
                    onChange={handleAddressChange}
                    rows="3"
                    required
                    placeholder="Enter complete business address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData?.address?.city ?? ""}
                    onChange={handleAddressChange}
                    placeholder="Enter city"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData?.address?.state ?? ""}
                    required
                    onChange={handleAddressChange}
                    placeholder="Enter state"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData?.address?.pincode ?? ""}
                    required
                    onChange={handleAddressChange}
                    maxLength={6}
                    placeholder="Enter pincode"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl">
            <div className="px-5 py-4 border-b">
              <h2 className="text-lg font-bold">Business Hours</h2>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Time</label>
                  <input
                    type="time"
                    name="openingTime"
                    required
                    value={formData?.openingTime ?? ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Closing Time</label>
                  <input
                    type="time"
                    name="closingTime"
                    required
                    value={formData?.closingTime ?? ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-200"
                  />
                </div>
              </div>
            </div>
          </div>

         
        </form>
      </div>
    </div>
  );
};

export default SellerStoreInfo;