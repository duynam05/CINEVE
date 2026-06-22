import { useEffect, useMemo, useState } from "react";
import { Banknote, Bell, CalendarDays, CreditCard, Gift, IceCreamBowl, Landmark, MapPin, Search, Soup, Ticket, WalletCards } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { bookingApi, couponApi } from "../api/clientApi";
import AccountNavActions from "../components/common/AccountNavActions.jsx";
import { formatCurrency, formatDateTime, getErrorMessage } from "../utils/format";

const paymentMethods = [
  {
    id: "card",
    title: "Thẻ tín dụng / Ghi nợ",
    description: "Visa, Mastercard, JCB",
    icon: <CreditCard size={26} />
  },
  {
    id: "momo",
    title: "Ví MoMo",
    description: "Thanh toán nhanh qua App",
    logo: "MoMo"
  },
  {
    id: "vnpay",
    title: "VNPay",
    description: "Quét mã QR Code",
    logo: "VNPay"
  },
  {
    id: "bank",
    title: "Chuyển khoản",
    description: "ATM Nội địa / Internet Banking",
    icon: <Landmark size={26} />
  }
];

const order = {
  movie: "Dune: Part Two",
  cinema: "CineVe Hồ Gươm Plaza",
  room: "Phòng chiếu 05 • Cinema 5",
  date: "Thứ Sáu, 24 Tháng 5, 2026",
  showtime: "19:45",
  seats: "J12, J13",
  ticketType: "VIP",
  poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=85",
  foods: [
    { name: "1x Combo Bắp Nước Solo", price: 115000, icon: <Soup size={20} /> },
    { name: "2x Kem Haagen-Dazs", price: 180000, icon: <IceCreamBowl size={20} /> }
  ],
  subtotal: 545000
};

function PaymentPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponResult, setCouponResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedDraft = sessionStorage.getItem("cineve_booking_draft");
    if (!storedDraft) return;

    try {
      setDraft(JSON.parse(storedDraft));
    } catch {
      sessionStorage.removeItem("cineve_booking_draft");
    }
  }, []);

  const displayOrder = useMemo(() => mapDraftToOrder(draft), [draft]);
  const subtotal = displayOrder.subtotal;
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);

  const applyCoupon = async () => {
    const normalized = coupon.trim().toUpperCase();
    if (!normalized) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const result = await couponApi.apply({ code: normalized, orderAmount: subtotal });
      setCouponResult(result);
      setDiscount(Number(result.discountAmount || 0));
      toast.success("Áp dụng mã giảm giá thành công");
    } catch (error) {
      setCouponResult(null);
      setDiscount(0);
      toast.error(getErrorMessage(error, "Mã giảm giá không hợp lệ"));
    }
  };

  const confirmPayment = async () => {
    if (!draft?.showtimeId || !draft?.seatIds?.length) {
      toast.error("Thiếu thông tin đặt vé, vui lòng chọn lại suất chiếu và ghế");
      return;
    }

    setSubmitting(true);

    try {
      const booking = await bookingApi.create({
        showtimeId: draft.showtimeId,
        seatIds: draft.seatIds,
        foods: draft.foods?.map((food) => ({ foodId: food.foodId, quantity: food.quantity })) || [],
        couponCode: couponResult?.code || null,
        paymentMethod: mapPaymentMethod(selectedMethod),
        paymentSuccess: true
      });

      sessionStorage.setItem("cineve_latest_booking", JSON.stringify(booking));
      sessionStorage.removeItem("cineve_booking_draft");
      toast.success("Đặt vé thành công");
      navigate(`/dat-ve-thanh-cong?bookingId=${booking.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Thanh toán thất bại"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-page">
      <PaymentNavbar />
      <main className="payment-main">
        <section className="payment-left">
          <h1>Thanh toán</h1>

          <section className="payment-panel">
            <h2>
              <WalletCards size={25} />
              Phương thức thanh toán
            </h2>
            <div className="payment-method-grid">
              {paymentMethods.map((method) => (
                <button
                  className={`payment-method-card ${selectedMethod === method.id ? "active" : ""}`}
                  type="button"
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  {method.logo ? <span className={`method-logo ${method.id}`}>{method.logo}</span> : method.icon}
                  <span>
                    <strong>{method.title}</strong>
                    <small>{method.description}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="payment-panel">
            <h2>
              <Gift size={25} />
              Mã giảm giá
            </h2>
            <div className="coupon-row">
              <input
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                placeholder="Nhập mã ưu đãi của bạn..."
                type="text"
              />
              <button type="button" onClick={applyCoupon}>Áp dụng</button>
            </div>
            {discount > 0 && <p className="coupon-success">Đã áp dụng mã {couponResult?.code || coupon.trim().toUpperCase()}, giảm {formatCurrency(discount)}.</p>}
          </section>
        </section>

        <PaymentSummary
          order={displayOrder}
          discount={discount}
          total={total}
          onConfirm={confirmPayment}
          submitting={submitting}
        />
      </main>
    </div>
  );
}

function PaymentNavbar() {
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
          <AccountNavActions />
        </div>
      </div>
    </nav>
  );
}

function PaymentSummary({ order, discount, total, onConfirm, submitting }) {
  return (
    <aside className="payment-summary">
      <div className="payment-summary-card">
        <div className="summary-cover">
          <img src={order.poster} alt={order.movie} />
          <div>
            <span>HOT MOVIE</span>
            <h2>{order.movie}</h2>
          </div>
        </div>

        <div className="ticket-info-list">
          <PaymentInfo icon={<MapPin size={20} />} title={order.cinema} subtitle={order.room} />
          <PaymentInfo icon={<CalendarDays size={20} />} title={order.date} subtitle={`Suất chiếu: ${order.showtime}`} />
          <PaymentInfo icon={<Ticket size={20} />} title={`Ghế: ${order.seats}`} subtitle={`Hạng vé: ${order.ticketType}`} highlight />
        </div>

        <div className="food-list">
          <h3>Đồ ăn & Combo</h3>
          {order.foods.map((item) => (
            <div className="food-row" key={item.name}>
              <span>{item.icon}{item.name}</span>
              <strong>{formatCurrency(item.price)}</strong>
            </div>
          ))}
        </div>

        <div className="payment-price-list">
          <div>
            <span>Tạm tính</span>
            <strong>{formatCurrency(order.subtotal)}</strong>
          </div>
          <div>
            <span>Giảm giá</span>
            <strong className="discount">-{formatCurrency(discount)}</strong>
          </div>
          <div className="payment-total">
            <span>Tổng cộng</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>

        <button className="payment-confirm payment-confirm-link" type="button" onClick={onConfirm} disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Xác Nhận Thanh Toán"}
        </button>
        <p>Bằng việc nhấn thanh toán, bạn đồng ý với Điều khoản sử dụng của CineVe.</p>
      </div>
    </aside>
  );
}

function PaymentInfo({ icon, title, subtitle, highlight }) {
  return (
    <div className="payment-info-row">
      {icon}
      <div>
        <p>{title}</p>
        <span className={highlight ? "highlight" : ""}>{subtitle}</span>
      </div>
    </div>
  );
}

function PaymentFooter() {
  return (
    <footer className="payment-footer">
      <div>
        <section>
          <h2>CineVe</h2>
          <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao.</p>
        </section>
        <FooterColumn title="Khám phá" links={["Về chúng tôi", "Hệ thống rạp", "Tuyển dụng"]} />
        <FooterColumn title="Hỗ trợ" links={["Liên hệ", "Câu hỏi thường gặp", "Điều khoản sử dụng"]} />
        <FooterColumn title="Chính sách" links={["Chính sách bảo mật", "Chính sách thanh toán", "Chính sách hoàn vé"]} />
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {links.map((link) => <li key={link}><a href="#">{link}</a></li>)}
      </ul>
    </section>
  );
}

function mapDraftToOrder(draft) {
  if (!draft) return order;

  const showtime = draft.showtime || {};
  const foods = draft.foods?.length
    ? draft.foods.map((food) => ({
        name: `${food.quantity}x ${food.name}`,
        price: Number(food.price || 0) * Number(food.quantity || 0),
        icon: <Soup size={20} />
      }))
    : [{ name: "Không chọn combo", price: 0, icon: <Soup size={20} /> }];

  return {
    movie: showtime.movieTitle || order.movie,
    cinema: showtime.cinemaName || order.cinema,
    room: `${showtime.roomName || "Phòng chiếu"}${showtime.roomType ? ` • ${showtime.roomType}` : ""}`,
    date: showtime.startTime ? formatDateTime(showtime.startTime) : order.date,
    showtime: showtime.startTime ? formatDateTime(showtime.startTime).split(" ")[0] : order.showtime,
    seats: draft.seatCodes?.join(", ") || order.seats,
    ticketType: "CineVe",
    poster: order.poster,
    foods,
    subtotal: Number(draft.totalPrice || order.subtotal)
  };
}

function mapPaymentMethod(method) {
  const methods = {
    card: "BANK_CARD",
    momo: "MOMO",
    vnpay: "VNPAY",
    bank: "BANK_TRANSFER"
  };

  return methods[method] || "BANK_CARD";
}

export default PaymentPage;
