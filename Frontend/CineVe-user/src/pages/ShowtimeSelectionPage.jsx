import { useMemo, useState } from "react";
import { Bell, Clock3, Filter, Globe2, Mail, Map, MapPin, Search, Star, Ticket, Video } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const dates = [
  { id: "2026-06-15", dayName: "Th 2", day: "15", weekend: false },
  { id: "2026-06-16", dayName: "Th 3", day: "16", weekend: false },
  { id: "2026-06-17", dayName: "Th 4", day: "17", weekend: false },
  { id: "2026-06-18", dayName: "Th 5", day: "18", weekend: false },
  { id: "2026-06-19", dayName: "Th 6", day: "19", weekend: true },
  { id: "2026-06-20", dayName: "Th 7", day: "20", weekend: true },
  { id: "2026-06-21", dayName: "CN", day: "21", weekend: false }
];

const cinemas = [
  {
    id: "vincom-ba-trieu",
    name: "CineVe Vincom Bà Triệu",
    address: "Tầng 6, Vincom Center, 191 Bà Triệu, Q. Hai Bà Trưng, Hà Nội",
    distance: "2.4 km",
    rooms: [
      {
        name: "Phòng Chiếu 2D",
        tone: "standard",
        slots: [
          { id: "vbt-1430", start: "14:30", end: "16:45", seats: 45, price: 110000 },
          { id: "vbt-1615", start: "16:15", end: "18:30", seats: 12, price: 110000 },
          { id: "vbt-1900", start: "19:00", end: "", seats: 0, price: 120000, disabled: true }
        ]
      },
      {
        name: "Gold Class (VIP)",
        tone: "vip",
        slots: [
          { id: "vbt-1845", start: "18:45", end: "21:00", seats: 8, price: 250000 },
          { id: "vbt-2130", start: "21:30", end: "23:45", seats: 15, price: 250000 }
        ]
      }
    ]
  },
  {
    id: "aeon-ha-dong",
    name: "CineVe Aeon Mall Hà Đông",
    address: "Tầng 3, Aeon Mall, P. Dương Nội, Q. Hà Đông, Hà Nội",
    distance: "8.1 km",
    rooms: [
      {
        name: "IMAX with Laser",
        tone: "imax",
        slots: [
          { id: "ahd-1500", start: "15:00", end: "17:15", seats: 120, price: 160000 },
          { id: "ahd-2015", start: "20:15", end: "22:30", seats: 34, price: 180000 }
        ]
      },
      {
        name: "Phòng Chiếu 2D",
        tone: "standard",
        slots: [
          { id: "ahd-1315", start: "13:15", end: "15:30", seats: 82, price: 90000 },
          { id: "ahd-1745", start: "17:45", end: "20:00", seats: 21, price: 110000 }
        ]
      }
    ]
  }
];

function ShowtimeSelectionPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dates[0].id);
  const [selectedFormat, setSelectedFormat] = useState("2D");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filters, setFilters] = useState({
    area: "Tất cả Hà Nội",
    morning: false,
    afternoon: true,
    evening: true
  });

  const selectedSlotLabel = useMemo(() => {
    if (!selectedSlot) return "Chưa chọn suất chiếu";
    return `${selectedSlot.start} - ${formatCurrency(selectedSlot.price)}`;
  }, [selectedSlot]);

  const chooseSlot = (slot) => {
    if (slot.disabled) return;
    setSelectedSlot(slot);
  };

  return (
    <div className="showtime-page">
      <ShowtimeNavbar />
      <main>
        <ShowtimeHero />
        <DateSelector selectedDate={selectedDate} onSelect={setSelectedDate} />
        <section className="showtime-content">
          <aside className="showtime-sidebar">
            <FilterPanel
              selectedFormat={selectedFormat}
              setSelectedFormat={setSelectedFormat}
              filters={filters}
              setFilters={setFilters}
            />
            <OfferCard />
          </aside>

          <section className="cinema-results">
            <div className="selected-showtime-strip">
              <div>
                <span>Suất chiếu đã chọn</span>
                <strong>{selectedSlotLabel}</strong>
              </div>
              <button type="button" disabled={!selectedSlot} onClick={() => navigate("/chon-ghe")}>
                Tiếp tục chọn ghế
              </button>
            </div>

            {cinemas.map((cinema) => (
              <CinemaShowtimeCard
                cinema={cinema}
                selectedSlotId={selectedSlot?.id}
                onChooseSlot={chooseSlot}
                key={cinema.id}
              />
            ))}
          </section>
        </section>
      </main>
      <ShowtimeFooter />
    </div>
  );
}

