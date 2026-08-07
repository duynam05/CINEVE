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
  Settings,
  Ticket,
  TrendingDown,
  TrendingUp,
  Warehouse,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { adminBookingApi, adminMovieApi, adminCinemaApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import { asArray, bookingStatusLabel, bookingTone, formatCompactCurrency, formatCurrency, formatDateTime, getInitials } from "../api/formatters";

function BookingManagementPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [filters, setFilters] = useState({ movieId: "all", cinemaId: "all", date: "", status: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadData = async () => {
    try {
      const [moviesData, cinemasData] = await Promise.all([
        adminMovieApi.list(),
        adminCinemaApi.list()
      ]);
      setMovies(asArray(moviesData));
      setCinemas(asArray(cinemasData));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status !== "all") params.status = filters.status;
      // Note: booking API might not support all filters directly, but we can filter client-side or pass what's supported
      const data = await adminBookingApi.list(params);
      setBookings(asArray(data).map(mapBooking));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadBookings();
  }, [filters.status]);

  const visibleBookings = useMemo(() => {
    setCurrentPage(1);
    return bookings.filter((booking) => {
      const matchMovie = filters.movieId === "all" || booking.rawMovieId === filters.movieId;
      const matchCinema = filters.cinemaId === "all" || booking.rawCinemaId === filters.cinemaId;
      const matchDate = !filters.date || booking.rawShowtimeDate === filters.date;
      return matchMovie && matchCinema && matchDate;
    });
  }, [bookings, filters]);

  const stats = useMemo(() => {
    const revenue = bookings.reduce((sum, item) => sum + Number(item.rawTotal || 0), 0);
    return {
      total: bookings.length,
      revenue,
      pending: bookings.filter((item) => item.rawStatus === "PENDING").length,
      cancelled: bookings.filter((item) => item.rawStatus === "CANCELLED").length
    };
  }, [bookings]);

  const totalPages = Math.ceil(visibleBookings.length / pageSize) || 1;
  const currentBookings = useMemo(() => {
    return visibleBookings.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [visibleBookings, currentPage]);

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
            <label>
              <span>Rạp chiếu</span>
              <select value={filters.cinemaId} onChange={(e) => setFilters({ ...filters, cinemaId: e.target.value })}>
                <option value="all">Tất cả các rạp</option>
                {cinemas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label>
              <span>Phim</span>
              <select value={filters.movieId} onChange={(e) => setFilters({ ...filters, movieId: e.target.value })}>
                <option value="all">Tất cả phim</option>
                {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </label>
            <label>
              <span>Trạng thái</span>
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="all">Tất cả trạng thái</option>
                <option value="PENDING">Chờ thanh toán</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="COMPLETED">Đã hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </label>
            <label>
              <span>Ngày chiếu</span>
              <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
            </label>
            <button type="button" onClick={loadBookings}>
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
                  {currentBookings.length ? currentBookings.map((booking) => (
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
              <p>Hiển thị <strong>{currentBookings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, visibleBookings.length)}</strong> trong số <strong>{visibleBookings.length}</strong> đơn hàng</p>
              <div>
                <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}><ChevronLeft size={16} /></button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} type="button" className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}><ChevronRight size={16} /></button>
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
  const showtimeDate = item.showtime?.startTime ? item.showtime.startTime.split("T")[0] : "";
  return {
    rawId: item.id,
    rawStatus: item.status,
    rawTotal: item.totalAmount,
    rawMovieId: item.showtime?.movieId,
    rawCinemaId: item.showtime?.cinemaId,
    rawShowtimeDate: showtimeDate,
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
