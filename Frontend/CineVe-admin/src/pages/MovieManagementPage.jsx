import React, { useEffect, useMemo, useState } from "react";
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
  Warehouse
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminMovieApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import { asArray, formatDate, movieStatusLabel, movieStatusTone, toAbsoluteImage } from "../api/formatters";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

function MovieManagementPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await adminMovieApi.list();
      setMovies(asArray(data).map(mapMovie));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const visibleMovies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return movies;
    return movies.filter((movie) =>
      [movie.title, movie.description, movie.status].join(" ").toLowerCase().includes(normalized)
    );
  }, [movies, query]);

  const handleDelete = async (movie) => {
    try {
      await adminMovieApi.remove(movie.id);
      toast.success("Thao tác thành công");
      loadMovies();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleStatusToggle = async (movie) => {
    try {
      const nextStatus = movie.rawStatus === "HIDDEN" ? "NOW_SHOWING" : "HIDDEN";
      await adminMovieApi.updateStatus(movie.id, nextStatus);
      toast.success("Thao tác thành công");
      loadMovies();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="movie-admin-main">
          <header className="movie-admin-heading">
            <div>
              <h1>Quản lý phim</h1>
              <p>{loading ? "Đang tải dữ liệu..." : "Danh sách và thông tin các phim đang chiếu"}</p>
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
            <MovieStat icon={Film} label="Tổng số phim" value={movies.length} tone="red" />
            <MovieStat icon={Clapperboard} label="Đang công chiếu" value={movies.filter((movie) => movie.rawStatus === "NOW_SHOWING").length} tone="gold" />
            <MovieStat icon={CalendarDays} label="Sắp khởi chiếu" value={movies.filter((movie) => movie.rawStatus === "COMING_SOON").length} tone="silver" />
          </section>

          <MovieTable
            movies={visibleMovies}
            total={movies.length}
            onDelete={handleDelete}
            onView={(movie) => navigate(`/movies/new?id=${movie.id}&mode=view`)}
            onEdit={(movie) => navigate(`/movies/new?id=${movie.id}&mode=edit`)}
            onStatusToggle={handleStatusToggle}
          />
        </main>
        <MovieFooter />
      </div>
    </div>
  );
}

function MovieSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies", active: true },
    { label: "Rạp", icon: Warehouse, to: "/cinemas" },
    { label: "Phòng chiếu", icon: Clapperboard, to: "/rooms" },
    { label: "Lịch chiếu", icon: CalendarDays, to: "/showtimes" },
    { label: "Đặt vé", icon: Ticket, to: "/bookings" },
    { label: "Đồ ăn/Combo", icon: Popcorn, to: "/foods" },
    { label: "Mã giảm giá", icon: Ticket, to: "/promotions" }
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

function MovieTable({ movies, total, onDelete, onView, onEdit, onStatusToggle }) {
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
            {movies.length ? movies.map((movie) => (
              <tr key={movie.id || movie.title}>
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
                    <button type="button" aria-label={`Xem ${movie.title}`} onClick={() => onView(movie)}><Eye size={17} /></button>
                    <button type="button" aria-label={`Sửa ${movie.title}`} onClick={() => onEdit(movie)}><Pencil size={17} /></button>
                    <button type="button" aria-label={`Xóa ${movie.title}`} onClick={() => onDelete(movie)}><Trash2 size={17} /></button>
                    <button type="button" aria-label={`Đổi trạng thái ${movie.title}`} onClick={() => onStatusToggle(movie)}><MoreVertical size={17} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6">Chưa có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="movie-pagination">
        <span>Đang hiển thị 1-{movies.length} của {total} phim</span>
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

function mapMovie(movie) {
  const genres = asArray(movie.genres).map((genre) => genre.name).filter(Boolean);
  return {
    id: movie.id,
    title: movie.title || "--",
    description: genres.join(", ") || movie.description || "--",
    formats: genres.length ? genres : [movie.language || "2D"],
    duration: `${movie.durationMinutes ?? 0} phút`,
    releaseDate: formatDate(movie.releaseDate),
    status: movieStatusLabel(movie.status),
    rawStatus: movie.status,
    tone: movieStatusTone(movie.status),
    poster: toAbsoluteImage(movie.posterUrl)
  };
}

export default MovieManagementPage;
