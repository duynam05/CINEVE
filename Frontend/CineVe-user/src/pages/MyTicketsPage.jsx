import { useEffect, useMemo, useState } from "react";
import { Bell, CirclePlus, Clapperboard, Link as LinkIcon, Mail, QrCode, Search, Share2, Ticket, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { bookingApi } from "../api/clientApi";
import AccountNavActions from "../components/common/AccountNavActions.jsx";
import { fallbackPoster, formatDateTime, getErrorMessage, translateStatus } from "../utils/format";

const tabs = [
  { id: "upcoming", label: "Sắp Xem" },
  { id: "watched", label: "Đã Xem" },
  { id: "cancelled", label: "Đã Hủy" }
];

const fallbackTickets = [
  {
    id: "CBK-882910",
    tab: "upcoming",
    movie: "Dune: Hành Tinh Cát - Phần Hai",
    cinema: "CineVe Premium - Vincom Bà Triệu",
    time: "20:30 • 24/05/2026",
    roomSeat: "P05 • G12, G13",
    status: "Thành công",
    statusTone: "success",
    badge: "SẮP CHIẾU",
    format: "VIP",
    active: true,
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "CBK-110293",
    tab: "watched",
    movie: "Oppenheimer",
    cinema: "CineVe - Mega Mall Thảo Điền",
    time: "19:00 • 12/04/2026",
    roomSeat: "P02 • F05",
    status: "Hoàn thành",
    statusTone: "done",
    badge: "ĐÃ XEM",
    format: "2D",
    active: false,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "CBK-900312",
    tab: "upcoming",
    movie: "John Wick: Chương 4",
    cinema: "CineVe IMAX - Lotte Mall Tây Hồ",
    time: "14:15 • 25/05/2026",
    roomSeat: "IMAX-01 • L01, L02",
    status: "Chờ Check-in",
    statusTone: "success",
    badge: "NGÀY MAI",
    format: "IMAX",
    active: true,
    image: "https://images.unsplash.com/photo-1604975701397-6365ccbd028a?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: "CBK-660811",
    tab: "cancelled",
    movie: "Kẻ Độc Hành Cuối Cùng",
    cinema: "CineVe Landmark 81",
    time: "18:00 • 02/04/2026",
    roomSeat: "P03 • E08",
    status: "Đã hủy",
    statusTone: "cancelled",
    badge: "ĐÃ HỦY",
    format: "2D",
    active: false,
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=700&q=85"
  }
];

function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);

  const loadTickets = () => {
    setLoading(true);
    bookingApi.my()
      .then((result) => setTickets(mapBookingsToTickets(result || [])))
      .catch((error) => {
        setTickets(fallbackTickets);
        toast.error(getErrorMessage(error, "Không tải được vé của tôi, đang hiển thị dữ liệu mẫu"));
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadTickets, []);

  const visibleTickets = useMemo(
    () => tickets.filter((ticket) => ticket.tab === activeTab),
    [activeTab, tickets]
  );

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    if (!cancelTarget.bookingId) {
      toast.info("Đây là vé mẫu, chưa thể hủy trên hệ thống");
      setCancelTarget(null);
      return;
    }

    try {
      await bookingApi.cancel(cancelTarget.bookingId);
      toast.success("Hủy vé thành công");
      setCancelTarget(null);
      loadTickets();
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể hủy vé"));
    }
  };

  return (
    <div className="my-tickets-page">
      <TicketsNavbar />
      <main className="my-tickets-main">
        <header className="tickets-header">
          <h1>Lịch sử vé</h1>
          <p>Quản lý các suất chiếu bạn đã đặt và sắp tới.</p>
        </header>

        <div className="ticket-tabs">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.id ? "active" : ""}
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="ticket-card-grid">
          {loading && <p className="ticket-empty-text">Đang tải vé của bạn...</p>}
          {!loading && visibleTickets.length === 0 && <p className="ticket-empty-text">Chưa có vé trong mục này.</p>}
          {!loading && visibleTickets.map((ticket) => (
            <TicketCard ticket={ticket} onCancel={() => setCancelTarget(ticket)} key={ticket.id} />
          ))}
          <DiscoverCard />
        </section>

        <div className="ticket-load-more">
          <button type="button">Xem thêm lịch sử</button>
        </div>
      </main>

      <CancelToast visible={Boolean(cancelTarget)} onClose={() => setCancelTarget(null)} onConfirm={confirmCancel} />
    </div>
  );
}

function TicketsNavbar() {
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
          <AccountNavActions />
        </div>
      </div>
    </nav>
  );
}

