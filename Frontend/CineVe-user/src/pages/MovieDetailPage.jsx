import { useState } from "react";
import { Bell, ChevronDown, Globe2, Mail, Play, Search, Star, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { movieApi } from "../api/clientApi";
import AccountNavActions from "../components/common/AccountNavActions.jsx";
import TrailerModal from "../components/common/TrailerModal.jsx";
import { assetUrl, formatTime } from "../utils/format";

const movie = {
  title: "Dune: Hành Tinh Cát - Phần 2",
  poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=85",
  backdrop: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1900&q=85",
  genres: ["Khoa học Viễn tưởng", "Hành động"],
  age: "C16",
  rating: "4.9",
  reviewCount: "2,450",
  description:
    "Tiếp nối câu chuyện về Paul Atreides khi anh hợp lực với Chani và người Fremen để trả thù những kẻ đã tiêu diệt gia đình mình. Đối mặt với sự lựa chọn giữa tình yêu và số phận vũ trụ, anh phải ngăn chặn một tương lai tàn khốc mà chỉ mình anh mới có thể nhìn thấy.",
  details: [
    ["Đạo diễn", "Denis Villeneuve"],
    ["Thời lượng", "166 phút"],
    ["Quốc gia", "Hoa Kỳ"],
    ["Ngôn ngữ", "Tiếng Anh (Phụ đề)"]
  ],
  cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson, Josh Brolin, Austin Butler, Florence Pugh"
};

const dates = [
  { weekday: "Th 3", day: "12", month: "Mar" },
  { weekday: "Th 4", day: "13", month: "Mar" },
  { weekday: "Th 5", day: "14", month: "Mar" },
  { weekday: "Th 6", day: "15", month: "Mar" }
];

const cinemas = [
  "CineVe - Vincom Center Quận 1",
  "CineVe - Landmark 81",
  "CineVe - Crescent Mall",
  "CineVe - Gigamall Thủ Đức"
];

const showtimes = [
  { format: "2D Phụ đề", tone: "standard", times: ["19:00", "21:30", "22:45"] },
  { format: "IMAX Sapphire", tone: "premium", times: ["20:15", "23:00"] }
];

const reviews = [
  {
    name: "Trần Hoàng",
    initials: "TH",
    time: "Hôm qua",
    rating: "5.0",
    text: "Một kiệt tác điện ảnh thực thụ! Hình ảnh và âm thanh bùng nổ, đặc biệt là các phân cảnh trên rạp IMAX. Cốt truyện sâu sắc hơn phần 1 rất nhiều."
  },
  {
    name: "Minh Ngọc",
    initials: "MN",
    time: "3 ngày trước",
    rating: "4.5",
    text: "Diễn xuất của Austin Butler quá xuất sắc. Một trải nghiệm thị giác không thể bỏ lỡ tại rạp."
  }
];

function MovieDetailPage() {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("20:15");
  const [movieData, setMovieData] = useState(movie);
  const [reviewItems, setReviewItems] = useState(reviews);
  const [showtimeGroups, setShowtimeGroups] = useState(showtimes);
  const [activeTrailer, setActiveTrailer] = useState(null);

  useEffect(() => {
    Promise.all([movieApi.detail(id), movieApi.reviews(id), movieApi.showtimes(id)])
      .then(([movieResult, reviewResult, showtimeResult]) => {
        setMovieData(mapDetailMovie(movieResult));
        setReviewItems(reviewResult?.length ? reviewResult.map(mapReview) : reviews);
        const mappedShowtimes = mapShowtimes(showtimeResult || []);
        setShowtimeGroups(mappedShowtimes.length ? mappedShowtimes : showtimes);
        if (mappedShowtimes[0]?.times?.[0]?.id) {
          setSelectedTime(mappedShowtimes[0].times[0].id);
        }
      })
      .catch(() => {
        setMovieData(movie);
        setReviewItems(reviews);
        setShowtimeGroups(showtimes);
      });
  }, [id]);

  const handleOpenTrailer = () => {
    if (!movieData.trailerUrl) {
      window.alert("Phim này chưa có trailer");
      return;
    }

    setActiveTrailer(movieData);
  };

  return (
    <div className="movie-detail-page">
      <DetailNavbar />
      <main>
        <section className="detail-hero">
          <img className="detail-backdrop" src={movieData.backdrop} alt={movieData.title} />
          <div className="detail-hero-gradient" />
          <div className="detail-hero-content">
            <div className="detail-poster">
              <img src={movieData.poster} alt={`Poster ${movieData.title}`} />
            </div>
            <div className="detail-summary">
              <div className="detail-tags">
                <span className="age-tag">{movieData.age}</span>
                {movieData.genres.map((genre) => <span key={genre}>{genre}</span>)}
              </div>
              <h1>{movieData.title}</h1>
              <div className="detail-actions-row">
                <button className="trailer-button" type="button" onClick={handleOpenTrailer}>
                  <Play size={20} fill="currentColor" />
                  Xem Trailer
                </button>
                <div className="detail-rating">
                  <Star size={22} fill="currentColor" />
                  <strong>{movieData.rating}</strong>
                  <span>({movieData.reviewCount} đánh giá)</span>
                </div>
              </div>
              <p>{movieData.description}</p>
            </div>
          </div>
        </section>

        <section className="detail-content-shell">
          <div className="detail-left">
            <div className="movie-info-panel">
              {movieData.details.map(([label, value]) => (
                <div key={label}>
                  <p>{label}</p>
                  <strong>{value}</strong>
                </div>
              ))}
              <div className="cast-row">
                <p>Diễn viên</p>
                <strong>{movieData.cast}</strong>
              </div>
            </div>

            <section className="reviews-section">
              <div className="reviews-heading">
                <h2>Đánh giá từ khán giả</h2>
                <button type="button">Xem tất cả</button>
              </div>
              <div className="reviews-grid">
                {reviewItems.map((review) => (
                  <article className="review-card" key={review.name}>
                    <div className="review-top">
                      <div className="review-user">
                        <span>{review.initials}</span>
                        <div>
                          <strong>{review.name}</strong>
                          <p>{review.time}</p>
                        </div>
                      </div>
                      <div className="review-rating">
                        <Star size={15} fill="currentColor" />
                        {review.rating}
                      </div>
                    </div>
                    <p>"{review.text}"</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="booking-panel">
            <h2>
              <Ticket size={24} />
              Chọn suất chiếu
            </h2>

            <div className="booking-block">
              <p>Ngày chiếu</p>
              <div className="date-list">
                {dates.map((date, index) => (
                  <button
                    className={selectedDate === index ? "active" : ""}
                    type="button"
                    key={`${date.weekday}-${date.day}`}
                    onClick={() => setSelectedDate(index)}
                  >
                    <span>{date.weekday}</span>
                    <strong>{date.day}</strong>
                    <small>{date.month}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="booking-block">
              <p>Chọn rạp</p>
              <label className="detail-select">
                <select defaultValue={cinemas[0]}>
                  {cinemas.map((cinema) => <option key={cinema}>{cinema}</option>)}
                </select>
                <ChevronDown size={20} />
              </label>
            </div>

            <div className="showtime-blocks">
              {showtimeGroups.map((group) => (
                <div className="showtime-group" key={group.format}>
                  <p className={group.tone}>
                    <span />
                    {group.format}
                  </p>
                  <div className="showtime-buttons">
                    {group.times.map((time) => (
                      <button
                        className={`${group.tone} ${selectedTime === (time.id || time) ? "active" : ""}`}
                        type="button"
                        key={time.id || time}
                        onClick={() => setSelectedTime(time.id || time)}
                      >
                        {time.label || time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="booking-total">
              <div>
                <p>Giá vé từ</p>
                <strong>120.000đ</strong>
              </div>
              <div>
                <p>Phí dịch vụ</p>
                <span>Miễn phí</span>
              </div>
            </div>
            <Link className="booking-submit link-submit" to={selectedTime?.length > 10 ? `/chon-ghe?showtimeId=${selectedTime}` : `/chon-suat-chieu?movieId=${id}`}>Đặt Vé Ngay</Link>
          </aside>
        </section>
      </main>
      <TrailerModal title={activeTrailer?.title} trailerUrl={activeTrailer?.trailerUrl} onClose={() => setActiveTrailer(null)} />
    </div>
  );
}

function DetailNavbar() {
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

function DetailFooter() {
  return (
    <footer className="detail-footer">
      <div className="detail-footer-grid">
        <div className="detail-footer-brand">
          <Link to="/">CineVe</Link>
          <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao. Mang cả thế giới điện ảnh đến trong tầm tay bạn.</p>
          <div>
            <button type="button" aria-label="Website"><Globe2 size={20} /></button>
            <button type="button" aria-label="Email"><Mail size={20} /></button>
          </div>
        </div>
        <FooterLinks title="Khám phá" links={["Về chúng tôi", "Liên hệ", "Hệ thống rạp"]} />
        <FooterLinks title="Hỗ trợ" links={["Chính sách bảo mật", "Điều khoản sử dụng", "FAQ"]} />
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {links.map((link) => <li key={link}><a href="#">{link}</a></li>)}
      </ul>
    </div>
  );
}

function mapDetailMovie(item) {
  return {
    title: item.title,
    poster: assetUrl(item.posterUrl),
    backdrop: assetUrl(item.posterUrl),
    genres: (item.genres || []).map((genre) => genre.name),
    age: item.ageRating || "P",
    rating: "5.0",
    reviewCount: "0",
    description: item.description || movie.description,
    trailerUrl: item.trailerUrl || "",
    details: [
      ["Đạo diễn", item.director || "Đang cập nhật"],
      ["Thời lượng", `${item.durationMinutes || "--"} phút`],
      ["Quốc gia", item.country || "Đang cập nhật"],
      ["Ngôn ngữ", item.language || "Đang cập nhật"]
    ],
    cast: item.actors || "Đang cập nhật"
  };
}

function mapReview(item) {
  const name = item.userFullName || "Khán giả CineVe";
  return {
    name,
    initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    time: "Gần đây",
    rating: `${item.rating || 5}.0`,
    text: item.content || "Người dùng chưa viết nội dung đánh giá."
  };
}

function mapShowtimes(items) {
  const groups = items.reduce((acc, item) => {
    const format = item.roomType || "2D";
    if (!acc[format]) {
      acc[format] = { format, tone: format === "IMAX" || format === "VIP" ? "premium" : "standard", times: [] };
    }
    acc[format].times.push({ id: item.id, label: formatTime(item.startTime) });
    return acc;
  }, {});

  return Object.values(groups);
}

export default MovieDetailPage;