function ShowtimeNavbar() {
  return (
    <nav className="home-navbar solid">
      <div className="home-nav-shell">
        <Link to="/" className="home-brand">CineVe</Link>
        <div className="home-nav-links">
          <Link to="/">Trang chủ</Link>
          <Link className="active" to="/phim">Phim</Link>
          <Link to="/rap">Rạp</Link>
          <Link to="/khuyen-mai">Khuyến mãi</Link>
          <Link to="/ve-cua-toi">Vé của tôi</Link>
        </div>
        <div className="home-nav-actions">
          <button className="icon-button" type="button" aria-label="Tìm kiếm"><Search size={20} /></button>
          <button className="icon-button" type="button" aria-label="Thông báo"><Bell size={20} /></button>
          <Link className="nav-login" to="/dang-nhap">Đăng nhập</Link>
          <Link className="nav-register" to="/dang-ky">Đăng ký</Link>
        </div>
      </div>
    </nav>
  );
}

function ShowtimeHero() {
  return (
    <section className="showtime-hero">
      <img
        src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1900&q=85"
        alt="Không gian rạp phim hiện đại"
      />
      <div className="showtime-hero-overlay" />
      <div className="showtime-hero-content">
        <div className="showtime-poster">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85"
            alt="Poster Hành Tinh Bất Diệt"
          />
        </div>
        <div>
          <div className="showtime-tags">
            <span>HÀNH ĐỘNG</span>
            <span>2H 15P</span>
            <span className="age">T16</span>
          </div>
          <h1>Hành Tinh Bất Diệt: Trỗi Dậy</h1>
          <p>Trải nghiệm đỉnh cao của điện ảnh với hệ thống âm thanh Dolby Atmos và công nghệ trình chiếu IMAX thế hệ mới.</p>
        </div>
      </div>
    </section>
  );
}

