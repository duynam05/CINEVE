import { useEffect, useMemo, useState } from "react";
import { Bell, ChevronRight, CreditCard, FastForward, Gift, Mail, MessageCircle, Phone, Play, Search, Star, Ticket, Trophy, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import AccountNavActions from "../components/common/AccountNavActions.jsx";

const slides = [
  {
    badge: "HOT DEAL",
    title: "Đồng Giá 45K\nCho Mọi Phim 2D",
    description: "Áp dụng cho tất cả suất chiếu vào mỗi Thứ Hai hàng tuần tại hệ thống CineVe trên toàn quốc.",
    primary: "Nhận Deal Ngay",
    secondary: "Xem Chi Tiết",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1900&q=85"
  },
  {
    badge: "PREMIUM EXPERIENCE",
    title: "Trải Nghiệm\nGhế Hạng Thương Gia",
    description: "Tận hưởng sự thoải mái tuyệt đối với hệ thống ghế da cao cấp và không gian riêng tư tại các phòng chiếu Gold Class.",
    primary: "Đặt Chỗ Ngay",
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1900&q=85"
  },
  {
    badge: "CINE NEWS",
    title: "Hương Vị\nĐiện Ảnh Đích Thực",
    description: "Khám phá thực đơn bắp nước phong phú với những hương vị độc quyền chỉ có tại CineVe.",
    primary: "Xem Thực Đơn",
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=1900&q=85"
  }
];

const categories = ["Tất cả", "Ưu đãi mới", "Thành viên VIP", "Đối tác thanh toán", "Combo ẩm thực"];

const smallOffers = [
  {
    title: "Thứ 4 Vui Vẻ",
    description: "Mỗi thứ 4, giá vé chỉ từ 55k cho tất cả các suất chiếu và mọi lứa tuổi.",
    price: "55.000đ",
    cta: "Chi tiết",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Quà Tặng Sinh Nhật",
    description: "Tặng ngay 01 vé xem phim và 01 combo bắp nước miễn phí cho thành viên có sinh nhật trong tháng.",
    cta: "Sử dụng ngay",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=85"
  }
];

const vipBenefits = [
  [Star, "Tích Lũy x2 Điểm", "Nhân đôi điểm thưởng cho mọi giao dịch đặt vé vào khung giờ vàng 18h-22h.", "Nâng cấp VIP"],
  [Ticket, "Đổi Vé Miễn Phí", "Chỉ với 1000 điểm, bạn có thể đổi ngay một vé 2D bất kỳ trong tuần.", "Đổi ngay"],
  [Trophy, "Ưu Tiên Đặt Trước", "Quyền ưu tiên đặt chỗ cho các suất chiếu sớm trước 24h.", "Xem lịch"],
  [Utensils, "Giảm 20% Food", "Đặc quyền giảm giá trực tiếp trên tổng hóa đơn ẩm thực tại quầy VIP.", "Xem menu"]
];

function PromotionsPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [category, setCategory] = useState("Tất cả");

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = useMemo(() => slides[slideIndex], [slideIndex]);

  return (
    <div className="promotions-page">
      <PromotionsNavbar />
      <main>
        <section className="promo-hero">
          <div
            className="promo-carousel-track"
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}
          >
            {slides.map((slide) => (
              <article className="promo-slide" key={slide.title}>
                <img src={slide.image} alt={slide.title.replace("\n", " ")} />
                <div className="promo-slide-overlay" />
                <div className="promo-slide-content">
                  <span>{slide.badge}</span>
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  <div>
                    <button type="button">{slide.primary}</button>
                    {slide.secondary && <button type="button">{slide.secondary}</button>}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="promo-dots">
            {slides.map((slide, index) => (
              <button
                className={slideIndex === index ? "active" : ""}
                type="button"
                aria-label={`Chuyển tới ${slide.badge}`}
                key={slide.badge}
                onClick={() => setSlideIndex(index)}
              />
            ))}
          </div>
        </section>

        <section className="promo-categories">
          {categories.map((item) => (
            <button
              className={category === item ? "active" : ""}
              type="button"
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </section>

        <div className="promo-content-shell">
          <section>
            <div className="promo-section-heading">
              <h2>
                <span />
                Ưu đãi mới nhất
              </h2>
              <a href="#">
                Xem tất cả
                <ChevronRight size={18} />
              </a>
            </div>

            <div className="promo-bento-grid">
              <article className="promo-feature-card">
                <img
                  src="https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=1200&q=85"
                  alt="Combo bắp nước siêu anh hùng"
                />
                <div>
                  <span>Combo Tiết Kiệm</span>
                  <h3>Combo Bắp Nước Siêu Anh Hùng</h3>
                  <p>Giảm ngay 30% cho các combo bắp nước khi đặt kèm vé phim bom tấn Marvel trong tháng này.</p>
                  <footer>
                    <small>Hạn dùng: 31/12/2026</small>
                    <button type="button">Nhận Ưu Đãi</button>
                  </footer>
                </div>
              </article>

              {smallOffers.map((offer) => (
                <article className="promo-small-card" key={offer.title}>
                  <div>
                    <img src={offer.image} alt={offer.title} />
                  </div>
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <footer>
                    {offer.price ? <strong>{offer.price}</strong> : <span />}
                    <button type="button">{offer.cta}</button>
                  </footer>
                </article>
              ))}

              <article className="promo-partner-card">
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85"
                    alt="Ưu đãi thanh toán thẻ VISA"
                  />
                </div>
                <section>
                  <div>
                    <i><CreditCard size={16} /></i>
                    <span>Hợp tác ngân hàng</span>
                  </div>
                  <h3>Giảm 50k khi thanh toán qua thẻ VISA</h3>
                  <p>Áp dụng cho hóa đơn từ 200k khi mua vé trực tuyến qua website hoặc ứng dụng CineVe.</p>
                  <button type="button">
                    Tìm hiểu thêm
                    <ChevronRight size={18} />
                  </button>
                </section>
              </article>
            </div>
          </section>

          <section>
            <div className="promo-section-heading vip">
              <h2>
                <span />
                Đặc quyền thành viên VIP
              </h2>
            </div>
            <div className="vip-benefit-grid">
              {vipBenefits.map(([Icon, title, description, cta]) => (
                <article className="vip-benefit-card" key={title}>
                  <div><Icon size={27} fill="currentColor" /></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <a href="#">{cta}</a>
                </article>
              ))}
            </div>
          </section>

          <section className="newsletter-section">
            <div className="newsletter-bg" />
            <div>
              <h2>Không bỏ lỡ ưu đãi nào!</h2>
              <p>Đăng ký nhận bản tin để cập nhật những khuyến mãi nóng hổi và lịch chiếu phim bom tấn sớm nhất từ CineVe.</p>
              <form onSubmit={(event) => event.preventDefault()}>
                <input placeholder="Nhập địa chỉ email của bạn" type="email" />
                <button type="submit">Đăng ký ngay</button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function PromotionsNavbar() {
  return (
    <nav className="home-navbar solid">
      <div className="home-nav-shell">
        <Link to="/" className="home-brand">CineVe</Link>
        <div className="home-nav-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/phim">Phim</Link>
          <Link to="/rap">Rạp</Link>
          <Link className="active" to="/khuyen-mai">Khuyến mãi</Link>
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

function PromotionsFooter() {
  return (
    <footer className="promotions-footer">
      <div>
        <section>
          <Link to="/">CineVe</Link>
          <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao với hệ thống âm thanh Dolby Atmos và ghế ngồi VIP chuyên biệt.</p>
          <div>
            <a href="#" aria-label="Website"><Mail size={20} /></a>
            <a href="#" aria-label="Trao đổi"><MessageCircle size={20} /></a>
          </div>
        </section>
        <FooterColumn title="CineVe" links={["Về chúng tôi", "Tuyển dụng", "Liên hệ", "Hệ thống rạp"]} />
        <FooterColumn title="Điều khoản & Quy định" links={["Chính sách bảo mật", "Điều khoản sử dụng", "Chính sách thanh toán", "Quy định đổi trả vé"]} />
        <section>
          <h3>Hỗ trợ khách hàng</h3>
          <p>Hotline: 1900 6688 (9:00 - 22:00)</p>
          <p>Email: support@cineve.vn</p>
          <strong>TẢI ỨNG DỤNG</strong>
          <div className="promo-app-buttons">
            <button type="button"><Phone size={20} /> App Store</button>
            <button type="button"><Play size={20} /> Google Play</button>
          </div>
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
        {links.map((link) => <li key={link}><a href="#">{link}</a></li>)}
      </ul>
    </section>
  );
}

export default PromotionsPage;
