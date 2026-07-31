const DashboardPage = () => {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#b68a3b] to-[#906e30] text-white text-3xl font-semibold px-8 py-6 rounded-xl shadow-lg mb-6">
        Admin Dashboard
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-[#1c1c1c] mb-3">Total Users</h2>
          <p className="text-4xl font-bold text-[#b68a3b]">0</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Products</h2>
          <p className="text-4xl font-bold text-purple-700">0</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Pending Orders</h2>
          <p className="text-4xl font-bold text-purple-700">0</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
