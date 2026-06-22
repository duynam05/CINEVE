import { useMemo, useState } from "react";
import { Bell, CalendarDays, ChevronLeft, ChevronRight, Search, SlidersHorizontal, Star, Ticket, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { movieApi } from "../api/clientApi";
import AccountNavActions from "../components/common/AccountNavActions.jsx";
import { assetUrl, formatDate } from "../utils/format";

const movies = [
  {
    title: "Kẻ Độc Hành Cuối Cùng",
    id: "ke-doc-hanh-cuoi-cung",
    genres: "Hành động, Viễn tưởng",
    duration: "124 phút",
    releaseDate: "24/10/2026",
    rating: "8.9",
    age: "T16",
    status: "now",
    tags: ["HOT"],
    language: "Tiếng Anh",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Khu Vườn Kỳ Diệu",
    id: "khu-vuon-ky-dieu",
    genres: "Hoạt hình, Phiêu lưu",
    duration: "98 phút",
    releaseDate: "20/10/2026",
    rating: "9.2",
    age: "P",
    status: "now",
    tags: [],
    language: "Tiếng Việt",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Bóng Ma Thành Phố",
    id: "bong-ma-thanh-pho",
    genres: "Kinh dị, Giật gân",
    duration: "110 phút",
    releaseDate: "30/10/2026",
    rating: "8.5",
    age: "T18",
    status: "now",
    tags: [],
    language: "Tiếng Anh",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Liên Minh Công Lý",
    id: "lien-minh-cong-ly",
    genres: "Hành động, Anh hùng",
    duration: "145 phút",
    releaseDate: "01/11/2026",
    rating: "8.7",
    age: "T13",
    status: "now",
    tags: [],
    language: "Tiếng Anh",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Đế Chế Mới",
    id: "de-che-moi",
    genres: "Hành động, Phiêu lưu",
    duration: "132 phút",
    releaseDate: "12/12/2026",
    rating: "8.4",
    age: "T13",
    status: "soon",
    tags: ["SẮP CHIẾU"],
    language: "Tiếng Anh",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Mùa Hè Rực Rỡ",
    id: "mua-he-ruc-ro",
    genres: "Tình cảm, Hài",
    duration: "102 phút",
    releaseDate: "20/12/2026",
    rating: "8.1",
    age: "P",
    status: "soon",
    tags: ["SẮP CHIẾU"],
    language: "Tiếng Việt",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=85"
  }
];

const genres = ["Tất cả thể loại", "Hành động", "Hoạt hình", "Kinh dị", "Hài", "Tình cảm"];
const languages = ["Ngôn ngữ", "Tiếng Việt", "Tiếng Anh"];
const ageRatings = ["Độ tuổi", "P", "T13", "T16", "T18"];

function MoviesPage() {
  const [tab, setTab] = useState("now");
  const [movieItems, setMovieItems] = useState(movies);
  const [filters, setFilters] = useState({
    keyword: "",
    genre: "Tất cả thể loại",
    language: "Ngôn ngữ",
    age: "Độ tuổi"
  });

  useEffect(() => {
    movieApi.list()
      .then((result) => {
        if (result?.length) {
          setMovieItems(result.map(mapMovieItem));
        }
      })
      .catch(() => setMovieItems(movies));
  }, []);

  const filteredMovies = useMemo(() => {
    return movieItems.filter((movie) => {
      const matchTab = movie.status === tab;
      const matchKeyword = movie.title.toLowerCase().includes(filters.keyword.trim().toLowerCase());
      const matchGenre = filters.genre === "Tất cả thể loại" || movie.genres.includes(filters.genre);
      const matchLanguage = filters.language === "Ngôn ngữ" || movie.language === filters.language;
      const matchAge = filters.age === "Độ tuổi" || movie.age === filters.age;

      return matchTab && matchKeyword && matchGenre && matchLanguage && matchAge;
    });
  }, [filters, movieItems, tab]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      genre: "Tất cả thể loại",
      language: "Ngôn ngữ",
      age: "Độ tuổi"
    });
  };

  return (
    <div className="movies-page">
      <MoviesNavbar />
      <main className="movies-main">
        <header className="movies-header">
          <div>
            <h1>Danh sách phim</h1>
            <p>Khám phá những siêu phẩm điện ảnh mới nhất, từ hành động nghẹt thở đến tình cảm lãng mạn, chỉ có tại CineVe.</p>
          </div>
          <div className="movie-tabs">
            <button className={tab === "now" ? "active" : ""} type="button" onClick={() => setTab("now")}>
              Đang Chiếu
            </button>
            <button className={tab === "soon" ? "active" : ""} type="button" onClick={() => setTab("soon")}>
              Sắp Chiếu
            </button>
          </div>
        </header>

        <section className="movie-filters" aria-label="Bộ lọc phim">
          <label className="movie-search">
            <Search size={20} />
            <input
              value={filters.keyword}
              onChange={(event) => updateFilter("keyword", event.target.value)}
              placeholder="Tìm tên phim..."
              type="text"
            />
          </label>
          <FilterSelect value={filters.genre} onChange={(value) => updateFilter("genre", value)} options={genres} />
          <FilterSelect value={filters.language} onChange={(value) => updateFilter("language", value)} options={languages} />
          <FilterSelect value={filters.age} onChange={(value) => updateFilter("age", value)} options={ageRatings} />
          <button className="reset-filter-button" type="button" onClick={resetFilters}>
            <SlidersHorizontal size={18} />
            Lọc lại
          </button>
        </section>

        <section className="movies-list-grid">
          {filteredMovies.map((movie) => (
            <MovieListCard movie={movie} key={movie.title} />
          ))}
        </section>

        {filteredMovies.length === 0 && (
          <div className="empty-movies">
            Không tìm thấy phim phù hợp với bộ lọc hiện tại.
          </div>
        )}

        <div className="movies-pagination">
          <button type="button" aria-label="Trang trước">
            <ChevronLeft size={20} />
          </button>
          <button className="active" type="button">1</button>
          <button type="button">2</button>
          <button type="button">3</button>
          <span>...</span>
          <button type="button" aria-label="Trang sau">
            <ChevronRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}

