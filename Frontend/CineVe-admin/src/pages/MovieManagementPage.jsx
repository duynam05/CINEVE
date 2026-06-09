import React, { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Eye,
  Film,
  LayoutDashboard,
  MoreVertical,
  Pencil,
  Plus,
  Popcorn,
  Search,
  Settings,
  Ticket,
  Trash2,
  Upload,
  Warehouse,
  X
} from "lucide-react";
import { Link } from "react-router-dom";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

const movies = [
  {
    title: "Dune: Part Two",
    description: "Hành động, Viễn tưởng",
    formats: ["IMAX", "2D"],
    duration: "166 phút",
    releaseDate: "01/03/2024",
    status: "Đang chiếu",
    tone: "showing",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=320&q=85"
  },
  {
    title: "Inside Out 2",
    description: "Hoạt hình, Hài hước",
    formats: ["3D", "Lồng tiếng"],
    duration: "96 phút",
    releaseDate: "14/06/2024",
    status: "Sắp chiếu",
    tone: "upcoming",
    poster: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=320&q=85"
  },
  {
    title: "Oppenheimer",
    description: "Lịch sử, Chính kịch",
    formats: ["2D", "Vietsub"],
    duration: "180 phút",
    releaseDate: "11/08/2023",
    status: "Ngừng chiếu",
    tone: "ended",
    poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=320&q=85"
  }
];

