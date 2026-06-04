import { useEffect, useState } from "react";
import { Bell, CircleUserRound, Clapperboard, Home, Mail, MapPin, Search, Share2, Star, Ticket, TicketCheck, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const heroMovie = {
  title: "Dune: Hành Tinh Cát - Phần 2",
  rating: "9.2",
  image:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1900&q=85",
  description:
    "Hành trình tiếp theo của Paul Atreides khi anh hợp nhất với Chani và người Fremen để thực hiện cuộc trả thù chống lại những kẻ đã hủy hoại gia đình mình. Cuộc chiến vĩ đại nhất thiên hà sắp bắt đầu."
};

const nowShowingMovies = [
  {
    title: "Dune: Hành Tinh Cát 2",
    genres: "Hành động, Sci-Fi",
    duration: "166 phút",
    rating: "9.2",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Kung Fu Panda 4",
    genres: "Hoạt hình, Hài",
    duration: "94 phút",
    rating: "8.5",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Mai",
    genres: "Tâm lý, Tình cảm",
    duration: "131 phút",
    rating: "8.8",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Đào, Phở và Piano",
    genres: "Lịch sử, Chiến tranh",
    duration: "100 phút",
    rating: "8.2",
    image:
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=85"
  }
];

const comingSoonMovies = [
  {
    title: "Godzilla x Kong: Đế Chế Mới",
    date: "29/03/2026",
    description:
      "Hai siêu quái vật huyền thoại phải hợp sức chống lại một mối đe dọa mới xuất hiện từ lòng Trái Đất.",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Furiosa: Câu Chuyện Mad Max",
    date: "24/05/2026",
    description:
      "Khám phá nguồn gốc của chiến binh Furiosa trong thế giới hậu tận thế khốc liệt.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85"
  }
];

const cinemas = [
  ["CineVe Landmark 81", "Quận Bình Thạnh, TP. HCM"],
  ["CineVe West Lake", "Quận Tây Hồ, Hà Nội"],
  ["CineVe Đà Nẵng Riverside", "Quận Hải Châu, Đà Nẵng"]
];

const promotions = [
  {
    title: "Combo Bắp Nước Ưu Đãi",
    description: "Giảm ngay 20% khi đặt cùng vé xem phim",
    cta: "Dùng ngay",
    tone: "red",
    image:
      "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Đặc Quyền Thành Viên",
    description: "Tích điểm đổi vé miễn phí mỗi tuần",
    cta: "Tìm hiểu thêm",
    tone: "gold",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=85"
  }
];

function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroOffset, setHeroOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setHeroOffset(window.scrollY * 0.24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="home-page">
      <HomeNavbar isScrolled={isScrolled} />
      <HeroSection heroOffset={heroOffset} />
      <NowShowingSection />
      <ComingSoonSection />
      <CinemaPromoSection />
      <HomeFooter />
      <MobileNav />
    </div>
  );
}

function HomeNavbar({ isScrolled }) {
  return (
    <nav className={`home-navbar ${isScrolled ? "solid" : ""}`}>
      <div className="home-nav-shell">
        <Link to="/" className="home-brand">
          CineVe
        </Link>
        <div className="home-nav-links">
          <Link className="active" to="/">
            Trang chủ
          </Link>
          <Link to="/phim">Phim</Link>
          <a href="#rap-pho-bien">Rạp</a>
          <a href="#khuyen-mai">Khuyến mãi</a>
          <a href="#">Vé của tôi</a>
        </div>
        <div className="home-nav-actions">
          <button className="icon-button" type="button" aria-label="Tìm kiếm">
            <Search size={20} />
          </button>
          <button className="icon-button" type="button" aria-label="Thông báo">
            <Bell size={20} />
          </button>
          <Link className="nav-login" to="/dang-nhap">
            Đăng nhập
          </Link>
          <Link className="nav-register" to="/dang-ky">
            Đăng ký
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ heroOffset }) {
  return (
    <header className="home-hero">
      <img
        className="home-hero-image"
        src={heroMovie.image}
        alt={heroMovie.title}
        style={{ transform: `translateY(${heroOffset}px)` }}
      />
      <div className="home-hero-gradient" />
      <div className="home-hero-content">
        <div className="hero-meta">
          <span className="trend-badge">THỊNH HÀNH</span>
          <span className="rating-pill">
            <Star size={18} fill="currentColor" />
            {heroMovie.rating} IMDb
          </span>
        </div>
        <h1>{heroMovie.title}</h1>
        <p>{heroMovie.description}</p>
        <div className="hero-actions">
          <button className="hero-primary" type="button">
            <TicketCheck size={22} />
            ĐẶT VÉ NGAY
          </button>
          <button className="hero-secondary" type="button">
            Xem Trailer
          </button>
        </div>
      </div>
    </header>
  );
}

