import AdminDashboard from "../AdminDashboard"
import SellerDashboard from "./SellerDashboard"

const DashboardPage = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
    {user && user.role === "seller" ? (
      <SellerDashboard/>
    ) : (
      <AdminDashboard/>
    )}

    </>
  )
}

export default DashboardPage
