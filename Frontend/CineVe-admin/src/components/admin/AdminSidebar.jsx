import {
  CalendarDays,
  Clapperboard,
  Film,
  LayoutDashboard,
  Popcorn,
  Tag,
  Ticket,
  Warehouse
} from "lucide-react";
import { NavLink } from "react-router-dom";
import AdminProfileCard from "./AdminProfileCard.jsx";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Phim", icon: Film, to: "/movies" },
  { label: "Rạp", icon: Warehouse, to: "/cinemas" },
  { label: "Phòng chiếu", icon: Clapperboard, to: "/rooms" },
  { label: "Lịch chiếu", icon: CalendarDays, to: "/showtimes" },
  { label: "Đặt vé", icon: Ticket, to: "/bookings" },
  { label: "Đồ ăn/Combo", icon: Popcorn, to: "/foods" },
  { label: "Mã giảm giá", icon: Tag, to: "/promotions" }
];

function AdminSidebar() {
  return (
    <aside className="admin-sidebar shared-admin-sidebar">
      <div className="admin-brand">
        <h2>CineVe</h2>
        <p>Quản trị hệ thống</p>
      </div>

      <nav className="admin-nav movie-admin-nav" aria-label="Menu quản trị">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <AdminProfileCard />
    </aside>
  );
}

export default AdminSidebar;
