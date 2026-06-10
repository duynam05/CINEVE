import React, { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Clapperboard,
  Construction,
  Film,
  LayoutDashboard,
  LogOut,
  Plus,
  Popcorn,
  Redo2,
  Save,
  Search,
  Settings,
  Ticket,
  Undo2,
  Warehouse,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

const rooms = [
  { id: "room-01", name: "Phòng Chiếu 01", type: "IMAX", rows: 10, cols: 12, active: true },
  { id: "room-02", name: "Phòng Chiếu 02", type: "2D Digital", rows: 12, cols: 14 },
  { id: "room-03", name: "Phòng Chiếu 03 (VIP)", type: "Gold Class", rows: 6, cols: 8 },
  { id: "room-04", name: "Phòng Chiếu 04", type: "3D Atmos", rows: 10, cols: 12 }
];

const seatTypes = [
  { id: "standard", label: "Thường" },
  { id: "vip", label: "Ghế VIP" },
  { id: "couple", label: "Ghế đôi" },
  { id: "maintenance", label: "Bảo trì" }
];

const rowLabels = "ABCDEFGHIJ".split("");

function RoomManagementPage() {
  const [activeRoomId, setActiveRoomId] = useState("room-01");
  const [selectedType, setSelectedType] = useState("standard");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeRoom = rooms.find((room) => room.id === activeRoomId) ?? rooms[0];

  const seats = useMemo(() => {
    return rowLabels.flatMap((row, rowIndex) =>
      Array.from({ length: 12 }, (_, index) => {
        const col = index + 1;
        let type = "standard";
        if (rowIndex >= 4 && rowIndex < 8) type = "vip";
        if (rowIndex >= 8) type = "couple";
        if (rowIndex >= 8 && (col === 6 || col === 7)) type = "maintenance";
        return { id: `${row}${col}`, row, col, type };
      })
    );
  }, []);

  const toggleSeat = (seatId) => {
    setSelectedSeats((current) =>
      current.includes(seatId) ? current.filter((item) => item !== seatId) : [...current, seatId]
    );
  };

  return (
    <div className="admin-shell">
      <RoomSidebar />
      <div className="admin-workspace">
        <RoomTopbar />
        <main className="room-admin-main">
          <section className="room-heading">
            <div>
              <h1>Quản lý phòng & ghế</h1>
              <p>Thiết lập sơ đồ ghế và cấu hình phòng chiếu</p>
            </div>
            <Link className="add-room-button" to="/rooms/new">
              <Plus size={18} />
              Thêm phòng mới
            </Link>
          </section>

          <section className="room-layout">
            <aside className="room-list-panel">
              <header>
                <span>Danh sách phòng</span>
                <strong>8 phòng</strong>
              </header>
              <div className="room-list">
                {rooms.map((room) => (
                  <button
                    className={room.id === activeRoomId ? "active" : ""}
                    key={room.id}
                    type="button"
                    onClick={() => setActiveRoomId(room.id)}
                  >
                    <div>
                      <h2>{room.name}</h2>
                      <span>{room.type}</span>
                    </div>
                    <p>
                      Hàng: {room.rows} | Cột: {room.cols} | Tổng: {room.rows * room.cols} ghế
                    </p>
                  </button>
                ))}
              </div>
            </aside>

            <section className="seat-editor-panel">
              <header className="seat-editor-heading">
                <div>
                  <h2>Thiết lập sơ đồ ghế: {activeRoom.name.replace("Phòng Chiếu ", "Phòng ")}</h2>
                  <p>Chọn các ghế để thay đổi thuộc tính</p>
                </div>
                <div>
                  <button type="button" aria-label="Hoàn tác"><Undo2 size={18} /></button>
                  <button type="button" aria-label="Làm lại"><Redo2 size={18} /></button>
                  <button type="button" className="save-seat-map"><Save size={16} /> Lưu sơ đồ</button>
                </div>
              </header>

              <div className="seat-tool-grid">
                {seatTypes.map((type) => (
                  <button
                    className={selectedType === type.id ? `active ${type.id}` : type.id}
                    type="button"
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <span />
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="seat-preview">
                <div className="screen-wrap">
                  <div className="screen-curve-admin" />
                  <span>Màn hình / Screen</span>
                </div>
                <div className="admin-seat-grid">
                  {seats.map((seat) => (
                    <button
                      className={`admin-seat ${seat.type} ${selectedSeats.includes(seat.id) ? "selected" : ""}`}
                      type="button"
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id)}
                    >
                      {seat.type === "maintenance" ? <Construction size={13} /> : seat.id}
                    </button>
                  ))}
                </div>
                <div className="seat-legend-admin">
                  <span><i className="standard" />Standard</span>
                  <span><i className="vip" />VIP</span>
                  <span><i className="couple" />Sweetbox</span>
                  <span><i className="maintenance" />Broken</span>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
      {isModalOpen && <AddRoomModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function RoomSidebar() {
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
        <div className="admin-letter-avatar">A</div>
        <div>
          <strong>Quản trị viên</strong>
          <span>admin@cineve.com</span>
        </div>
        <LogOut size={18} />
      </div>
    </aside>
  );
}

function RoomTopbar() {
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

function AddRoomModal({ onClose }) {
  return (
    <div className="room-modal">
      <button className="room-modal-overlay" type="button" aria-label="Đóng" onClick={onClose} />
      <section className="room-modal-panel">
        <header>
          <h2>Thêm phòng chiếu</h2>
          <button type="button" onClick={onClose} aria-label="Đóng"><X size={22} /></button>
        </header>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>
            <span>Tên phòng chiếu</span>
            <input placeholder="VD: Phòng Chiếu 05" />
          </label>
          <label>
            <span>Loại phòng</span>
            <select defaultValue="2D Digital">
              <option>2D Digital</option>
              <option>3D Atmos</option>
              <option>IMAX</option>
              <option>Gold Class</option>
              <option>L'amour</option>
            </select>
          </label>
          <div className="room-modal-grid">
            <label>
              <span>Tổng số hàng</span>
              <input type="number" defaultValue="10" />
            </label>
            <label>
              <span>Tổng số cột</span>
              <input type="number" defaultValue="12" />
            </label>
          </div>
          <footer>
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="submit" onClick={onClose}>Khởi tạo phòng</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default RoomManagementPage;
