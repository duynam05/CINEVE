import { useMemo } from "react";
import { Bell, Camera, CheckCircle2, Home, Search, Share2, Ticket, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const ticket = {
  bookingCode: "CVE-889-204",
  movie: "Dune: Part Two",
  total: "245.000 VNĐ",
  cinema: "CineVe Plaza - P.04",
  datetime: "20:30, 15/10/2026",
  seats: "H08, H09 (VIP)",
  combo: "1x Popcorn Giant",
  backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1400&q=85"
};

function BookingSuccessPage() {
  const confetti = useMemo(() => {
    const colors = ["#ffb4aa", "#e50914", "#e9c349", "#ffffff"];
    return Array.from({ length: 50 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 8 + 4}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
      radius: Math.random() > 0.5 ? "50%" : "0",
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 2}s`
    }));
  }, []);

  return (
    <div className="success-page">
      <SuccessNavbar />
      <main className="success-main">
        <div className="confetti-layer" aria-hidden="true">
          {confetti.map((item) => (
            <span
              key={item.id}
              style={{
                left: item.left,
                width: item.size,
                height: item.size,
                backgroundColor: item.color,
                borderRadius: item.radius,
                animationDuration: item.duration,
                animationDelay: item.delay
              }}
            />
          ))}
        </div>

        <section className="success-content">
          <div className="success-icon">
            <i />
            <CheckCircle2 size={68} fill="currentColor" />
          </div>
          <h1>Đặt vé thành công!</h1>
          <p>Chúc mừng bạn đã sở hữu tấm vé cho trải nghiệm điện ảnh tuyệt vời sắp tới tại CineVe.</p>

          <DigitalTicket />

          <div className="success-actions">
            <Link className="success-primary" to="/ve-cua-toi">
              <Ticket size={21} />
              Xem Vé Của Tôi
            </Link>
            <Link className="success-secondary" to="/">
              <Home size={21} />
              Về Trang Chủ
            </Link>
          </div>
        </section>
      </main>
      <SuccessFooter />
    </div>
  );
}

function SuccessNavbar() {
  return (
    <nav className="home-navbar solid">
      <div className="home-nav-shell">
        <Link to="/" className="home-brand">CineVe</Link>
        <div className="home-nav-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/phim">Phim</Link>
          <Link to="/rap">Rạp</Link>
          <Link to="/khuyen-mai">Khuyến mãi</Link>
          <Link className="active" to="/ve-cua-toi">Vé của tôi</Link>
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

function DigitalTicket() {
  return (
    <article className="digital-ticket">
      <div className="ticket-cover">
        <img src={ticket.backdrop} alt={ticket.movie} />
        <div>
          <span>PREMIUM EXPERIENCE</span>
          <h2>{ticket.movie}</h2>
        </div>
      </div>

      <div className="ticket-body">
        <div className="ticket-info-grid">
          <InfoBlock label="Mã đặt vé" value={ticket.bookingCode} accent />
          <InfoBlock label="Tổng cộng" value={ticket.total} alignRight />
          <div className="ticket-detail-grid">
            <InfoBlock label="Rạp & Phòng" value={ticket.cinema} />
            <InfoBlock label="Ngày & Giờ" value={ticket.datetime} alignRight />
            <InfoBlock label="Vị trí ghế" value={ticket.seats} accent />
            <InfoBlock label="Dịch vụ đi kèm" value={ticket.combo} alignRight />
          </div>
        </div>

        <div className="ticket-qr-section">
          <FakeQrCode />
          <p>Quét mã này tại quầy soát vé hoặc Kiosk tự động</p>
        </div>
      </div>
    </article>
  );
}

function InfoBlock({ label, value, accent, alignRight }) {
  return (
    <div className={alignRight ? "align-right" : ""}>
      <p>{label}</p>
      <strong className={accent ? "accent" : ""}>{value}</strong>
    </div>
  );
}

function FakeQrCode() {
  return (
    <div className="fake-qr" aria-label="QR Code giả lập">
      {Array.from({ length: 49 }, (_, index) => (
        <span key={index} className={(index * 7 + index) % 5 < 3 ? "dark" : ""} />
      ))}
    </div>
  );
}

function SuccessFooter() {
  return (
    <footer className="success-footer">
      <div>
        <section>
          <h2>CineVe</h2>
          <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao với hệ thống âm thanh Dolby Atmos và ghế ngồi VIP chuẩn quốc tế.</p>
        </section>
        <section>
          <h3>Thông tin</h3>
          <a href="#">Về chúng tôi</a>
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Hệ thống rạp</a>
        </section>
        <section>
          <h3>Hỗ trợ</h3>
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Liên hệ</a>
          <div className="success-socials">
            <Share2 size={20} />
            <Youtube size={20} />
            <Camera size={20} />
          </div>
        </section>
      </div>
    </footer>
  );
}

export default BookingSuccessPage;