function NowShowingSection() {
  return (
    <section className="home-section" id="phim-dang-chieu">
      <SectionHeader
        title="Phim Đang Chiếu"
        description="Đừng bỏ lỡ những siêu phẩm điện ảnh mới nhất tại rạp"
        action="Xem tất cả"
      />
      <div className="movie-grid">
        {nowShowingMovies.map((movie) => (
          <article className="movie-card" key={movie.title}>
            <div className="movie-poster">
              <img src={movie.image} alt={movie.title} />
              <div className="movie-overlay">
                <button type="button">ĐẶT VÉ</button>
              </div>
              <span className="movie-rating">
                <Star size={14} fill="currentColor" />
                {movie.rating}
              </span>
            </div>
            <h3>{movie.title}</h3>
            <p>
              {movie.genres}
              <span />
              {movie.duration}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComingSoonSection() {
  return (
    <section className="coming-section">
      <div className="home-section compact">
        <SectionTitle title="Phim Sắp Chiếu" accent="gold" />
        <div className="coming-grid">
          {comingSoonMovies.map((movie) => (
            <article className="coming-card" key={movie.title}>
              <div className="coming-poster">
                <img src={movie.image} alt={movie.title} />
              </div>
              <div className="coming-content">
                <span>Dự kiến: {movie.date}</span>
                <h3>{movie.title}</h3>
                <p>{movie.description}</p>
                <button type="button">NHẬN THÔNG BÁO</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CinemaPromoSection() {
  return (
    <section className="home-section">
      <div className="cinema-promo-layout">
        <div id="rap-pho-bien">
          <h2 className="plain-section-title">Rạp Phổ Biến</h2>
          <div className="cinema-list">
            {cinemas.map(([name, address]) => (
              <article className="cinema-item" key={name}>
                <div className="cinema-icon">
                  <Clapperboard size={30} />
                </div>
                <div>
                  <h3>{name}</h3>
                  <p>{address}</p>
                </div>
              </article>
            ))}
          </div>
          <button className="find-cinema-button" type="button">
            Tìm rạp gần bạn
          </button>
        </div>

        <div id="khuyen-mai">
          <h2 className="plain-section-title">Khuyến Mãi</h2>
          <div className="promotion-grid">
            {promotions.map((promotion) => (
              <article className="promotion-card" key={promotion.title}>
                <img src={promotion.image} alt={promotion.title} />
                <div className="promotion-content">
                  <h3>{promotion.title}</h3>
                  <p>{promotion.description}</p>
                  <span className={promotion.tone}>{promotion.cta}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="section-header">
      <div>
        <SectionTitle title={title} />
        <p>{description}</p>
      </div>
      <a href="#">{action}</a>
    </div>
  );
}

function SectionTitle({ title, accent = "red" }) {
  return (
    <h2 className="section-title">
      <span className={accent} />
      {title}
    </h2>
  );
}

function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="footer-grid">
        <div>
          <Link className="footer-brand" to="/">
            CineVe
          </Link>
          <p>
            Trải nghiệm điện ảnh đỉnh cao với hệ thống âm thanh Dolby Atmos và màn hình IMAX hiện đại nhất.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Website">
              <UsersRound size={20} />
            </a>
            <a href="#" aria-label="Chia sẻ">
              <Share2 size={20} />
            </a>
            <a href="#" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <FooterColumn title="CineVe" links={["Về chúng tôi", "Hệ thống rạp", "Tuyển dụng", "Liên hệ"]} />
        <FooterColumn title="Điều khoản & Chính sách" links={["Điều khoản sử dụng", "Chính sách bảo mật", "Chính sách hoàn vé", "Câu hỏi thường gặp"]} />

        <div>
          <h3>Chăm sóc khách hàng</h3>
          <p>
            Hotline: <strong>1900 1234</strong>
          </p>
          <p>Giờ làm việc: 8:00 - 22:00 hàng ngày</p>
          <div className="daily-offer">
            <strong>Ưu đãi hôm nay!</strong>
            <span>Đăng ký thành viên để nhận bắp nước miễn phí lần đầu.</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao.</p>
        <div className="payment-tags">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>JCB</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link}>
            <a href="#">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileNav() {
  return (
    <div className="mobile-nav">
      <a className="active" href="#">
        <Home size={22} fill="currentColor" />
        <span>Trang chủ</span>
      </a>
      <Link to="/phim">
        <Ticket size={22} />
        <span>Phim</span>
      </Link>
      <a href="#rap-pho-bien">
        <MapPin size={22} />
        <span>Rạp</span>
      </a>
      <Link to="/dang-nhap">
        <CircleUserRound size={22} />
        <span>Tôi</span>
      </Link>
    </div>
  );
}

export default HomePage;