function TicketCard({ ticket, onCancel }) {
  return (
    <article className={`my-ticket-card ${ticket.active ? "active-ticket" : "history-ticket"}`}>
      <div className="ticket-poster-side">
        <img src={ticket.image} alt={ticket.movie} />
        <span className={ticket.active ? "upcoming" : "history"}>{ticket.badge}</span>
      </div>

      <div className="ticket-content-side">
        <div>
          <div className="ticket-title-row">
            <h2>{ticket.movie}</h2>
            <span>{ticket.format}</span>
          </div>
          <p className="ticket-cinema">
            <Clapperboard size={18} />
            {ticket.cinema}
          </p>

          <div className="ticket-detail-grid-list">
            <TicketField label="Thời gian" value={ticket.time} muted={!ticket.active} />
            <TicketField label="Phòng / Ghế" value={ticket.roomSeat} muted={!ticket.active} />
            <TicketField label="Mã đặt vé" value={ticket.id} accent={ticket.active} muted={!ticket.active} />
            <div>
              <p>Trạng thái</p>
              <strong className={`ticket-status ${ticket.statusTone}`}>
                <i />
                {ticket.status}
              </strong>
            </div>
          </div>
        </div>

        <div className="ticket-actions-row">
          <Link className={ticket.active ? "primary" : "secondary"} to={ticket.bookingId ? `/ve-cua-toi/${ticket.bookingId}` : "/dat-ve-thanh-cong"}>
            {ticket.active && <QrCode size={19} />}
            {ticket.active ? "Xem Chi Tiết" : "Xem Lại Vé"}
          </Link>
          {ticket.active ? (
            <button className="cancel-ticket-button" type="button" onClick={onCancel} aria-label="Hủy vé">
              <X size={20} />
            </button>
          ) : (
            <button className="share-ticket-button" type="button" aria-label="Chia sẻ vé">
              <Share2 size={20} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function TicketField({ label, value, accent, muted }) {
  return (
    <div>
      <p>{label}</p>
      <strong className={`${accent ? "accent" : ""} ${muted ? "muted" : ""}`}>{value}</strong>
    </div>
  );
}

function DiscoverCard() {
  return (
    <article className="discover-ticket-card">
      <div>
        <CirclePlus size={34} />
      </div>
      <h2>Khám phá phim mới?</h2>
      <p>Vẫn còn nhiều bom tấn đang chờ bạn thưởng thức.</p>
      <Link to="/phim">Đặt vé ngay</Link>
    </article>
  );
}

function CancelToast({ visible, onClose, onConfirm }) {
  return (
    <div className={`cancel-toast ${visible ? "visible" : ""}`}>
      <Ticket size={24} />
      <div>
        <strong>Xác nhận hủy vé?</strong>
        <p>Chính sách hoàn tiền áp dụng tùy theo rạp.</p>
      </div>
      <div>
        <button type="button" onClick={onClose}>Bỏ qua</button>
        <button type="button" onClick={onConfirm}>Đồng ý</button>
      </div>
    </div>
  );
}

function mapBookingsToTickets(bookings) {
  return bookings.map((booking) => {
    const showtime = booking.showtime || {};
    const seatCodes = booking.seats?.map((seat) => seat.code).filter(Boolean).join(", ") || "Đang cập nhật";
    const isCancelled = booking.status === "CANCELLED" || booking.ticket?.status === "CANCELLED";
    const isDone = booking.status === "COMPLETED" || booking.ticket?.status === "USED";
    const tab = isCancelled ? "cancelled" : isDone ? "watched" : "upcoming";

    return {
      id: booking.code || booking.id,
      bookingId: booking.id,
      tab,
      movie: showtime.movieTitle || "Phim đang cập nhật",
      cinema: showtime.cinemaName || "Rạp đang cập nhật",
      time: formatDateTime(showtime.startTime),
      roomSeat: `${showtime.roomName || "Phòng chiếu"} • ${seatCodes}`,
      status: translateStatus(booking.ticket?.status || booking.status),
      statusTone: isCancelled ? "cancelled" : isDone ? "done" : "success",
      badge: isCancelled ? "ĐÃ HỦY" : isDone ? "ĐÃ XEM" : "SẮP CHIẾU",
      format: showtime.roomType || "2D",
      active: tab === "upcoming",
      image: fallbackPoster
    };
  });
}

function TicketsFooter() {
  return (
    <footer className="my-tickets-footer">
      <div>
        <section>
          <Link to="/">CineVe</Link>
          <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao với hệ thống đặt vé hiện đại nhất.</p>
        </section>
        <section>
          <h3>Thông tin</h3>
          <a href="#">Về chúng tôi</a>
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Liên hệ</a>
        </section>
        <section>
          <h3>Theo dõi</h3>
          <div className="tickets-socials">
            <a href="#" aria-label="Mạng xã hội"><Share2 size={20} /></a>
            <a href="#" aria-label="Liên kết"><LinkIcon size={20} /></a>
            <a href="#" aria-label="Email"><Mail size={20} /></a>
          </div>
        </section>
      </div>
    </footer>
  );
}

export default MyTicketsPage;
