import React from 'react'
import { LayoutDashboard, Globe, Monitor } from "lucide-react";
const AdminHeader = () => {
  return (

    <>
    <div className="min-h-screen bg-gray-100">


      <header className="h-20 bg-white shadow-sm border-b flex items-center px-8">
        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
          <span className="text-4xl font-bold text-purple-700">NK</span>
        </div>
      </header>


      <div className="flex">


        <aside className="w-56 min-h-[calc(100vh-80px)] bg-gradient-to-b from-purple-900 via-purple-700 to-fuchsia-700">

          <div className="py-6 px-3 space-y-3">

            <button className="w-full bg-white rounded py-3 text-purple-700 font-semibold hover:bg-gray-100 transition">
              <div className="flex items-center justify-center gap-2">
                <Globe size={18} />
                Dashboard
              </div>
            </button>

            <button className="w-full bg-white rounded py-3 text-purple-700 font-semibold hover:bg-gray-100 transition">
              <div className="flex items-center justify-center gap-2">
                <Monitor size={18} />
               Products
              </div>
            </button>

            <button className="w-full bg-white rounded py-3 text-purple-700 font-semibold hover:bg-gray-100 transition">
              <div className="flex items-center justify-center gap-2">
                <LayoutDashboard size={18} />
                Registered Users
              </div>
            </button>

          </div>

        </aside>

        <main className="flex-1">

   
          <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-3xl font-semibold px-8 py-4">
           User List
          </div>

    
          <div className="p-5">

            <div className="bg-white shadow rounded">

       
              <div className="flex justify-end p-4">
                <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded">
                  Add User
                </button>
              </div>

              <div className="overflow-x-auto px-4 pb-5">

                <table className="w-full">

                  <thead>

                    <tr className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white">

                      <th className="px-4 py-3">S.No</th>
                      <th>#</th>
                      <th>User Name</th>
                      <th>Email</th>
                     <th>Phone</th>

                    </tr>

                  </thead>

                  <tbody>

                    <tr>

                      <td
                        colSpan="12"
                        className="text-center py-10 text-gray-400"
                      >
                        No Records Found
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
    </>
    
  ) 
}

export default AdminHeader