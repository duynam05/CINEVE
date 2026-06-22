import { Bell, Search, Settings } from "lucide-react";

function getAdminName() {
  try {
    const rawUser = localStorage.getItem("cineve_user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    return user?.fullName || "Admin";
  } catch {
    return "Admin";
  }
}

function AdminTopbar() {
  const adminName = getAdminName();

  return (
    <header className="admin-topbar shared-admin-topbar">
      <label className="admin-search">
        <Search size={18} />
        <input placeholder="Tìm kiếm phim, rạp, lịch chiếu..." />
      </label>

      <div className="admin-topbar-actions">
        <button type="button" aria-label="Thông báo" className="admin-icon-button has-dot">
          <Bell size={20} />
        </button>
        <button type="button" aria-label="Cài đặt" className="admin-icon-button">
          <Settings size={20} />
        </button>
        <span className="topbar-divider" />
        <div className="admin-greeting">
          <strong>Xin chào, {adminName}</strong>
          <span>Hệ thống đang ổn định</span>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
