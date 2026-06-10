import React, { useState } from "react";
import {
  Bell,
  CalendarDays,
  Clapperboard,
  Film,
  LayoutDashboard,
  Pencil,
  Plus,
  Popcorn,
  Search,
  Settings,
  Ticket,
  Trash2,
  UserRound,
  Warehouse,
  X,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";

const showtimes = [
  {
    id: "st-01",
    time: "18:00 - 20:15",
    date: "Hôm nay, 25/03/2024",
    movie: "Dune: Hành Tinh Cát 2",
    room: "Phòng 01 • Rạp Quận 1",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=240&q=85",
    tickets: ["Thường", "VIP"],
    price: "95.000đ - 145.000đ",
    status: "Đang mở bán",
    tone: "active"
  },
  {
    id: "st-02",
    time: "19:30 - 21:45",
    date: "Hôm nay, 25/03/2024",
    movie: "Kung Fu Panda 4",
    room: "Phòng 02 • Rạp Quận 1",
    poster: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=240&q=85",
    tickets: ["Thường", "Đôi (Sweetbox)"],
    price: "85.000đ - 180.000đ",
    status: "Trùng lặp",
    tone: "conflict"
  }
];

function ShowtimeManagementPage() {
  const [showAlert, setShowAlert] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="admin-shell">
      <ShowtimeSidebar />
      <div className="admin-workspace">
        <ShowtimeTopbar />
        <main className="showtime-main">
          <section className="showtime-heading">
            <div>
              <h1>Quản lý lịch chiếu</h1>
              <p>Điều phối và sắp xếp lịch chiếu phim</p>
            </div>
            <Link to="/showtimes/new">
              <Plus size={20} />
              Thêm suất chiếu
            </Link>
          </section>

          <section className="showtime-filter-bar">
            <label>
              <span><Film size={18} /> Lọc theo phim</span>
              <select defaultValue="all">
                <option value="all">Tất cả phim</option>
                <option>Hào Quang Rực Rỡ</option>
                <option>Dune: Hành Tinh Cát 2</option>
                <option>Kung Fu Panda 4</option>
              </select>
            </label>
            <label>
              <span><Warehouse size={18} /> Lọc theo rạp</span>
              <select defaultValue="all">
                <option value="all">Tất cả cụm rạp</option>
                <option>CineVe Quận 1</option>
                <option>CineVe Vincom Plaza</option>
                <option>CineVe Landmark 81</option>
              </select>
            </label>
            <label>
              <span><CalendarDays size={18} /> Chọn ngày</span>
              <input type="date" defaultValue="2024-03-25" />
            </label>
            <button type="button" className="showtime-filter-button">Lọc dữ liệu</button>
          </section>

          {showAlert && (
            <section className="showtime-alert">
              <AlertTriangle size={32} />
              <div>
                <h2>Cảnh báo trùng lặp!</h2>
                <p>Suất chiếu lúc 19:30 tại Phòng 02 (Quận 1) đang trùng với thời gian dọn dẹp hoặc suất chiếu hiện có.</p>
              </div>
              <button type="button" onClick={() => setShowAlert(false)} aria-label="Đóng cảnh báo">
                <X size={20} />
              </button>
            </section>
          )}

          <section className="showtime-table-card">
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Phim / Phòng</th>
                    <th>Loại vé</th>
                    <th>Giá niêm yết</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {showtimes.map((item) => (
                    <tr className={item.tone === "conflict" ? "conflict" : ""} key={item.id}>
                      <td>
                        <strong>{item.time}</strong>
                        <span>{item.date}</span>
                      </td>
                      <td>
                        <div className="showtime-movie-cell">
                          <img src={item.poster} alt={item.movie} />
                          <div>
                            <strong>{item.movie}</strong>
                            <span className={item.tone === "conflict" ? "danger" : ""}>
                              <Clapperboard size={14} />
                              {item.room}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="showtime-ticket-tags">
                          {item.tickets.map((ticket) => (
                            <span key={ticket}>{ticket}</span>
                          ))}
                        </div>
                      </td>
                      <td>{item.price}</td>
                      <td>
                        <span className={`showtime-status ${item.tone}`}>{item.status}</span>
                      </td>
                      <td>
                        <div className="showtime-actions">
                          <button type="button" aria-label={`Sửa ${item.movie}`}><Pencil size={17} /></button>
                          <button type="button" aria-label={`Xóa ${item.movie}`}><Trash2 size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
      {isModalOpen && <AddShowtimeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function ShowtimeSidebar() {
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
        <span className="admin-letter-avatar"><UserRound size={20} /></span>
        <div>
          <strong>Admin Profile</strong>
          <span>Administrator</span>
        </div>
      </div>
    </aside>
  );
}

function ShowtimeTopbar() {
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
      </div>
    </header>
  );
}

function AddShowtimeModal({ onClose }) {
  return (
    <div className="showtime-modal">
      <button className="showtime-modal-overlay" type="button" aria-label="Đóng" onClick={onClose} />
      <section className="showtime-modal-panel">
        <header>
          <h2>Thêm suất chiếu mới</h2>
          <button type="button" onClick={onClose} aria-label="Đóng"><X size={22} /></button>
        </header>
        <form onSubmit={(event) => event.preventDefault()}>
          <label className="span-2">
            <span>Chọn phim</span>
            <select defaultValue="Dune: Hành Tinh Cát 2">
              <option>Dune: Hành Tinh Cát 2</option>
              <option>Kung Fu Panda 4</option>
              <option>Hào Quang Rực Rỡ</option>
            </select>
          </label>
          <label>
            <span>Rạp chiếu</span>
            <select defaultValue="CineVe Quận 1">
              <option>CineVe Quận 1</option>
              <option>CineVe Vincom Plaza</option>
            </select>
          </label>
          <label>
            <span>Phòng chiếu</span>
            <select defaultValue="Phòng 01 (IMAX)">
              <option>Phòng 01 (IMAX)</option>
              <option>Phòng 02 (Standard)</option>
              <option>Phòng 03 (Standard)</option>
              <option>Phòng VIP (L'Amour)</option>
            </select>
          </label>
          <div className="span-2 showtime-time-grid">
            <label><span>Ngày chiếu</span><input type="date" /></label>
            <label><span>Bắt đầu</span><input type="time" /></label>
            <label><span>Kết thúc dự kiến</span><input type="time" /></label>
          </div>
          <fieldset className="span-2 showtime-price-grid">
            <legend>Cấu hình giá vé (VNĐ)</legend>
            <label><span>Giá thường</span><input placeholder="95000" type="number" /></label>
            <label><span>Giá VIP</span><input placeholder="145000" type="number" /></label>
            <label><span>Giá đôi</span><input placeholder="180000" type="number" /></label>
          </fieldset>
          <footer className="span-2">
            <button type="button" onClick={onClose}>Hủy bỏ</button>
            <button type="submit" onClick={onClose}>Lưu suất chiếu</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default ShowtimeManagementPage;
