import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Clapperboard,
  Film,
  LayoutDashboard,
  Pencil,
  Plus,
  Popcorn,
  Search,
  Settings,
  Ticket,
  Trash2,
  UserRound,
  Warehouse,
  X,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { adminCinemaApi, adminMovieApi, adminShowtimeApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import { asArray, formatCurrency, formatDate, formatTimeRange, toAbsoluteImage } from "../api/formatters";

function ShowtimeManagementPage() {
  const [showAlert, setShowAlert] = useState(false);
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [filters, setFilters] = useState({ movieId: "all", cinemaId: "all", date: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadOptions = async () => {
    try {
      const [movieData, cinemaData] = await Promise.all([adminMovieApi.list(), adminCinemaApi.list()]);
      setMovies(asArray(movieData));
      setCinemas(asArray(cinemaData));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const loadShowtimes = async () => {
    try {
      setLoading(true);
      const params = {
        movieId: filters.movieId === "all" ? undefined : filters.movieId,
        cinemaId: filters.cinemaId === "all" ? undefined : filters.cinemaId,
        date: filters.date || undefined
      };
      const data = await adminShowtimeApi.list(params);
      setShowtimes(asArray(data).map(mapShowtime));
      setShowAlert(false);
    } catch (error) {
      setShowAlert(true);
      toast.error(getErrorMessage(error));
      setShowtimes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    loadShowtimes();
  }, []);

  const handleDelete = async (item) => {
    try {
      await adminShowtimeApi.remove(item.id);
      toast.success("Thao tác thành công");
      loadShowtimes();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const visibleMovies = useMemo(() => movies.filter((movie) => movie.status !== "HIDDEN"), [movies]);

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="showtime-main">
          <section className="showtime-heading">
            <div>
              <h1>Quản lý lịch chiếu</h1>
              <p>{loading ? "Đang tải dữ liệu..." : "Điều phối và sắp xếp lịch chiếu phim"}</p>
            </div>
            <Link to="/showtimes/new">
              <Plus size={20} />
              Thêm suất chiếu
            </Link>
          </section>

          <section className="showtime-filter-bar">
            <label>
              <span><Film size={18} /> Lọc theo phim</span>
              <select value={filters.movieId} onChange={(event) => setFilters((current) => ({ ...current, movieId: event.target.value }))}>
                <option value="all">Tất cả phim</option>
                {visibleMovies.map((movie) => (
                  <option value={movie.id} key={movie.id}>{movie.title}</option>
                ))}
              </select>
            </label>
            <label>
              <span><Warehouse size={18} /> Lọc theo rạp</span>
              <select value={filters.cinemaId} onChange={(event) => setFilters((current) => ({ ...current, cinemaId: event.target.value }))}>
                <option value="all">Tất cả cụm rạp</option>
                {cinemas.map((cinema) => (
                  <option value={cinema.id} key={cinema.id}>{cinema.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span><CalendarDays size={18} /> Chọn ngày</span>
              <input type="date" value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} />
            </label>
            <button type="button" className="showtime-filter-button" onClick={loadShowtimes}>Lọc dữ liệu</button>
          </section>

          {showAlert && (
            <section className="showtime-alert">
              <AlertTriangle size={32} />
              <div>
                <h2>Cảnh báo trùng lặp!</h2>
                <p>Backend trả lỗi khi tải hoặc xử lý lịch chiếu. Vui lòng kiểm tra dữ liệu và thử lại.</p>
              </div>
              <button type="button" onClick={() => setShowAlert(false)} aria-label="Đóng cảnh báo">
                <X size={20} />
              </button>
            </section>
          )}

          <section className="showtime-table-card">
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Phim / Phòng</th>
                    <th>Loại vé</th>
                    <th>Giá niêm yết</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {showtimes.length ? showtimes.map((item) => (
                    <tr className={item.tone === "conflict" ? "conflict" : ""} key={item.id}>
                      <td>
                        <strong>{item.time}</strong>
                        <span>{item.date}</span>
                      </td>
                      <td>
                        <div className="showtime-movie-cell">
                          <img src={item.poster} alt={item.movie} />
                          <div>
                            <strong>{item.movie}</strong>
                            <span className={item.tone === "conflict" ? "danger" : ""}>
                              <Clapperboard size={14} />
                              {item.room}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="showtime-ticket-tags">
                          {item.tickets.map((ticket) => (
                            <span key={ticket}>{ticket}</span>
                          ))}
                        </div>
                      </td>
                      <td>{item.price}</td>
                      <td>
                        <span className={`showtime-status ${item.tone}`}>{item.status}</span>
                      </td>
                      <td>
                        <div className="showtime-actions">
                          <button type="button" aria-label={`Sửa ${item.movie}`}><Pencil size={17} /></button>
                          <button type="button" aria-label={`Xóa ${item.movie}`} onClick={() => handleDelete(item)}><Trash2 size={17} /></button>
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
          </section>
        </main>
      </div>
      {isModalOpen && <AddShowtimeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function ShowtimeSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies" },
    { label: "Rạp", icon: Warehouse, to: "/cinemas" },
    { label: "Phòng chiếu", icon: Clapperboard, to: "/rooms" },
    { label: "Lịch chiếu", icon: CalendarDays, to: "/showtimes", active: true },
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
        <span className="admin-letter-avatar"><UserRound size={20} /></span>
        <div>
          <strong>Admin Profile</strong>
          <span>Administrator</span>
        </div>
      </div>
    </aside>
  );
}

function ShowtimeTopbar() {
  return (
    <header className="admin-topbar">
      <label className="admin-search">
        <Search size={18} />
        <input placeholder="Tìm kiếm phim, rạp, lịch chiếu..." />
      </label>
      <div className="admin-topbar-actions">
        <button type="button" aria-label="Thông báo" className="admin-icon-button has-dot"><Bell size={20} /></button>
        <button type="button" aria-label="Cài đặt" className="admin-icon-button"><Settings size={20} /></button>
        <span className="topbar-divider" />
        <div className="admin-greeting">
          <strong>Xin chào, Admin</strong>
          <span>Hệ thống đang ổn định</span>
        </div>
      </div>
    </header>
  );
}

function AddShowtimeModal({ onClose }) {
  return null;
}

function mapShowtime(item) {
  return {
    id: item.id,
    time: formatTimeRange(item.startTime, item.endTime),
    date: formatDate(item.startTime),
    movie: item.movieTitle || "--",
    room: `${item.roomName || "--"} • ${item.cinemaName || "--"}`,
    poster: toAbsoluteImage(item.posterUrl),
    tickets: ["Thường", "VIP", "Đôi"],
    price: `${formatCurrency(item.normalSeatPrice)} - ${formatCurrency(item.vipSeatPrice)}`,
    status: showtimeStatusLabel(item.status),
    tone: item.status === "CANCELLED" ? "conflict" : "active"
  };
}

function showtimeStatusLabel(status) {
  return {
    OPEN: "Đang mở bán",
    CLOSED: "Đã đóng",
    CANCELLED: "Đã hủy",
    FINISHED: "Đã kết thúc"
  }[status] || "--";
}

export default ShowtimeManagementPage;
