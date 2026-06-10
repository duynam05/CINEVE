import React, { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Clapperboard,
  Film,
  Grid3X3,
  Info,
  LayoutDashboard,
  Maximize,
  Popcorn,
  Save,
  Settings,
  Ticket,
  Warehouse,
  ZoomIn
} from "lucide-react";
import { Link } from "react-router-dom";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

const rows = "ABCDEFGHIJ".split("");

function AddRoomPage() {
  const [selectedSeats, setSelectedSeats] = useState(["C5"]);

  const seats = useMemo(
    () =>
      rows.flatMap((row, rowIndex) =>
        Array.from({ length: 12 }, (_, colIndex) => {
          const col = colIndex + 1;
          const isVip = rowIndex >= 5 && rowIndex <= 7 && col >= 4 && col <= 9;
          return {
            id: `${row}${col}`,
            type: isVip ? "vip" : "standard"
          };
        })
      ),
    []
  );

  const toggleSeat = (seatId) => {
    setSelectedSeats((current) =>
      current.includes(seatId) ? current.filter((item) => item !== seatId) : [...current, seatId]
    );
  };

  return (
    <div className="admin-shell">
      <AddRoomSidebar />
      <div className="admin-workspace">
        <AddRoomTopbar />
        <main className="add-room-main">
          <section className="add-room-layout">
            <form className="add-room-form" onSubmit={(event) => event.preventDefault()}>
              <article className="add-room-card">
                <h2>
                  <Info size={22} />
                  Thông tin cơ bản
                </h2>
                <div className="add-room-fields">
                  <label className="span-2">
                    <span>Tên phòng chiếu</span>
                    <input placeholder="Ví dụ: Phòng 01 - Gold Class" />
                  </label>
                  <label>
                    <span>Loại màn hình</span>
                    <select defaultValue="2D">
                      <option value="2D">Định dạng 2D</option>
                      <option value="3D">Định dạng 3D</option>
                      <option value="IMAX">IMAX Laser</option>
                      <option value="ScreenX">ScreenX</option>
                    </select>
                  </label>
                  <label>
                    <span>Tổng số ghế</span>
                    <input type="number" defaultValue="120" />
                  </label>
                  <fieldset className="span-2 room-sound-field">
                    <legend>Hệ thống âm thanh</legend>
                    <label>
                      <input type="radio" name="sound" />
                      <span>Dolby 7.1</span>
                    </label>
                    <label className="selected">
                      <input type="radio" name="sound" defaultChecked />
                      <span>Dolby Atmos</span>
                    </label>
                  </fieldset>
                  <label className="span-2">
                    <span>Mô tả thêm (Tùy chọn)</span>
                    <textarea rows="3" placeholder="Ghi chú về trang thiết bị hoặc đặc điểm phòng..." />
                  </label>
                </div>
              </article>
              <div className="add-room-actions">
                <Link to="/rooms">Hủy bỏ</Link>
                <button type="submit">Lưu cấu hình phòng</button>
              </div>
            </form>

            <section className="add-room-preview-card">
              <header>
                <div>
                  <h2>
                    <Grid3X3 size={22} />
                    Sơ đồ chỗ ngồi
                  </h2>
                  <p>Chế độ xem trước (Preview Layout)</p>
                </div>
                <div>
                  <button type="button" aria-label="Phóng to"><ZoomIn size={19} /></button>
                  <button type="button" aria-label="Vừa khung"><Maximize size={19} /></button>
                </div>
              </header>

              <div className="add-room-screen">
                <div />
                <span>Màn hình / Screen</span>
              </div>

              <div className="add-room-seat-scroll">
                <div className="add-room-seat-grid">
                  {seats.map((seat) => (
                    <button
                      className={`add-room-seat ${seat.type} ${selectedSeats.includes(seat.id) ? "selected" : ""}`}
                      type="button"
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id)}
                    >
                      {seat.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="add-room-legend">
                <span><i className="standard" />Ghế thường</span>
                <span><i className="vip" />Ghế VIP</span>
                <span><i className="selected" />Đang chọn</span>
                <span><i className="aisle" />Lối đi</span>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

function AddRoomSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies" },
    { label: "Rạp", icon: Warehouse, to: "/cinemas" },
    { label: "Phòng chiếu", icon: Clapperboard, to: "/rooms", active: true },
    { label: "Lịch chiếu", icon: CalendarDays, to: "/showtimes" },
    { label: "Đặt vé", icon: Ticket, to: "/bookings" },
    { label: "Đồ ăn/Combo", icon: Popcorn, to: "/foods" },
    { label: "Mã giảm giá", icon: Ticket, to: "/promotions" }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>CineVe</h2>
        <p>Admin Console</p>
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
          <strong>Admin Cine</strong>
          <span>System Manager</span>
        </div>
      </div>
    </aside>
  );
}

function AddRoomTopbar() {
  return (
    <header className="add-movie-topbar">
      <div className="admin-breadcrumb">
        <Link to="/rooms">Phòng chiếu</Link>
        <span>/</span>
        <strong>Thêm phòng mới</strong>
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

export default AddRoomPage;