function MoviesNavbar() {
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

function FilterSelect({ value, onChange, options }) {
  return (
    <select className="movie-select" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

function MovieListCard({ movie }) {
  return (
    <article className="movie-list-card">
      <div className="movie-list-poster">
        <img src={movie.image} alt={movie.title} />
        <div className="movie-badges">
          {movie.tags.map((tag) => <span className="hot" key={tag}>{tag}</span>)}
          <span className={`age age-${movie.age.toLowerCase()}`}>{movie.age}</span>
        </div>
        <div className="movie-poster-shade" />
        <div className="movie-list-actions">
          <button type="button">
            <Ticket size={19} />
            Đặt Vé Ngay
          </button>
          <Link to={`/phim/${movie.id}`}>Xem Chi Tiết</Link>
        </div>
      </div>
      <div className="movie-list-body">
        <div className="movie-title-row">
          <h3>{movie.title}</h3>
          <span>
            <Star size={15} fill="currentColor" />
            {movie.rating}
          </span>
        </div>
        <p>{movie.genres}</p>
        <div className="movie-info-grid">
          <span><Timer size={16} />{movie.duration}</span>
          <span><CalendarDays size={16} />{movie.releaseDate}</span>
        </div>
      </div>
    </article>
  );
}

function MoviesFooter() {
  return (
    <footer className="movies-footer">
      <div className="movies-footer-grid">
        <div>
          <Link className="footer-brand" to="/">CineVe</Link>
          <p>Trải nghiệm đặt vé xem phim hiện đại, nhanh chóng và bảo mật hàng đầu Việt Nam.</p>
        </div>
        <FooterColumn title="Liên kết nhanh" links={["Về chúng tôi", "Chính sách bảo mật", "Điều khoản sử dụng"]} />
        <FooterColumn title="Hệ thống" links={["Liên hệ", "Hệ thống rạp", "Tuyển dụng"]} />
        <div>
          <h3>Theo dõi chúng tôi</h3>
          <div className="movies-socials">
            <span>F</span>
            <span>Y</span>
          </div>
          <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao.</p>
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

function mapMovieItem(movie) {
  return {
    title: movie.title,
    id: movie.id,
    genres: (movie.genres || []).map((genre) => genre.name).join(", ") || "Đang cập nhật",
    duration: `${movie.durationMinutes || "--"} phút`,
    releaseDate: formatDate(movie.releaseDate),
    rating: movie.ageRating || "P",
    age: movie.ageRating || "P",
    status: movie.status === "COMING_SOON" ? "soon" : "now",
    tags: movie.status === "NOW_SHOWING" ? ["HOT"] : [],
    language: movie.language || "Tiếng Việt",
    image: assetUrl(movie.posterUrl)
  };
}

export default MoviesPage;
