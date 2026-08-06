import React, { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";

const SavedAdresses = () => {

    const [selectedAddress, setSelectedAddress] = useState(1);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addUpdateBtnName, setAddUpdateBtnName] = useState("Add Address");

    const { register, handleSubmit, reset, } = useForm();

    const addresses = [
        {
            id: 1,
            name: "Nilesh Kumar",
            mobile: "9876543210",
            address:
                "House No. 221, Sector 14, Gurugram, Haryana - 122001",
            type: "Home",
            default: true,
        },
        {
            id: 2,
            name: "Nilesh Kumar",
            mobile: "9876543210",
            address:
                "DLF Cyber City, Phase 2, Gurugram, Haryana - 122002",
            type: "Office",
            default: false,
        },
    ];


    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        address: "",
        type: "",
        default: false,
    });

    const handleEdit = (address) => {
        setAddUpdateBtnName("Update Address");
        setEditingAddress(address);
        setSelectedAddress(0);
        console.log("Editing address:", selectedAddress);

        reset({
            name: address.name,
            mobile: address.mobile,
            address: address.address,
            type: address.type,
            default: address.default,
        });
    };

    const handlechange = () => {
        setEditingAddress(null);
    };


    const AddAddress = () => {
        setSelectedAddress(0);  
        setAddUpdateBtnName("Add Address");
        setEditingAddress({});
            reset({
            name: "",
            mobile: "",
            address: "",
            type: "Home",
            default: false,
            });
    }


    const onSubmit = (data) => {

        if(editingAddress?.id) {
            console.log("Updated address:", data);
        }
        else {
            console.log("New address:", data);
        }

        console.log(data);
    };


    return (
        <div className="container px-4 mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Saved Addresses
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your delivery addresses.
                    </p>
                </div>

                <button onClick={AddAddress} className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 transition">
                    <Plus size={18} />
                    Add New Address
                </button>
            </div>

            {/* Address Cards */}
            <div className="grid md:grid-cols-2 gap-6">

                {selectedAddress !== 0 && (

                    <>
                        {addresses.map((item) => (
                            <div
                                key={item.id}
                                className={`rounded-xl border bg-white   p-6 shadow-sm transition cursor-pointer ${selectedAddress === item.id
                                    ? "border-green-500 ring-0.5 ring-green-500"
                                    : "border-gray-200 hover:shadow-lg"
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            name="selectedAddress"
                                            checked={selectedAddress === item.id}
                                            onChange={() => { setSelectedAddress(item.id); handlechange(); }}
                                            className="mt-1 h-5 w-5 accent-black"
                                        />

                                        <div>
                                            <h3 className="text-lg font-semibold">{item.name}</h3>
                                            <p className="text-gray-600">{item.mobile}</p>
                                        </div>
                                    </div>

                                    {item.default && (
                                        <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                            <CheckCircle size={14} />
                                            Default
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 flex items-start gap-3">
                                    <MapPin className="text-gray-400 mt-1" size={18} />

                                    <div>
                                        <p className="text-gray-700">{item.address}</p>

                                        <span className="inline-block mt-3 text-xs bg-gray-100 px-3 py-1 rounded-full">
                                            {item.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-6">
                                    <button onClick={() => handleEdit(item)} className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100">
                                        <Pencil size={16} />
                                        Edit
                                    </button>

                                    <button className="flex items-center gap-2 border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50">
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                    </>
                )}
            </div>

            {editingAddress && (
                <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl  bg-white p-6 shadow-md grid grid-cols-1 md:grid-cols-1 gap-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input
                            {...register("name")}
                            className="w-full border rounded-lg p-3"
                            placeholder="Full Name"
                        />

                        <input
                            {...register("mobile")}
                            className="w-full border rounded-lg p-3 "
                            placeholder="Mobile"
                        />
                    </div>

                    <textarea
                        {...register("address")}
                        className="w-full border rounded-lg p-3 mt-4"
                        rows={4}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <select
                            {...register("type")}
                            className="w-full border rounded-lg p-3 mt-4"
                        >
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                        </select>

                        <label className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                {...register("default")}
                            />
                            Default Address
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <button
                            type="submit"
                            className="mt-5 bg-green-600 font-bold text-white px-6 py-3 rounded-lg"
                        >
                            {addUpdateBtnName}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setEditingAddress(null); setSelectedAddress(1); }}
                            className="mt-5 ml-3 bg-[#cccccc] font-bold text-[#000000] px-6 py-3 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SavedAdresses;