function MovieManagementPage() {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleMovies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return movies;
    return movies.filter((movie) =>
      [movie.title, movie.description, movie.status].join(" ").toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <div className="admin-shell">
      <MovieSidebar />
      <div className="admin-workspace">
        <MovieTopbar />
        <main className="movie-admin-main">
          <header className="movie-admin-heading">
            <div>
              <h1>Quản lý phim</h1>
              <p>Danh sách và thông tin các phim đang chiếu</p>
            </div>
          </header>

          <section className="movie-action-bar">
            <label className="movie-local-search">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm kiếm phim..." />
            </label>
            <Link className="add-movie-button" to="/movies/new">
              <Plus size={18} />
              Thêm phim mới
            </Link>
          </section>

          <section className="movie-stat-grid">
            <MovieStat icon={Film} label="Tổng số phim" value="124" tone="red" />
            <MovieStat icon={Clapperboard} label="Đang công chiếu" value="12" tone="gold" />
            <MovieStat icon={CalendarDays} label="Sắp khởi chiếu" value="8" tone="silver" />
          </section>

          <MovieTable movies={visibleMovies} />
        </main>
        <MovieFooter />
      </div>
      {isModalOpen && <AddMovieModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function MovieSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies", active: true },
    { label: "Rạp", icon: Warehouse, to: "/cinemas" },
    { label: "Phòng chiếu", icon: Clapperboard, to: "#" },
    { label: "Lịch chiếu", icon: CalendarDays, to: "#" },
    { label: "Đặt vé", icon: Ticket, to: "#" },
    { label: "Đồ ăn/Combo", icon: Popcorn, to: "#" },
    { label: "Mã giảm giá", icon: Ticket, to: "#" }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>CineVe</h2>
        <p>Quản trị hệ thống</p>
      </div>
      <nav className="admin-nav movie-admin-nav">
        {items.map((item) => (
          <Link className={item.active ? "active" : ""} to={item.to} key={item.label}>
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="admin-profile-card">
        <img src={adminAvatar} alt="Admin" />
        <div>
          <strong>Quản trị viên</strong>
          <span>CineVe Admin</span>
        </div>
      </div>
    </aside>
  );
}

function MovieTopbar() {
  return (
    <header className="admin-topbar">
      <label className="admin-search">
        <Search size={18} />
        <input placeholder="Tìm kiếm phim, rạp, lịch chiếu..." />
      </label>
      <div className="admin-topbar-actions">
        <button type="button" aria-label="Thông báo" className="admin-icon-button has-dot">
          <Bell size={20} />
        </button>
        <button type="button" aria-label="Cài đặt" className="admin-icon-button">
          <Settings size={20} />
        </button>
        <span className="topbar-divider" />
        <div className="admin-greeting">
          <strong>Xin chào, Admin</strong>
          <span>Hệ thống đang ổn định</span>
        </div>
      </div>
    </header>
  );
}

function MovieStat({ icon: Icon, label, value, tone }) {
  return (
    <article className={`movie-stat-card ${tone}`}>
      <div>
        <Icon size={38} />
        <strong>{value}</strong>
      </div>
      <p>{label}</p>
    </article>
  );
}

function MovieTable({ movies }) {
  return (
    <section className="movie-table-card">
      <div className="movie-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Poster & Tiêu đề</th>
              <th>Thể loại</th>
              <th>Thời lượng</th>
              <th>Khởi chiếu</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.title}>
                <td>
                  <div className="movie-title-cell">
                    <img src={movie.poster} alt={movie.title} />
                    <div>
                      <strong>{movie.title}</strong>
                      <span>{movie.description}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="movie-format-list">
                    {movie.formats.map((format) => (
                      <span key={format}>{format}</span>
                    ))}
                  </div>
                </td>
                <td>{movie.duration}</td>
                <td>{movie.releaseDate}</td>
                <td>
                  <span className={`movie-status ${movie.tone}`}>
                    <i />
                    {movie.status}
                  </span>
                </td>
                <td>
                  <div className="movie-row-actions">
                    <button type="button" aria-label={`Xem ${movie.title}`}><Eye size={17} /></button>
                    <button type="button" aria-label={`Sửa ${movie.title}`}><Pencil size={17} /></button>
                    <button type="button" aria-label={`Xóa ${movie.title}`}><Trash2 size={17} /></button>
                    <button type="button" aria-label={`Thêm thao tác ${movie.title}`}><MoreVertical size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="movie-pagination">
        <span>Đang hiển thị 1-{movies.length} của 124 phim</span>
        <div>
          <button type="button"><ChevronLeft size={18} /></button>
          <button type="button" className="active">1</button>
          <button type="button">2</button>
          <button type="button">3</button>
          <span>...</span>
          <button type="button"><ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

function AddMovieModal({ onClose }) {
  return (
    <div className="movie-modal">
      <button className="movie-modal-overlay" type="button" aria-label="Đóng modal" onClick={onClose} />
      <section className="movie-modal-panel">
        <header>
          <h2>Thêm phim mới</h2>
          <button type="button" onClick={onClose} aria-label="Đóng">
            <X size={22} />
          </button>
        </header>
        <form className="movie-form" onSubmit={(event) => event.preventDefault()}>
          <div className="movie-form-grid poster-layout">
            <label className="poster-upload">
              <span>Poster phim</span>
              <div>
                <Upload size={38} />
                <p>Tải lên file ảnh JPG, PNG, WebP</p>
              </div>
            </label>
            <div className="movie-form-stack">
              <label>
                <span>Tiêu đề phim</span>
                <input placeholder="Nhập tên phim..." />
              </label>
              <div className="movie-form-grid">
                <label>
                  <span>Thể loại</span>
                  <select defaultValue="Hành động">
                    <option>Hành động</option>
                    <option>Kinh dị</option>
                    <option>Hoạt hình</option>
                    <option>Tình cảm</option>
                    <option>Hài hước</option>
                  </select>
                </label>
                <fieldset>
                  <legend>Định dạng</legend>
                  <label><input type="checkbox" />2D</label>
                  <label><input type="checkbox" />3D</label>
                  <label><input type="checkbox" />IMAX</label>
                </fieldset>
              </div>
            </div>
          </div>
          <div className="movie-form-grid">
            <label>
              <span>Thời lượng (phút)</span>
              <input type="number" placeholder="Ví dụ: 120" />
            </label>
            <label>
              <span>Ngày khởi chiếu</span>
              <input type="date" />
            </label>
          </div>
          <label>
            <span>Mô tả phim</span>
            <textarea rows="4" placeholder="Nhập tóm tắt nội dung phim..." />
          </label>
          <div className="movie-form-grid">
            <label>
              <span>Đạo diễn</span>
              <input />
            </label>
            <label>
              <span>Trạng thái</span>
              <select defaultValue="Đang chiếu">
                <option>Đang chiếu</option>
                <option>Sắp khởi chiếu</option>
                <option>Ngừng chiếu</option>
              </select>
            </label>
          </div>
        </form>
        <footer>
          <button type="button" className="modal-cancel" onClick={onClose}>Hủy</button>
          <button type="button" className="modal-save" onClick={onClose}>Lưu phim</button>
        </footer>
      </section>
    </div>
  );
}

function MovieFooter() {
  return (
    <footer className="movie-admin-footer">
      <span>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao.</span>
      <nav>
        <a href="#about">Về chúng tôi</a>
        <a href="#contact">Liên hệ</a>
        <a href="#cinemas">Hệ thống rạp</a>
      </nav>
    </footer>
  );
}

export default MovieManagementPage;
