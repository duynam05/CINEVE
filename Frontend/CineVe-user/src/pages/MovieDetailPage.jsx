import { useState } from "react";
import { Bell, ChevronDown, Globe2, Mail, Play, Search, Star, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { movieApi, cinemaApi } from "../api/clientApi";
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
  
  // Create next 7 days for filtering
  const dynamicDates = useMemo(() => {
    const arr = [];
    const today = new Date();
    const weekdays = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isToday = i === 0;
      arr.push({
        weekday: isToday ? "H.Nay" : weekdays[d.getDay()],
        day: d.getDate().toString().padStart(2, "0"),
        month: months[d.getMonth()],
        fullDate: d.toISOString().split("T")[0] // YYYY-MM-DD
      });
    }
    return arr;
  }, []);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedCinemaId, setSelectedCinemaId] = useState("all");
  const [selectedTime, setSelectedTime] = useState("");
  
  const [movieData, setMovieData] = useState(movie);
  const [reviewItems, setReviewItems] = useState(reviews);
  const [showtimeGroups, setShowtimeGroups] = useState([]);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [cinemasList, setCinemasList] = useState([]);

  useEffect(() => {
    cinemaApi.list().then(data => {
      setCinemasList(data || []);
      if (data && data.length > 0) {
        setSelectedCinemaId(data[0].id); // Pick first cinema by default
      }
    }).catch(console.error);

    movieApi.detail(id).then(res => setMovieData(mapDetailMovie(res))).catch(() => setMovieData(movie));
    movieApi.reviews(id).then(res => setReviewItems(res?.length ? res.map(mapReview) : reviews)).catch(() => setReviewItems(reviews));
  }, [id]);

  useEffect(() => {
    if (!cinemasList.length) return;
    const selectedFullDate = dynamicDates[selectedDateIndex].fullDate;
    
    movieApi.showtimes(id, selectedFullDate)
      .then(res => {
        // Filter by selected cinema
        const filtered = (res || []).filter(st => st.cinemaId === selectedCinemaId);
        const mappedShowtimes = mapShowtimes(filtered);
        setShowtimeGroups(mappedShowtimes);
        if (mappedShowtimes[0]?.times?.[0]?.id) {
          setSelectedTime(mappedShowtimes[0].times[0].id);
        } else {
          setSelectedTime("");
        }
      })
      .catch(() => setShowtimeGroups([]));
  }, [id, selectedDateIndex, selectedCinemaId, cinemasList, dynamicDates]);

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
                  {dynamicDates.map((date, index) => (
                    <button
                      className={selectedDateIndex === index ? "active" : ""}
                      type="button"
                      key={index}
                      onClick={() => setSelectedDateIndex(index)}
                    >
                      <small>{date.weekday}</small>
                      <strong>{date.day}</strong>
                      <small>{date.month}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="booking-block">
                <p>Chọn rạp</p>
                <label className="detail-select">
                  <select value={selectedCinemaId} onChange={(e) => setSelectedCinemaId(e.target.value)}>
                    {cinemasList.length > 0 ? cinemasList.map((cinema) => (
                      <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
                    )) : <option value="all">Đang tải rạp...</option>}
                  </select>
                  <ChevronDown size={20} />
                </label>
              </div>

              <div className="showtime-blocks">
                {showtimeGroups.length > 0 ? showtimeGroups.map((group) => (
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
                )) : <p style={{ color: "var(--muted)", fontStyle: "italic", marginTop: 10 }}>Không có lịch chiếu cho ngày và rạp này.</p>}
              </div>

            <div className="booking-total">
                <div>
                  <p>Giá vé từ</p>
                  <strong>
                    {showtimeGroups.flatMap(g => g.times).find(t => (t.id || t) === selectedTime)?.price 
                      ? formatCurrency(showtimeGroups.flatMap(g => g.times).find(t => (t.id || t) === selectedTime).price)
                      : "---"}
                  </strong>
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
      acc[format].times.push({ id: item.id, label: formatTime(item.startTime), price: item.normalSeatPrice });
      return acc;
    }, {});

    return Object.values(groups);
  }

export default MovieDetailPage;
