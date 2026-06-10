import React from "react";
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

const bookings = [
  {
    id: "#CB-92831",
    time: "10:45 AM, 24/05",
    customer: "Nguyễn Hữu An",
    phone: "0901234xxx",
    initials: "NH",
    movie: "Dune: Part Two (IMAX)",
    show: "Cinema Q1 • 20:30",
    seats: ["J12", "J13"],
    total: "320.000đ",
    status: "Đã thanh toán",
    note: "Hoàn tất đơn",
    tone: "paid"
  },
  {
    id: "#CB-92832",
    time: "11:12 AM, 24/05",
    customer: "Lê Minh Tuấn",
    phone: "0988776xxx",
    initials: "MT",
    movie: "Oppenheimer",
    show: "Cinema Thủ Đức • 14:00",
    seats: ["F05 (VIP)"],
    total: "150.000đ",
    status: "Chờ thanh toán",
    note: "Đang xử lý",
    tone: "pending"
  },
  {
    id: "#CB-92833",
    time: "09:00 AM, 24/05",
    customer: "Phạm Văn Nam",
    phone: "0345678xxx",
    initials: "PV",
    movie: "Godzilla x Kong",
    show: "Cinema Q1 • 19:15",
    seats: ["A01"],
    total: "95.000đ",
    status: "Đã hủy",
    note: "Đang hoàn tiền",
    tone: "cancelled"
  }
];

function BookingManagementPage() {
  return (
    <div className="admin-shell">
      <BookingSidebar />
      <div className="admin-workspace">
        <BookingTopbar />
        <main className="booking-admin-main">
          <section className="booking-heading">
            <h1>Quản lý đặt vé</h1>
            <p>Theo dõi và xử lý các đơn hàng vé trực tuyến</p>
          </section>

          <section className="booking-filter-grid">
            <label className="wide">
              <span>Tìm kiếm đơn hàng</span>
              <div>
                <Search size={18} />
                <input placeholder="Mã đơn hàng, tên khách..." />
              </div>
            </label>
            <label>
              <span>Rạp chiếu</span>
              <select defaultValue="all">
                <option value="all">Tất cả các rạp</option>
                <option>CineVe Quận 1</option>
                <option>CineVe Thủ Đức</option>
              </select>
            </label>
            <label>
              <span>Phim</span>
              <select defaultValue="all">
                <option value="all">Tất cả phim</option>
                <option>Dune: Part Two</option>
                <option>Oppenheimer</option>
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
            <BookingStat label="Tổng đơn hôm nay" value="128" meta="+12%" tone="red" trend="up" />
            <BookingStat label="Doanh thu ngày" value="24.5M" meta="+5.2%" tone="gold" trend="up" />
            <BookingStat label="Đang chờ xác nhận" value="14" meta="Thao tác nhanh" tone="silver" />
            <BookingStat label="Đã hủy/Hoàn tiền" value="3" meta="-2%" tone="danger" trend="down" />
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
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
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
                        <BookingActions tone={booking.tone} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="booking-pagination">
              <p>Hiển thị <strong>1-10</strong> trong số <strong>1,248</strong> đơn hàng</p>
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

function BookingActions({ tone }) {
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
        <button className="confirm" type="button"><Check size={14} /> Xác nhận</button>
        <button type="button" aria-label="Hủy đơn"><X size={17} /></button>
      </div>
    );
  }

  return (
    <div className="booking-actions">
      <button className="refund" type="button">Hoàn tiền</button>
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

export default BookingManagementPage;
