import React from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clapperboard,
  Film,
  LayoutDashboard,
  LogOut,
  Popcorn,
  Save,
  Settings,
  Ticket,
  Warehouse
} from "lucide-react";
import { Link } from "react-router-dom";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

function AddShowtimePage() {
  return (
    <div className="admin-shell">
      <AddShowtimeSidebar />
      <div className="admin-workspace">
        <AddShowtimeTopbar />
        <main className="add-showtime-main">
          <section className="add-showtime-heading">
            <h1>Thêm suất chiếu</h1>
            <p>Thiết lập thời gian và rạp chiếu cho phim mới trong hệ thống.</p>
          </section>

          <form className="add-showtime-form" onSubmit={(event) => event.preventDefault()}>
            <div className="add-showtime-grid">
              <article className="add-showtime-card primary">
                <label>
                  <span><Film size={18} /> Chọn phim</span>
                  <select defaultValue="">
                    <option value="" disabled>Chọn phim đang hoặc sắp chiếu</option>
                    <option value="1">Dune: Part Two</option>
                    <option value="2">Godzilla x Kong: The New Empire</option>
                    <option value="3">Kung Fu Panda 4</option>
                    <option value="4">The First Omen</option>
                  </select>
                </label>
                <div className="movie-meta-preview">
                  <div>
                    <small>Thời lượng</small>
                    <strong>166 phút</strong>
                  </div>
                  <div>
                    <small>Độ tuổi</small>
                    <strong>T13</strong>
                  </div>
                </div>
              </article>

              <article className="add-showtime-card secondary">
                <label>
                  <span><Clapperboard size={18} /> Rạp & phòng chiếu</span>
                  <select defaultValue="">
                    <option value="" disabled>Chọn rạp chiếu</option>
                    <option value="c1">CineVe Hồ Chí Minh</option>
                    <option value="c2">CineVe Hà Nội</option>
                    <option value="c3">CineVe Đà Nẵng</option>
                  </select>
                </label>
                <select defaultValue="">
                  <option value="" disabled>Chọn phòng</option>
                  <option value="r1">Phòng 01 (IMAX)</option>
                  <option value="r2">Phòng 02 (VIP)</option>
                  <option value="r3">Phòng 03 (Gold Class)</option>
                </select>
              </article>

              <article className="add-showtime-card full">
                <header>
                  <span><CalendarDays size={18} /> Thời gian chiếu</span>
                </header>
                <div className="add-showtime-time-grid">
                  <label>
                    <span>Ngày chiếu</span>
                    <input type="date" />
                  </label>
                  <label>
                    <span>Giờ bắt đầu</span>
                    <input type="time" />
                  </label>
                  <label>
                    <span>Ngôn ngữ & định dạng</span>
                    <div>
                      <select defaultValue="sub">
                        <option value="sub">Phụ đề</option>
                        <option value="dub">Lồng tiếng</option>
                      </select>
                      <select defaultValue="2d">
                        <option value="2d">2D</option>
                        <option value="3d">3D</option>
                        <option value="imax">IMAX</option>
                      </select>
                    </div>
                  </label>
                </div>
              </article>

              <article className="add-showtime-card full">
                <header>
                  <span><Ticket size={18} /> Bảng giá vé (VNĐ)</span>
                </header>
                <div className="add-showtime-price-grid">
                  <PriceInput title="Standard" subtitle="Ghế thường" placeholder="85000" />
                  <PriceInput title="VIP / Gold Class" subtitle="Ghế cao cấp" placeholder="150000" highlighted />
                </div>
              </article>
            </div>

            <footer className="add-showtime-actions">
              <Link to="/showtimes">Hủy bỏ</Link>
              <button type="submit">
                <CheckCircle2 size={18} />
                Tạo suất chiếu
              </button>
            </footer>
          </form>
        </main>
      </div>
    </div>
  );
}

function PriceInput({ title, subtitle, placeholder, highlighted = false }) {
  return (
    <label className={highlighted ? "price-input highlighted" : "price-input"}>
      <span>
        <i>{highlighted ? <Save size={18} /> : <Ticket size={18} />}</i>
        <span>
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </span>
      </span>
      <input placeholder={placeholder} type="number" />
    </label>
  );
}

function AddShowtimeSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies" },
    { label: "Rạp", icon: Warehouse, to: "/cinemas" },
    { label: "Phòng chiếu", icon: Clapperboard, to: "/rooms" },
    { label: "Lịch chiếu", icon: CalendarDays, to: "/showtimes", active: true },
    { label: "Đặt vé", icon: Ticket, to: "/bookings" },
    { label: "Đồ ăn/Combo", icon: Popcorn, to: "/foods" },
    { label: "Mã giảm giá", icon: Ticket, to: "/promotions" }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>CineVe</h2>
        <p>Hệ thống quản trị</p>
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
          <strong>Quản trị viên</strong>
          <span>CineVe Admin</span>
        </div>
        <LogOut size={18} />
      </div>
    </aside>
  );
}

function AddShowtimeTopbar() {
  return (
    <header className="add-movie-topbar">
      <div className="admin-breadcrumb">
        <Link to="/showtimes">Lịch chiếu</Link>
        <span>/</span>
        <strong>Thêm suất chiếu</strong>
      </div>
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

export default AddShowtimePage;
