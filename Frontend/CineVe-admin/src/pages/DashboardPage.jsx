import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
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
  Users,
  Wallet,
  Warehouse
} from "lucide-react";
import { adminBookingApi, adminDashboardApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import {
  asArray,
  bookingStatusLabel,
  bookingTone,
  formatCompactCurrency,
  formatCurrency,
  formatDateTime,
  getInitials,
  toAbsoluteImage
} from "../api/formatters";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard", active: true },
  { label: "Phim", icon: Film, to: "/movies" },
  { label: "Rạp", icon: Warehouse, to: "/cinemas" },
  { label: "Phòng chiếu", icon: Clapperboard, to: "/rooms" },
  { label: "Lịch chiếu", icon: CalendarDays, to: "/showtimes" },
  { label: "Đặt vé", icon: Ticket, to: "/bookings" },
  { label: "Đồ ăn/Combo", icon: Popcorn, to: "/foods" },
  { label: "Mã giảm giá", icon: Ticket, to: "/promotions" }
];

const fallbackRevenueBars = [
  { day: "Thứ 2", value: "140M", height: 40 },
  { day: "Thứ 3", value: "210M", height: 65 },
  { day: "Thứ 4", value: "180M", height: 50 },
  { day: "Thứ 5", value: "320M", height: 85, active: true },
  { day: "Thứ 6", value: "195M", height: 60 },
  { day: "Thứ 7", value: "245M", height: 75 },
  { day: "Chủ nhật", value: "380M", height: 95 }
];

const fallbackTopMovies = [
  {
    title: "Chưa có dữ liệu",
    revenue: "0đ",
    percent: 12,
    tone: "red",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=320&q=85"
  }
];

const fallbackOrders = [
  { id: "--", customer: "Chưa có dữ liệu", initials: "--", movie: "--", cinema: "--", total: "0đ", status: "--", tone: "pending" }
];

function DashboardPage() {
  const [summary, setSummary] = useState({});
  const [revenueBars, setRevenueBars] = useState(fallbackRevenueBars);
  const [topMovies, setTopMovies] = useState(fallbackTopMovies);
  const [orders, setOrders] = useState(fallbackOrders);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const [summaryData, revenueData, topMovieData, bookingData] = await Promise.all([
          adminDashboardApi.summary(),
          adminDashboardApi.revenueByDay(),
          adminDashboardApi.topMovies({ limit: 5 }),
          adminBookingApi.list()
        ]);

        if (!mounted) return;

        setSummary(summaryData || {});
        setRevenueBars(mapRevenueBars(revenueData));
        setTopMovies(mapTopMovies(topMovieData));
        setOrders(mapRecentOrders(bookingData));
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => mapSummaryStats(summary), [summary]);

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="dashboard-main">
          <header className="dashboard-heading">
            <div>
              <h1>Dashboard</h1>
              <p>{loading ? "Đang tải dữ liệu..." : "Tổng quan hoạt động của hệ thống"}</p>
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
            <RevenueChart revenueBars={revenueBars} />
            <TopMovies topMovies={topMovies} />
          </section>

          <RecentOrders orders={orders} />
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

function RevenueChart({ revenueBars }) {
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

function TopMovies({ topMovies }) {
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

function RecentOrders({ orders }) {
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
              <tr key={`${order.id}-${order.customer}`}>
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

function mapSummaryStats(summary = {}) {
  return [
    { label: "Tổng phim", value: String(summary.totalMovies ?? 0), change: "+0%", tone: "up", icon: Film },
    { label: "Người dùng", value: String(summary.totalUsers ?? 0), change: "+0%", tone: "up", icon: Users },
    { label: "Tổng đơn hàng", value: String(summary.totalBookings ?? 0), change: "+0%", tone: "up", icon: ShoppingCart },
    {
      label: "Doanh thu (VND)",
      value: formatCompactCurrency(summary.totalRevenue),
      change: "+0%",
      tone: "up",
      icon: Wallet,
      highlight: true
    },
    { label: "Vé đã bán", value: String(summary.totalTicketsSold ?? 0), change: "+0%", tone: "up", icon: Ticket }
  ];
}

function mapRevenueBars(data) {
  const items = asArray(data).slice(-7);
  if (!items.length) return fallbackRevenueBars;

  const max = Math.max(...items.map((item) => Number(item.revenue ?? 0)), 1);

  return items.map((item, index) => ({
    day: formatDayLabel(item.date),
    value: formatCompactCurrency(item.revenue),
    height: Math.max(12, Math.round((Number(item.revenue ?? 0) / max) * 95)),
    active: index === items.length - 1
  }));
}

function mapTopMovies(data) {
  const items = asArray(data);
  if (!items.length) return fallbackTopMovies;

  const max = Math.max(...items.map((item) => Number(item.seatRevenue ?? 0)), 1);
  const tones = ["red", "gold", "silver", "red", "gold"];

  return items.map((item, index) => ({
    title: item.movieTitle || "--",
    revenue: formatCompactCurrency(item.seatRevenue),
    percent: Math.max(8, Math.round((Number(item.seatRevenue ?? 0) / max) * 100)),
    tone: tones[index % tones.length],
    image: toAbsoluteImage(item.posterUrl)
  }));
}

function mapRecentOrders(data) {
  const items = asArray(data).slice(0, 6);
  if (!items.length) return fallbackOrders;

  return items.map((item) => ({
    id: item.code || item.id || "--",
    customer: item.userFullName || item.userEmail || "--",
    initials: getInitials(item.userFullName || item.userEmail),
    movie: item.showtime?.movieTitle || "--",
    cinema: item.showtime?.cinemaName || "--",
    total: formatCurrency(item.totalAmount),
    status: bookingStatusLabel(item.status),
    tone: bookingTone(item.status),
    time: formatDateTime(item.createdAt)
  }));
}

function formatDayLabel(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(date);
}

export default DashboardPage;
