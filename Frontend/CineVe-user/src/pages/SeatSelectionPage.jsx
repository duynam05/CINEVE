import { useMemo, useState } from "react";
import { Bell, CalendarDays, ChevronRight, CircleX, Clapperboard, Home, Search, Ticket, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const vipRows = ["D", "E", "F"];
const coupleRow = "H";
const bookedSeats = new Set(["A3", "A4", "C7", "C8", "F2", "F3", "G5"]);
const basePrice = 95000;
const vipSurcharge = 35000;
const couplePrice = 210000;

const combos = [
  {
    id: "single",
    name: "Combo Single",
    description: "1 Bắp lớn + 1 Nước ngọt",
    price: 85000,
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=400&q=85"
  },
  {
    id: "couple",
    name: "Combo Couple",
    description: "1 Bắp khổng lồ + 2 Nước ngọt",
    price: 120000,
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=400&q=85"
  }
];

function SeatSelectionPage() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [comboQuantities, setComboQuantities] = useState({ single: 0, couple: 0 });

  const ticketTotal = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + getSeatPrice(seat), 0),
    [selectedSeats]
  );

  const comboTotal = useMemo(
    () => combos.reduce((sum, combo) => sum + combo.price * comboQuantities[combo.id], 0),
    [comboQuantities]
  );

  const totalPrice = ticketTotal + comboTotal;

  const toggleSeat = (seat) => {
    if (bookedSeats.has(seat)) return;

    setSelectedSeats((current) => {
      if (current.includes(seat)) {
        return current.filter((item) => item !== seat);
      }

      if (current.length >= 8) {
        return current;
      }

      return [...current, seat].sort(sortSeatCode);
    });
  };

  const updateCombo = (id, delta) => {
    setComboQuantities((current) => ({
      ...current,
      [id]: Math.max(0, current[id] + delta)
    }));
  };

  return (
    <div className="seat-page">
      <SeatNavbar />
      <main className="seat-main">
        <section className="seat-left">
          <div className="cinema-screen">
            <div className="screen-curve" />
            <span>MÀN HÌNH</span>
          </div>

          <div className="seat-map-wrap">
            <div className="seat-map">
              {rows.map((row) => (
                <div className="seat-row" key={row}>
                  <span className="row-label">{row}</span>
                  <div className="seat-row-grid">
                    {createSeats(row).map((seat) => (
                      <SeatButton
                        key={seat}
                        seat={seat}
                        selected={selectedSeats.includes(seat)}
                        booked={bookedSeats.has(seat)}
                        type={getSeatType(seat)}
                        onClick={() => toggleSeat(seat)}
                      />
                    ))}
                  </div>
                  <span className="row-label right">{row}</span>
                </div>
              ))}
            </div>
          </div>

          <SeatLegend />
          <ComboSection quantities={comboQuantities} onChange={updateCombo} />
        </section>

        <BookingSummary
          selectedSeats={selectedSeats}
          ticketTotal={ticketTotal}
          comboTotal={comboTotal}
          totalPrice={totalPrice}
        />
      </main>
      <SeatMobileNav />
    </div>
  );
}

