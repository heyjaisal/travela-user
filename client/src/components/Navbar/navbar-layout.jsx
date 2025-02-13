import { Outlet } from "react-router-dom";
import AdminNavbar from "./navbar";

const AdminDashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AdminNavbar />
        <div className="flex-auto bg-lightBg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
