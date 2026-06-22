import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Eye,
  Film,
  Filter,
  LayoutDashboard,
  LogOut,
  MapPin,
  MoreVertical,
  Popcorn,
  Printer,
  Search,
  Settings,
  Ticket,
  TrendingDown,
  TrendingUp,
  Warehouse,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { adminBookingApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import { asArray, bookingStatusLabel, bookingTone, formatCompactCurrency, formatCurrency, formatDateTime, getInitials } from "../api/formatters";

function BookingManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await adminBookingApi.list();
      setBookings(asArray(data).map(mapBooking));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const visibleBookings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return bookings;
    return bookings.filter((booking) =>
      [booking.id, booking.customer, booking.movie].join(" ").toLowerCase().includes(normalized)
    );
  }, [bookings, query]);

  const stats = useMemo(() => {
    const revenue = bookings.reduce((sum, item) => sum + Number(item.rawTotal || 0), 0);
    return {
      total: bookings.length,
      revenue,
      pending: bookings.filter((item) => item.rawStatus === "PENDING").length,
      cancelled: bookings.filter((item) => item.rawStatus === "CANCELLED").length
    };
  }, [bookings]);

  const handleAction = async (booking, action) => {
    try {
      if (action === "confirm") await adminBookingApi.confirm(booking.rawId);
      if (action === "cancel") await adminBookingApi.cancel(booking.rawId);
      if (action === "refund") await adminBookingApi.refund(booking.rawId);
      toast.success("Thao tác thành công");
      loadBookings();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="booking-admin-main">
          <section className="booking-heading">
            <h1>Quản lý đặt vé</h1>
            <p>{loading ? "Đang tải dữ liệu..." : "Theo dõi và xử lý các đơn hàng vé trực tuyến"}</p>
          </section>

          <section className="booking-filter-grid">
            <label className="wide">
              <span>Tìm kiếm đơn hàng</span>
              <div>
                <Search size={18} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Mã đơn hàng, tên khách..." />
              </div>
            </label>
            <label>
              <span>Rạp chiếu</span>
              <select defaultValue="all">
                <option value="all">Tất cả các rạp</option>
              </select>
            </label>
            <label>
              <span>Phim</span>
              <select defaultValue="all">
                <option value="all">Tất cả phim</option>
              </select>
            </label>
            <label>
              <span>Ngày chiếu</span>
              <input type="date" />
            </label>
            <button type="button">
              <Filter size={18} />
              Lọc dữ liệu
            </button>
          </section>

          <section className="booking-stat-grid">
            <BookingStat label="Tổng đơn hôm nay" value={stats.total} meta="+0%" tone="red" trend="up" />
            <BookingStat label="Doanh thu ngày" value={formatCompactCurrency(stats.revenue)} meta="+0%" tone="gold" trend="up" />
            <BookingStat label="Đang chờ xác nhận" value={stats.pending} meta="Thao tác nhanh" tone="silver" />
            <BookingStat label="Đã hủy/Hoàn tiền" value={stats.cancelled} meta="-0%" tone="danger" trend="down" />
          </section>

          <section className="booking-table-card">
            <div className="booking-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Phim & Suất chiếu</th>
                    <th>Ghế</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleBookings.length ? visibleBookings.map((booking) => (
                    <tr key={booking.rawId}>
                      <td>
                        <strong className="booking-id">{booking.id}</strong>
                        <span>{booking.time}</span>
                      </td>
                      <td>
                        <div className="booking-customer">
                          <i>{booking.initials}</i>
                          <div>
                            <strong>{booking.customer}</strong>
                            <span>{booking.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{booking.movie}</strong>
                        <span className="booking-show">
                          <MapPin size={14} />
                          {booking.show}
                        </span>
                      </td>
                      <td>
                        <div className="booking-seat-list">
                          {booking.seats.map((seat) => (
                            <span key={seat}>{seat}</span>
                          ))}
                        </div>
                      </td>
                      <td className="booking-total">{booking.total}</td>
                      <td>
                        <div className="booking-status-wrap">
                          <span className={`booking-status ${booking.tone}`}>
                            <i />
                            {booking.status}
                          </span>
                          <small>{booking.note}</small>
                        </div>
                      </td>
                      <td>
                        <BookingActions tone={booking.tone} onAction={(action) => handleAction(booking, action)} />
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7">Chưa có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="booking-pagination">
              <p>Hiển thị <strong>1-{visibleBookings.length}</strong> trong số <strong>{bookings.length}</strong> đơn hàng</p>
              <div>
                <button type="button" disabled><ChevronLeft size={16} /></button>
                <button type="button" className="active">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button"><ChevronRight size={16} /></button>
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}

function BookingStat({ label, value, meta, tone, trend }) {
  return (
    <article className={`booking-stat-card ${tone}`}>
      <span>{label}</span>
      <div>
        <strong>{value}</strong>
        <small>
          {meta}
          {trend === "up" && <TrendingUp size={13} />}
          {trend === "down" && <TrendingDown size={13} />}
        </small>
      </div>
    </article>
  );
}

function BookingActions({ tone, onAction }) {
  if (tone === "paid") {
    return (
      <div className="booking-actions">
        <button type="button" aria-label="Xem chi tiết"><Eye size={17} /></button>
        <button type="button" aria-label="In vé"><Printer size={17} /></button>
      </div>
    );
  }

  if (tone === "pending") {
    return (
      <div className="booking-actions">
        <button className="confirm" type="button" onClick={() => onAction("confirm")}><Check size={14} /> Xác nhận</button>
        <button type="button" aria-label="Hủy đơn" onClick={() => onAction("cancel")}><X size={17} /></button>
      </div>
    );
  }

  return (
    <div className="booking-actions">
      <button className="refund" type="button" onClick={() => onAction("refund")}>Hoàn tiền</button>
      <button type="button" aria-label="Thêm thao tác"><MoreVertical size={17} /></button>
    </div>
  );
}

function BookingSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies" },
    { label: "Rạp", icon: Warehouse, to: "/cinemas" },
    { label: "Phòng chiếu", icon: Clapperboard, to: "/rooms" },
    { label: "Lịch chiếu", icon: CalendarDays, to: "/showtimes" },
    { label: "Đặt vé", icon: Ticket, to: "/bookings", active: true },
    { label: "Đồ ăn/Combo", icon: Popcorn, to: "/foods" },
    { label: "Mã giảm giá", icon: Ticket, to: "/promotions" }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>CineVe</h2>
        <p>Admin Portal</p>
      </div>
      <nav className="admin-nav movie-admin-nav">
        {items.map((item) => (
          <Link className={item.active ? "active" : ""} to={item.to} key={item.label}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="admin-profile-card">
        <span className="admin-letter-avatar">AD</span>
        <div>
          <strong>Admin Quản Trị</strong>
          <span>admin@cineve.vn</span>
        </div>
        <LogOut size={18} />
      </div>
    </aside>
  );
}

function BookingTopbar() {
  return (
    <header className="admin-topbar">
      <label className="admin-search">
        <Search size={18} />
        <input placeholder="Tìm kiếm phim, rạp, lịch chiếu..." />
      </label>
      <div className="admin-topbar-actions">
        <button type="button" aria-label="Thông báo" className="admin-icon-button has-dot"><Bell size={20} /></button>
        <button type="button" aria-label="Cài đặt" className="admin-icon-button"><Settings size={20} /></button>
        <span className="topbar-divider" />
        <div className="admin-greeting">
          <strong>Xin chào, Admin</strong>
          <span>Hệ thống đang ổn định</span>
        </div>
        <span className="booking-top-avatar">AD</span>
      </div>
    </header>
  );
}

function mapBooking(item) {
  return {
    rawId: item.id,
    rawStatus: item.status,
    rawTotal: item.totalAmount,
    id: item.code || item.id || "--",
    time: formatDateTime(item.createdAt),
    customer: item.userFullName || item.userEmail || "--",
    phone: item.userEmail || "--",
    initials: getInitials(item.userFullName || item.userEmail),
    movie: item.showtime?.movieTitle || "--",
    show: `${item.showtime?.cinemaName || "--"} • ${formatDateTime(item.showtime?.startTime)}`,
    seats: asArray(item.seats).map((seat) => seat.seatCode || seat.code || "--"),
    total: formatCurrency(item.totalAmount),
    status: bookingStatusLabel(item.status),
    note: item.payment?.status || "--",
    tone: bookingTone(item.status)
  };
}

export default BookingManagementPage;