function SeatNavbar() {
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

function SeatButton({ seat, selected, booked, type, onClick }) {
  return (
    <button
      className={`seat-button ${type} ${selected ? "selected" : ""} ${booked ? "booked" : ""}`}
      type="button"
      onClick={onClick}
      disabled={booked}
      aria-label={`Ghế ${seat}`}
    >
      {booked ? <CircleX size={14} /> : <span>{seat.replace(/^\D+/, "")}</span>}
    </button>
  );
}

function SeatLegend() {
  const items = [
    ["normal", "Ghế thường"],
    ["vip", "Ghế VIP"],
    ["couple", "Ghế đôi"],
    ["booked", "Đã đặt"],
    ["selected", "Đang chọn"]
  ];

  return (
    <div className="seat-legend">
      {items.map(([type, label]) => (
        <div key={type}>
          <span className={type} />
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}

function ComboSection({ quantities, onChange }) {
  return (
    <section className="combo-section">
      <h2>Chọn thêm Combo</h2>
      <div className="combo-grid">
        {combos.map((combo) => (
          <article className="combo-card" key={combo.id}>
            <img src={combo.image} alt={combo.name} />
            <div className="combo-info">
              <h3>{combo.name}</h3>
              <p>{combo.description}</p>
              <strong>{formatCurrency(combo.price)}</strong>
            </div>
            <div className="combo-stepper">
              <button type="button" onClick={() => onChange(combo.id, -1)}>-</button>
              <span>{quantities[combo.id]}</span>
              <button type="button" onClick={() => onChange(combo.id, 1)}>+</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BookingSummary({ selectedSeats, ticketTotal, comboTotal, totalPrice }) {
  return (
    <aside className="seat-summary">
      <div className="summary-card">
        <div className="summary-movie">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=85"
            alt="Poster Hành Tinh Cô Độc"
          />
          <div>
            <span>C18 - Kinh dị</span>
            <h1>HÀNH TINH CÔ ĐỘC</h1>
            <p>2D Phụ Đề • 125 phút</p>
          </div>
        </div>

        <div className="summary-details">
          <SummaryRow icon={<Clapperboard size={20} />} label="Rạp" value="CineVe Hồ Gươm" />
          <SummaryRow icon={<CalendarDays size={20} />} label="Suất chiếu" value="Hôm nay, 19:30" />
          <div className="summary-row seats">
            <div>
              <Ticket size={20} />
              <span>Ghế chọn</span>
            </div>
            <div className="selected-seat-list">
              {selectedSeats.length === 0
                ? "Chưa chọn ghế"
                : selectedSeats.map((seat) => <span key={seat}>{seat}</span>)}
            </div>
          </div>
        </div>

        <div className="price-lines">
          <div>
            <span>Giá vé</span>
            <strong>{formatCurrency(ticketTotal)}</strong>
          </div>
          <div>
            <span>Combo</span>
            <strong>{formatCurrency(comboTotal)}</strong>
          </div>
          <div className="total">
            <span>Tổng tiền</span>
            <strong>{formatCurrency(totalPrice)}</strong>
          </div>
        </div>

        <Link
          className={`summary-submit summary-link ${selectedSeats.length === 0 ? "disabled" : ""}`}
          to={selectedSeats.length === 0 ? "#" : "/thanh-toan"}
          aria-disabled={selectedSeats.length === 0}
        >
          Tiếp Tục Thanh Toán
          <ChevronRight size={22} />
        </Link>
        <p>Bằng việc nhấn "Tiếp Tục", bạn đồng ý với Điều khoản của chúng tôi.</p>
      </div>
    </aside>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="summary-row">
      <div>
        {icon}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function SeatMobileNav() {
  return (
    <nav className="seat-mobile-nav">
      <Link to="/">
        <Home size={22} />
        <span>Trang chủ</span>
      </Link>
      <Link to="/phim">
        <Ticket size={22} />
        <span>Phim</span>
      </Link>
      <Link to="/rap">
        <Clapperboard size={22} />
        <span>Rạp</span>
      </Link>
      <a href="#">
        <Utensils size={22} />
        <span>Vé</span>
      </a>
    </nav>
  );
}

function createSeats(row) {
  if (row === coupleRow) {
    return [1, 3, 5, 7, 9].map((col) => `${row}${col}`);
  }

  return Array.from({ length: 10 }, (_, index) => `${row}${index + 1}`);
}

function getSeatType(seat) {
  const row = seat[0];
  if (row === coupleRow) return "couple";
  if (vipRows.includes(row)) return "vip";
  return "normal";
}

function getSeatPrice(seat) {
  const type = getSeatType(seat);
  if (type === "couple") return couplePrice;
  if (type === "vip") return basePrice + vipSurcharge;
  return basePrice;
}

function sortSeatCode(a, b) {
  const rowCompare = a[0].localeCompare(b[0]);
  if (rowCompare !== 0) return rowCompare;
  return Number(a.slice(1)) - Number(b.slice(1));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

export default SeatSelectionPage;
