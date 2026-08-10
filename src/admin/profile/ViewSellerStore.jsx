import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../utils/config";
const ViewSellerStore = () => {
    const [store, setStore] = useState(null);
    useEffect(() => {

        const fetchStoreData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/stores/me`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });
                const storeData = await response.json();



                setStore(storeData.store);
                console.log(storeData.store)

            } catch (error) {
                console.error("Error fetching store data:", error);
            }
        };

        fetchStoreData();
        console.log(store);

    }, []);



    return (
        <>
{store ? (
        
        <div className="min-h-screen  ">

            <div className="container mx-auto">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Store Information
                        </h1>

                        <p className="text-gray-500 mt-1">
                            View your store and business information
                        </p>
                    </div>

                    <Link
                        to="/admin/editsellerstore"
                        type="button"
                        className="
              w-full sm:w-auto
              bg-red-500
              hover:bg-red-600
              text-white
              font-semibold
              px-6
              py-3
              rounded-lg
              transition
            "
                    >
                     Edit Store Information
                    </Link>

                </div>

                <div className="bg-white border rounded-xl overflow-hidden mb-6">

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



                            <div className="flex-shrink-0">

                                <div className="
                  w-32
                  h-32
                  rounded-xl
                  border
                  overflow-hidden
                  bg-gray-50
                  flex
                  items-center
                  justify-center
                ">

                                    {store?.logo ? (
                                        <img
                                            src={store?.logo}
                                            alt={store?.storeName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-5xl">
                                            🏪
                                        </span>
                                    )}

                                </div>

                            </div>

                            <div className="flex-1">

                                <h3 className="text-2xl font-bold text-gray-900">
                                    {store?.storeName}
                                </h3>

                                <p className="text-gray-500 mt-3 leading-6">
                                    {store?.description || "No store description added."}
                                </p>


                                <div className="mt-4">

                                    <span className="
                    inline-flex
                    bg-red-50
                    text-red-600
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold
                  ">
                                        {store?.category}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="bg-white border rounded-xl mb-6">

                    <div className="px-5 py-4 border-b">

                        <h2 className="text-lg font-bold text-gray-900">
                            Seller Information
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Your contact and seller details
                        </p>

                    </div>
                    <div className="p-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InfoItem
                                label="Seller Name"
                                value={store?.owner?.name}
                            />



                            <InfoItem
                                label="Email Address"
                                value={store?.email}
                            />

                            <InfoItem
                                label="Phone Number"
                                value={store?.phone}
                            />

                            <InfoItem
                                label="Store Category"
                                value={store?.category}
                            />

                        </div>

                    </div>

                </div>




                <div className="bg-white border rounded-xl mb-6">

                    <div className="px-5 py-4 border-b">

                        <h2 className="text-lg font-bold text-gray-900">
                            Business Details
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Legal and tax information
                        </p>

                    </div>


                    <div className="p-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <InfoItem
                                label="GSTIN"
                                value={store?.gstNumber}
                            />

                            <InfoItem
                                label="PAN Number"
                                value={store?.panNumber}
                            />

                        </div>

                    </div>

                </div>




                <div className="bg-white border rounded-xl mb-6">

                    <div className="px-5 py-4 border-b">

                        <h2 className="text-lg font-bold text-gray-900">
                            Store Address
                        </h2>

                    </div>


                    <div className="p-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">



                            <div className="md:col-span-2">

                                <InfoItem
                                    label="Address"
                                    value={store?.address?.street + ", " + store?.address?.city + ", " + store?.address?.state + " - " + store?.address?.country + ", " + store?.address?.pincode}
                                />

                            </div>


                            <InfoItem
                                label="City"
                                value={store?.address.city}
                            />

                            <InfoItem
                                label="State"
                                value={store?.address.state}
                            />

                            <InfoItem
                                label="Pincode"
                                value={store?.address.pincode}
                            />

                        </div>

                    </div>

                </div>



                <div className="bg-white border rounded-xl mb-6">

                    <div className="px-5 py-4 border-b">

                        <h2 className="text-lg font-bold text-gray-900">
                            Business Hours
                        </h2>

                    </div>


                    <div className="p-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <InfoItem
                                label="Opening Time"
                                value={store?.openingTime}
                            />

                            <InfoItem
                                label="Closing Time"
                                value={store?.closingTime}
                            />

                        </div>

                    </div>

                </div>




                <div className="bg-white border rounded-xl p-5">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>

                            <h3 className="font-bold text-gray-900">
                                Store Status
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Your store is currently available to customers.
                            </p>

                        </div>


                        <span className="
              inline-flex
              w-fit
              bg-green-100
              text-green-700
              px-4
              py-2
              rounded-full
              text-sm
              font-semibold
            ">
                            ● {store?.status}
                        </span>

                    </div>

                </div>

            </div>

        </div>
) : (
  <Link
   to="/admin/addsellerstore"
    
    className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Add Store Information
  </Link>
)}
</>

    );
};




const InfoItem = ({ label, value }) => {

    return (
        <div>

            <p className="text-sm font-medium text-gray-500 mb-1">
                {label}
            </p>

            <div className="
        min-h-[46px]
        bg-gray-50
        border
        border-gray-200
        rounded-lg
        px-4
        py-3
        text-gray-900
        font-medium
      ">
                {value || "Not available"}
            </div>

        </div>
    );
};


export default ViewSellerStore;