import React from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Filter,
  Film,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  Percent,
  PlusCircle,
  Popcorn,
  Search,
  Settings,
  Tag,
  Ticket,
  Warehouse
} from "lucide-react";
import { Link } from "react-router-dom";

const promotions = [
  {
    code: "SUMMER2024",
    name: "Chào hè rực rỡ",
    description: "Ưu đãi cho phim hành động",
    type: "Phần trăm",
    value: "20%",
    minOrder: "200.000đ",
    start: "01/06/2024",
    end: "30/08/2024",
    used: 325,
    limit: 500,
    status: "Hoạt động",
    tone: "active"
  },
  {
    code: "WELCOMEBACK",
    name: "Khách hàng cũ",
    description: "Tri ân khách hàng quay lại",
    type: "Tiền mặt",
    value: "50.000đ",
    minOrder: "150.000đ",
    start: "15/05/2024",
    end: "15/06/2024",
    used: 980,
    limit: 1000,
    status: "Sắp hết",
    tone: "warning"
  },
  {
    code: "LUNAR2024",
    name: "Tết Nguyên Đán",
    description: "Lì xì đầu năm",
    type: "Phần trăm",
    value: "30%",
    minOrder: "0đ",
    start: "01/01/2024",
    end: "28/02/2024",
    used: 500,
    limit: 500,
    status: "Hết hạn",
    tone: "expired"
  }
];

function PromotionManagementPage() {
  return (
    <div className="admin-shell">
      <PromotionSidebar />
      <div className="admin-workspace">
        <PromotionTopbar />
        <main className="promotion-main">
          <section className="promotion-heading">
            <div>
              <h1>Quản lý mã giảm giá</h1>
              <p>Thiết lập các chương trình khuyến mãi và voucher cho hệ thống.</p>
            </div>
            <Link className="promotion-create-button" to="/promotions/new">
              <PlusCircle size={19} />
              Thêm mã mới
            </Link>
          </section>

          <section className="promotion-stats">
            <PromotionStat label="Đang hoạt động" value="12" tone="red" />
            <PromotionStat label="Sắp hết hạn" value="04" tone="gold" />
            <PromotionStat label="Tổng lượt sử dụng" value="1.2k" tone="silver" />
            <PromotionStat label="Tiết kiệm cho khách" value="45.2M" tone="muted" />
          </section>

          <section className="promotion-table-card">
            <header>
              <label className="promotion-search">
                <Search size={18} />
                <input placeholder="Tìm mã hoặc tên chương trình..." />
              </label>
              <div className="promotion-filter-actions">
                <select defaultValue="all">
                  <option value="all">Tất cả trạng thái</option>
                  <option>Đang hoạt động</option>
                  <option>Tạm dừng</option>
                  <option>Hết hạn</option>
                </select>
                <button type="button" aria-label="Lọc">
                  <Filter size={18} />
                </button>
              </div>
            </header>

            <div className="promotion-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Mã code</th>
                    <th>Chương trình</th>
                    <th>Loại</th>
                    <th>Giá trị</th>
                    <th>Đơn tối thiểu</th>
                    <th>Thời gian</th>
                    <th>Sử dụng</th>
                    <th>Trạng thái</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promo) => (
                    <PromotionRow promo={promo} key={promo.code} />
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="promotion-pagination">
              <p>Hiển thị 1-10 trên 45 mã</p>
              <div>
                <button type="button" aria-label="Trang trước">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="active">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button" aria-label="Trang sau">
                  <ChevronRight size={16} />
                </button>
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}

function PromotionStat({ label, value, tone }) {
  return (
    <article className={`promotion-stat ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function PromotionRow({ promo }) {
  const progress = Math.min(100, Math.round((promo.used / promo.limit) * 100));

  return (
    <tr className={promo.tone === "expired" ? "expired" : ""}>
      <td>
        <span className="promotion-code">{promo.code}</span>
      </td>
      <td>
        <strong>{promo.name}</strong>
        <small>{promo.description}</small>
      </td>
      <td>
        <span className={`promotion-type ${promo.type === "Tiền mặt" ? "cash" : "percent"}`}>
          {promo.type}
        </span>
      </td>
      <td className="promotion-value">{promo.value}</td>
      <td className="promotion-min">{promo.minOrder}</td>
      <td>
        <div className="promotion-date-range">
          <span><i className="start" />{promo.start}</span>
          <span><i className="end" />{promo.end}</span>
        </div>
      </td>
      <td>
        <div className="promotion-usage">
          <span>
            <i className={promo.tone} style={{ width: `${progress}%` }} />
          </span>
          <small>{promo.used} / {promo.limit} lượt</small>
        </div>
      </td>
      <td>
        <span className={`promotion-status ${promo.tone}`}>
          <i />
          {promo.status}
        </span>
      </td>
      <td>
        <button className="promotion-more" type="button" aria-label={`Thao tác ${promo.code}`}>
          <MoreVertical size={18} />
        </button>
      </td>
    </tr>
  );
}

function PromotionSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies" },
    { label: "Rạp", icon: Warehouse, to: "/cinemas" },
    { label: "Phòng chiếu", icon: Clapperboard, to: "/rooms" },
    { label: "Lịch chiếu", icon: CalendarDays, to: "/showtimes" },
    { label: "Đặt vé", icon: Ticket, to: "/bookings" },
    { label: "Đồ ăn/Combo", icon: Popcorn, to: "/foods" },
    { label: "Mã giảm giá", icon: Tag, to: "/promotions", active: true }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>CineVe</h2>
        <p>Quản trị hệ thống</p>
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

function PromotionTopbar() {
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
        <span className="booking-top-avatar">AD</span>
      </div>
    </header>
  );
}

export default PromotionManagementPage;
