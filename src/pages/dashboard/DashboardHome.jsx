import React from 'react';
import {Link} from "react-router-dom";


const DashboardHome = () => {
  return (
    
    <div className="max-w-7xl mx-auto px-4 py-10">
       <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
      <p className="text-gray-500 mt-2">Manage your account settings and orders</p>
    </div>


    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

   
        <Link to="/dashboard/profile">
        
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer border">
        <div className="text-5xl mb-4">👤</div>
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <p className="text-gray-500 mt-2">Update your personal information.</p>
      </div>
      </Link>
     
       <Link to="/dashboard/orders">
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer border">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-semibold">My Orders</h2>
            <p className="text-gray-500 mt-2">Track and manage your orders.</p>
        </div>
      </Link>

    <Link to="/dashboard/changepassword">
     <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer border">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold">Change Password</h2>
        <p className="text-gray-500 mt-2">Keep your account secure.</p>
      </div>    
  </Link>
     


      <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer border">
        <div className="text-5xl mb-4">📍</div>
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <p className="text-gray-500 mt-2">Manage your delivery addresses.</p>
      </div>

     
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer border">
        <div className="text-5xl mb-4">🎁</div>
        <h2 className="text-xl font-semibold">Coupons</h2>
        <p className="text-gray-500 mt-2">View available and applied coupons.</p>
      </div>

     
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer border">
        <div className="text-5xl mb-4">💳</div>
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <p className="text-gray-500 mt-2">Manage your payment options.</p>
      </div>

      
      

     
     

   
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer border">
        <div className="text-5xl mb-4">🔔</div>
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="text-gray-500 mt-2">Manage email and SMS preferences.</p>
      </div>

      

    </div>

  </div>
  );
};

export default DashboardHome;