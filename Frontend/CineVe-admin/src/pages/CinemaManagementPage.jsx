import React from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  DoorOpen,
  Film,
  LayoutDashboard,
  MapPin,
  Pencil,
  PlusCircle,
  Popcorn,
  Search,
  Settings,
  Ticket,
  Trash2,
  Warehouse,
  Wrench
} from "lucide-react";
import { Link } from "react-router-dom";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

const cinemas = [
  {
    code: "C1",
    name: "CineVe Quận 1",
    city: "Hồ Chí Minh",
    address: "123 Lê Lợi, Phường Bến Thành, Quận 1",
    phone: "028 3823 4567",
    status: "Đang hoạt động",
    tone: "active"
  },
  {
    code: "H1",
    name: "CineVe Hoàn Kiếm",
    city: "Hà Nội",
    address: "45 Đinh Tiên Hoàng, Quận Hoàn Kiếm",
    phone: "024 3942 8888",
    status: "Đang hoạt động",
    tone: "active"
  },
  {
    code: "D1",
    name: "CineVe Hải Châu",
    city: "Đà Nẵng",
    address: "99 Bạch Đằng, Quận Hải Châu",
    phone: "023 6388 9999",
    status: "Bảo trì",
    tone: "maintenance"
  },
  {
    code: "C2",
    name: "CineVe Ninh Kiều",
    city: "Cần Thơ",
    address: "01 Đại Lộ Hòa Bình, Quận Ninh Kiều",
    phone: "029 2381 2222",
    status: "Đang hoạt động",
    tone: "active"
  }
];

function CinemaManagementPage() {
  return (
    <div className="admin-shell">
      <CinemaSidebar />
      <div className="admin-workspace">
        <CinemaTopbar />
        <main className="cinema-admin-main">
          <section className="cinema-heading">
            <div>
              <h1>Quản lý rạp</h1>
              <p>Hệ thống chi nhánh và cụm rạp toàn quốc</p>
            </div>
            <button type="button" className="add-cinema-button">
              <PlusCircle size={20} />
              Thêm rạp mới
            </button>
          </section>

          <section className="cinema-stat-grid">
            <CinemaStat icon={CheckCircle2} label="Rạp đang hoạt động" value="22" tone="red" />
            <CinemaStat icon={Building2} label="Thành phố" value="08" tone="gold" />
            <CinemaStat icon={Wrench} label="Đang bảo trì" value="02" tone="danger" />
          </section>

          <CinemaTable />

          <section className="cinema-map-grid">
            <CinemaMapCard
              title="Vị trí rạp Miền Nam"
              meta="12 cơ sở hoạt động • 45 phòng chiếu"
              image="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=900&q=85"
            />
            <CinemaMapCard
              title="Vị trí rạp Miền Bắc"
              meta="8 cơ sở hoạt động • 32 phòng chiếu"
              image="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=900&q=85"
            />
          </section>
        </main>
      </div>
    </div>
  );
}

function CinemaSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies" },
    { label: "Rạp", icon: Warehouse, to: "/cinemas", active: true },
    { label: "Phòng chiếu", icon: Clapperboard, to: "#" },
    { label: "Lịch chiếu", icon: CalendarDays, to: "#" },
    { label: "Đặt vé", icon: Ticket, to: "#" },
    { label: "Đồ ăn/Combo", icon: Popcorn, to: "#" },
    { label: "Mã giảm giá", icon: Ticket, to: "#" }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>CineVe</h2>
        <p>Quản trị viên</p>
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
        <img src={adminAvatar} alt="Admin" />
        <div>
          <strong>Admin Profile</strong>
          <span>Quản trị viên</span>
        </div>
      </div>
    </aside>
  );
}

function CinemaTopbar() {
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
      </div>
    </header>
  );
}

function CinemaStat({ icon: Icon, label, value, tone }) {
  return (
    <article className={`cinema-stat-card ${tone}`}>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <span>
        <Icon size={24} />
      </span>
    </article>
  );
}

function CinemaTable() {
  return (
    <section className="cinema-table-card">
      <div className="cinema-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Tên rạp</th>
              <th>Thành phố</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cinemas.map((cinema) => (
              <tr key={cinema.code}>
                <td>
                  <div className="cinema-name-cell">
                    <span>{cinema.code}</span>
                    <strong>{cinema.name}</strong>
                  </div>
                </td>
                <td>{cinema.city}</td>
                <td className="cinema-address">{cinema.address}</td>
                <td>{cinema.phone}</td>
                <td>
                  <span className={`cinema-status ${cinema.tone}`}>{cinema.status}</span>
                </td>
                <td>
                  <div className="cinema-row-actions">
                    <button type="button" aria-label={`Sửa ${cinema.name}`}><Pencil size={18} /></button>
                    <button type="button" aria-label={`Xem phòng ${cinema.name}`}><DoorOpen size={18} /></button>
                    <button type="button" aria-label={`Xóa ${cinema.name}`}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cinema-pagination">
        <p>Hiển thị 1-4 trên 24 rạp</p>
        <div>
          <button type="button"><ChevronLeft size={18} /></button>
          <button className="active" type="button">1</button>
          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button"><ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

function CinemaMapCard({ title, meta, image }) {
  return (
    <article className="cinema-map-card">
      <img src={image} alt={title} />
      <div>
        <MapPin size={24} />
        <h2>{title}</h2>
        <p>{meta}</p>
      </div>
    </article>
  );
}

export default CinemaManagementPage;
