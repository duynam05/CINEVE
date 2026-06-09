import React from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Clapperboard,
  Film,
  LayoutDashboard,
  MoreVertical,
  Popcorn,
  Search,
  Settings,
  ShoppingCart,
  Ticket,
  UserRound,
  Users,
  Wallet,
  Warehouse
} from "lucide-react";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", active: true },
  { label: "Phim", icon: Film, to: "/movies" },
  { label: "Rạp", icon: Warehouse, to: "/cinemas" },
  { label: "Phòng chiếu", icon: Clapperboard },
  { label: "Lịch chiếu", icon: CalendarDays },
  { label: "Đặt vé", icon: Ticket },
  { label: "Đồ ăn/Combo", icon: Popcorn },
  { label: "Mã giảm giá", icon: Ticket }
];

const stats = [
  { label: "Tổng phim", value: "1,284", change: "+12%", tone: "up", icon: Film },
  { label: "Người dùng", value: "42,509", change: "+8%", tone: "up", icon: Users },
  { label: "Tổng đơn hàng", value: "8,122", change: "-2%", tone: "down", icon: ShoppingCart },
  { label: "Doanh thu (VND)", value: "2.4B", change: "+15%", tone: "up", icon: Wallet, highlight: true },
  { label: "Vé bán hôm nay", value: "1,452", change: "+24%", tone: "up", icon: Ticket }
];

const revenueBars = [
  { day: "Thứ 2", value: "140M", height: 40 },
  { day: "Thứ 3", value: "210M", height: 65 },
  { day: "Thứ 4", value: "180M", height: 50 },
  { day: "Thứ 5", value: "320M", height: 85, active: true },
  { day: "Thứ 6", value: "195M", height: 60 },
  { day: "Thứ 7", value: "245M", height: 75 },
  { day: "Chủ nhật", value: "380M", height: 95 }
];

const topMovies = [
  {
    title: "Avatar: The Way of Water",
    revenue: "850M",
    percent: 85,
    tone: "red",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=320&q=85"
  },
  {
    title: "John Wick: Chapter 4",
    revenue: "720M",
    percent: 72,
    tone: "gold",
    image: "https://images.unsplash.com/photo-1604975701397-6365ccbd028a?auto=format&fit=crop&w=320&q=85"
  },
  {
    title: "Oppenheimer",
    revenue: "680M",
    percent: 68,
    tone: "silver",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=320&q=85"
  },
  {
    title: "The Super Mario Bros.",
    revenue: "600M",
    percent: 60,
    tone: "red",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=320&q=85"
  }
];

const orders = [
  { id: "#CB-9021", customer: "Nguyễn Văn Tú", initials: "NT", movie: "Avatar 2 (3D)", cinema: "CGV Vincom Đồng Khởi", total: "240,000đ", status: "Hoàn tất", tone: "success" },
  { id: "#CB-9022", customer: "Lê Minh Hoàng", initials: "LH", movie: "John Wick 4", cinema: "Galaxy Nguyễn Du", total: "180,000đ", status: "Đang chờ", tone: "pending" },
  { id: "#CB-9023", customer: "Phan Anh", initials: "PA", movie: "Oppenheimer", cinema: "Lotte Cinema Q7", total: "350,000đ", status: "Hoàn tất", tone: "success" },
  { id: "#CB-9024", customer: "Mai Lan", initials: "ML", movie: "Mario Bros", cinema: "BHD Bitexco", total: "120,000đ", status: "Đã hủy", tone: "cancelled" }
];

