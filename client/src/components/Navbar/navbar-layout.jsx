import { Outlet } from "react-router-dom";
import UserNavbar from "./navbar";

const AdminDashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <UserNavbar />
        <div className="flex-auto bg-lightBg">
        <main className="mt-14 lg:mt-0 md:mt-0">
          <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
