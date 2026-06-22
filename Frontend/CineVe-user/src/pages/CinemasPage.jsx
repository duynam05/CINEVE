import { useMemo, useState } from "react";
import { Bell, Film, Grid2X2, Mail, MapPin, Play, Search, Smartphone, Star, Ticket, Globe2, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { cinemaApi } from "../api/clientApi";
import AccountNavActions from "../components/common/AccountNavActions.jsx";

const cinemas = [
  {
    id: "landmark-81",
    name: "CineVe Landmark 81",
    city: "Hồ Chí Minh",
    address: "Tầng B1, Vincom Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh",
    distance: "1.2 km cách đây",
    rating: "4.9",
    tags: ["IMAX", "Gold Class"],
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "bitexco",
    name: "CineVe Bitexco",
    city: "Hồ Chí Minh",
    address: "Tầng 3, Bitexco Financial Tower, 2 Hải Triều, Q.1",
    distance: "3.5 km cách đây",
    rating: "4.7",
    tags: ["4DX", "Gold Class"],
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "crescent-mall",
    name: "CineVe Crescent Mall",
    city: "Hồ Chí Minh",
    address: "Lầu 5, Crescent Mall, Đại lộ Nguyễn Văn Linh, Q.7",
    distance: "5.1 km cách đây",
    rating: "4.8",
    tags: ["IMAX"],
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "dong-khoi",
    name: "CineVe Đồng Khởi",
    city: "Hồ Chí Minh",
    address: "Tầng 3, Vincom Center Đồng Khởi, 72 Lê Thánh Tôn, Q.1",
    distance: "0.8 km cách đây",
    rating: "4.6",
    tags: ["4DX"],
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "west-lake",
    name: "CineVe West Lake",
    city: "Hà Nội",
    address: "Tầng 4, Lotte Mall Tây Hồ, Võ Chí Công, Tây Hồ",
    distance: "2.8 km cách đây",
    rating: "4.8",
    tags: ["IMAX", "Gold Class"],
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "da-nang-riverside",
    name: "CineVe Đà Nẵng Riverside",
    city: "Đà Nẵng",
    address: "Tầng 5, Vincom Plaza, Ngô Quyền, Sơn Trà",
    distance: "4.0 km cách đây",
    rating: "4.7",
    tags: ["IMAX", "4DX"],
    image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=900&q=85"
  }
];

const cityOptions = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"];

function CinemasPage() {
  const [city, setCity] = useState("Hồ Chí Minh");
  const [keyword, setKeyword] = useState("");
  const [cinemaItems, setCinemaItems] = useState(cinemas);

  useEffect(() => {
    cinemaApi.list()
      .then((result) => {
        if (result?.length) {
          setCinemaItems(result.map(mapCinemaItem));
        }
      })
      .catch(() => setCinemaItems(cinemas));
  }, []);

  const filteredCinemas = useMemo(() => {
    return cinemaItems.filter((cinema) => {
      const matchesCity = cinema.city === city;
      const query = keyword.trim().toLowerCase();
      const matchesKeyword =
        query.length === 0 ||
        cinema.name.toLowerCase().includes(query) ||
        cinema.address.toLowerCase().includes(query);

      return matchesCity && matchesKeyword;
    });
  }, [cinemaItems, city, keyword]);

  return (
    <div className="cinemas-page">
      <CinemasNavbar />
      <main>
        <section className="cinemas-hero">
          <img
            src="https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=1900&q=85"
            alt="Không gian rạp chiếu phim"
          />
          <div className="cinemas-hero-gradient" />
          <div className="cinemas-hero-content">
            <h1>
              Hệ thống rạp chiếu phim <span>toàn quốc</span>
            </h1>
            <div className="cinema-search-panel">
              <label>
                <Search size={21} />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Tìm tên rạp, địa chỉ..."
                  type="text"
                />
              </label>
              <label>
                <MapPin size={21} />
                <select value={city} onChange={(event) => setCity(event.target.value)}>
                  {cityOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <button type="button">Tìm kiếm</button>
            </div>
          </div>
        </section>

        <section className="cinemas-section">
          <header className="cinemas-section-header">
            <div>
              <h2>{city}</h2>
              <p>Khám phá {filteredCinemas.length || 0} rạp chiếu phim đẳng cấp tại khu vực của bạn</p>
            </div>
            <div>
              <button type="button" aria-label="Lọc"><SlidersHorizontal size={22} /></button>
              <button type="button" aria-label="Dạng lưới"><Grid2X2 size={22} /></button>
            </div>
          </header>

          <div className="cinema-card-grid">
            {filteredCinemas.map((cinema) => (
              <CinemaCard cinema={cinema} key={cinema.id} />
            ))}
          </div>

          {filteredCinemas.length === 0 && (
            <div className="empty-cinemas">
              Không tìm thấy rạp phù hợp tại khu vực này.
            </div>
          )}

          <div className="load-more-cinemas">
            <button type="button">Tải thêm rạp chiếu</button>
          </div>
        </section>
      </main>
    </div>
  );
}

function CinemasNavbar() {
  return (
    <nav className="home-navbar solid">
      <div className="home-nav-shell">
        <Link to="/" className="home-brand">CineVe</Link>
        <div className="home-nav-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/phim">Phim</Link>
          <Link className="active" to="/rap">Rạp</Link>
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

function CinemaCard({ cinema }) {
  return (
    <article className="cinema-card">
      <div className="cinema-card-image">
        <img src={cinema.image} alt={cinema.name} />
        <div className="cinema-card-tags">
          {cinema.tags.map((tag) => <span className={tag.includes("Gold") ? "gold" : ""} key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="cinema-card-body">
        <div className="cinema-card-title">
          <h3>{cinema.name}</h3>
          <span>
            <Star size={18} fill="currentColor" />
            {cinema.rating}
          </span>
        </div>
        <p>
          <MapPin size={20} />
          {cinema.address}
        </p>
        <div className="cinema-card-footer">
          <span>{cinema.distance}</span>
          <Link to={`/chon-suat-chieu?cinemaId=${cinema.id}`}>Xem lịch chiếu</Link>
        </div>
      </div>
    </article>
  );
}

function CinemasFooter() {
  return (
    <footer className="cinemas-footer">
      <div>
        <section>
          <h2>CineVe</h2>
          <p>Nâng tầm trải nghiệm điện ảnh với hệ thống đặt vé hiện đại nhất Việt Nam. Phim hay, ghế đẹp, bắp nước sẵn sàng.</p>
          <div>
            <a href="#" aria-label="Website"><Globe2 size={20} /></a>
            <a href="#" aria-label="Phim"><Film size={20} /></a>
            <a href="#" aria-label="Email"><Mail size={20} /></a>
          </div>
        </section>
        <FooterColumn title="Liên kết nhanh" links={["Về chúng tôi", "Phim đang chiếu", "Rạp & Giá vé", "Khuyến mãi mới nhất"]} />
        <FooterColumn title="Hỗ trợ" links={["Điều khoản sử dụng", "Chính sách bảo mật", "Câu hỏi thường gặp", "Liên hệ"]} />
        <section>
          <h3>Tải ứng dụng</h3>
          <button type="button">
            <Smartphone size={22} />
            <span><small>Download on</small>App Store</span>
          </button>
          <button type="button">
            <Play size={22} />
            <span><small>Get it on</small>Google Play</span>
          </button>
        </section>
      </div>
      <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao.</p>
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

function mapCinemaItem(cinema) {
  return {
    id: cinema.id,
    name: cinema.name,
    city: cinema.city || "Hồ Chí Minh",
    address: cinema.address || "Đang cập nhật địa chỉ",
    distance: cinema.phone || "Xem lịch chiếu",
    rating: "4.8",
    tags: ["CineVe"],
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=85"
  };
}

export default CinemasPage;