function DashboardPage() {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-workspace">
        <AdminTopbar />
        <main className="dashboard-main">
          <header className="dashboard-heading">
            <div>
              <h1>Dashboard</h1>
              <p>Tổng quan hoạt động của hệ thống</p>
            </div>
          </header>

          <section className="dashboard-stats">
            {stats.map((item) => (
              <article className={`admin-glass stat-card ${item.highlight ? "highlight" : ""}`} key={item.label}>
                <div className="stat-card-top">
                  <span className="stat-icon">
                    <item.icon size={22} />
                  </span>
                  <strong className={item.tone === "up" ? "trend-up" : "trend-down"}>{item.change}</strong>
                </div>
                <p>{item.label}</p>
                <h2>{item.value}</h2>
              </article>
            ))}
          </section>

          <section className="dashboard-grid">
            <RevenueChart />
            <TopMovies />
          </section>

          <RecentOrders />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>CineVe</h2>
        <p>Quản trị hệ thống</p>
      </div>
      <nav className="admin-nav movie-admin-nav">
        {sidebarItems.map((item) => (
          <Link className={item.active ? "active" : ""} to={item.to || "#"} key={item.label}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="admin-profile-card">
        <img src={adminAvatar} alt="Admin" />
        <div>
          <strong>Admin Name</strong>
          <span>CineVe Admin</span>
        </div>
      </div>
    </aside>
  );
}

function AdminTopbar() {
  return (
    <header className="admin-topbar">
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
          <strong>Xin chào, Admin</strong>
          <span>Hệ thống đang ổn định</span>
        </div>
        <img className="topbar-avatar" src={adminAvatar} alt="Admin" />
      </div>
    </header>
  );
}

function RevenueChart() {
  return (
    <section className="admin-glass revenue-panel">
      <div className="panel-heading">
        <div>
          <h2>Biểu đồ doanh thu</h2>
          <p>Thống kê 7 ngày gần nhất</p>
        </div>
        <select defaultValue="week">
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
        </select>
      </div>
      <div className="revenue-chart">
        <div className="chart-grid-lines" />
        {revenueBars.map((bar) => (
          <div className="chart-bar-wrap" key={bar.day}>
            <strong>{bar.value}</strong>
            <span className={bar.active ? "chart-bar active" : "chart-bar"} style={{ height: `${bar.height}%` }} />
          </div>
        ))}
      </div>
      <div className="chart-days">
        {revenueBars.map((bar) => (
          <span key={bar.day}>{bar.day}</span>
        ))}
      </div>
    </section>
  );
}

function TopMovies() {
  return (
    <section className="admin-glass top-movies-panel">
      <h2>Phim doanh thu cao</h2>
      <div className="top-movie-list">
        {topMovies.map((movie) => (
          <article className="top-movie-item" key={movie.title}>
            <img src={movie.image} alt={movie.title} />
            <div>
              <h3>{movie.title}</h3>
              <span className="movie-progress">
                <span className={movie.tone} style={{ width: `${movie.percent}%` }} />
              </span>
            </div>
            <strong>{movie.revenue}</strong>
          </article>
        ))}
      </div>
      <button className="outline-admin-button" type="button">Xem tất cả báo cáo</button>
    </section>
  );
}

function RecentOrders() {
  return (
    <section className="admin-glass recent-orders">
      <div className="orders-heading">
        <h2>Đơn hàng mới nhất</h2>
        <button type="button">
          Quản lý đơn hàng
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="orders-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Khách hàng</th>
              <th>Phim</th>
              <th>Rạp</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">{order.id}</td>
                <td>
                  <span className="customer-cell">
                    <span>{order.initials}</span>
                    {order.customer}
                  </span>
                </td>
                <td>{order.movie}</td>
                <td className="muted-cell">{order.cinema}</td>
                <td className="strong-cell">{order.total}</td>
                <td>
                  <span className={`status-pill ${order.tone}`}>{order.status}</span>
                </td>
                <td className="action-cell">
                  <button type="button" aria-label={`Mở thao tác ${order.id}`}>
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AdminFooter() {
  return (
    <footer className="admin-footer">
      <strong>CineVe</strong>
      <nav>
        <a href="#about">Về chúng tôi</a>
        <a href="#privacy">Chính sách bảo mật</a>
        <a href="#terms">Điều khoản sử dụng</a>
        <a href="#contact">Liên hệ</a>
        <a href="#cinemas">Hệ thống rạp</a>
      </nav>
      <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao.</p>
    </footer>
  );
}

export default DashboardPage;