function DateSelector({ selectedDate, onSelect }) {
  return (
    <section className="date-selector">
      <div>
        {dates.map((date) => (
          <button
            className={`${selectedDate === date.id ? "active" : ""} ${date.weekend ? "weekend" : ""}`}
            type="button"
            key={date.id}
            onClick={() => onSelect(date.id)}
          >
            <span>{date.dayName}</span>
            <strong>{date.day}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

function FilterPanel({ selectedFormat, setSelectedFormat, filters, setFilters }) {
  const formats = ["2D", "3D", "IMAX", "GOLD CLASS"];

  const updateCheckbox = (key) => {
    setFilters((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="showtime-filter-card">
      <h2>
        <Filter size={22} />
        Bộ lọc
      </h2>
      <label>
        <span>Khu vực</span>
        <select
          value={filters.area}
          onChange={(event) => setFilters((current) => ({ ...current, area: event.target.value }))}
        >
          <option>Tất cả Hà Nội</option>
          <option>Quận Cầu Giấy</option>
          <option>Quận Hoàn Kiếm</option>
          <option>Quận Hai Bà Trưng</option>
        </select>
      </label>

      <div>
        <span className="filter-label">Định dạng</span>
        <div className="format-chips">
          {formats.map((format) => (
            <button
              className={selectedFormat === format ? "active" : ""}
              type="button"
              key={format}
              onClick={() => setSelectedFormat(format)}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="filter-label">Thời gian</span>
        <label className="time-check">
          <input type="checkbox" checked={filters.morning} onChange={() => updateCheckbox("morning")} />
          <span>Buổi sáng (08:00 - 12:00)</span>
        </label>
        <label className="time-check">
          <input type="checkbox" checked={filters.afternoon} onChange={() => updateCheckbox("afternoon")} />
          <span>Buổi chiều (12:00 - 18:00)</span>
        </label>
        <label className="time-check">
          <input type="checkbox" checked={filters.evening} onChange={() => updateCheckbox("evening")} />
          <span>Buổi tối (18:00 - 24:00)</span>
        </label>
      </div>
    </div>
  );
}

function OfferCard() {
  return (
    <article className="showtime-offer">
      <img
        src="https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=700&q=85"
        alt="Combo bắp nước ưu đãi"
      />
      <div>
        <span>ƯU ĐÃI HÔM NAY</span>
        <h3>Combo Bắp Nước Siêu Tiết Kiệm</h3>
        <p>Chỉ từ 99.000đ khi đặt kèm vé</p>
      </div>
    </article>
  );
}

function CinemaShowtimeCard({ cinema, selectedSlotId, onChooseSlot }) {
  return (
    <article className="cinema-showtime-card">
      <header>
        <div className="cinema-title-row">
          <div className="cinema-icon-box">
            <Video size={30} />
          </div>
          <div>
            <h2>{cinema.name}</h2>
            <p>
              <MapPin size={15} />
              {cinema.address}
            </p>
          </div>
        </div>
        <div className="cinema-distance">
          <span>{cinema.distance}</span>
          <button type="button" aria-label="Xem bản đồ"><Map size={20} /></button>
        </div>
      </header>

      <div className="room-list">
        {cinema.rooms.map((room) => (
          <div className="room-group" key={room.name}>
            <div className={`room-heading ${room.tone}`}>
              <span>{room.name}</span>
              {room.tone === "vip" && <Star size={15} fill="currentColor" />}
              <i />
            </div>
            <div className="slot-grid">
              {room.slots.map((slot) => (
                <button
                  className={`${room.tone} ${slot.disabled ? "disabled" : ""} ${selectedSlotId === slot.id ? "selected" : ""}`}
                  type="button"
                  key={slot.id}
                  onClick={() => onChooseSlot(slot)}
                  disabled={slot.disabled}
                >
                  <strong>{slot.start}</strong>
                  <span>{slot.disabled ? "Hết chỗ" : `~ ${slot.end}`}</span>
                  {!slot.disabled && <small>{slot.seats} ghế trống</small>}
                  <b>{formatCurrency(slot.price)}</b>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ShowtimeFooter() {
  return (
    <footer className="showtime-footer">
      <div>
        <section>
          <h2>CineVe</h2>
          <p>Trải nghiệm điện ảnh đỉnh cao với hệ thống đặt vé thông minh hàng đầu Việt Nam.</p>
          <div>
            <a href="#" aria-label="Website"><Globe2 size={20} /></a>
            <a href="#" aria-label="Email"><Mail size={20} /></a>
          </div>
        </section>
        <FooterColumn title="Sản phẩm" links={["Phim đang chiếu", "Phim sắp chiếu", "Rạp & Giá vé"]} />
        <FooterColumn title="Hỗ trợ" links={["Về chúng tôi", "Chính sách bảo mật", "Điều khoản sử dụng", "Liên hệ"]} />
        <section>
          <h3>Liên hệ</h3>
          <p>Hotline: 1900 1234</p>
          <p>Email: support@cineve.vn</p>
          <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao.</p>
        </section>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link}><a href="#">{link}</a></li>
        ))}
      </ul>
    </section>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

export default ShowtimeSelectionPage;
