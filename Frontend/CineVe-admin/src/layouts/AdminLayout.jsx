import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import AdminTopbar from "../components/admin/AdminTopbar.jsx";

function AdminLayout() {
  return (
    <div className="admin-shell admin-layout">
      <AdminSidebar />
      <div className="admin-workspace admin-layout-workspace">
        <AdminTopbar />
        <div className="admin-layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
