import React, { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clapperboard,
  Film,
  LayoutDashboard,
  LogOut,
  Popcorn,
  Save,
  Settings,
  Ticket,
  Warehouse
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { adminCinemaApi, adminMovieApi, adminRoomApi, adminShowtimeApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import { asArray } from "../api/formatters";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

function AddShowtimePage() {
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("");

  useEffect(() => {
    Promise.all([adminMovieApi.list(), adminCinemaApi.list()])
      .then(([movieData, cinemaData]) => {
        setMovies(asArray(movieData));
        setCinemas(asArray(cinemaData));
      })
      .catch((error) => toast.error(getErrorMessage(error)));
  }, []);

  useEffect(() => {
    if (!selectedCinemaId) {
      setRooms([]);
      return;
    }

    adminRoomApi.list({ cinemaId: selectedCinemaId })
      .then((data) => setRooms(asArray(data)))
      .catch((error) => toast.error(getErrorMessage(error)));
  }, [selectedCinemaId]);

  const selectedMovie = movies.find((movie) => movie.id === selectedMovieId);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const date = formData.get("date");
    const start = formData.get("startTime");
    const end = formData.get("endTime");

    try {
      await adminShowtimeApi.create({
        movieId: formData.get("movieId") || "",
        roomId: formData.get("roomId") || "",
        startTime: `${date}T${start}:00`,
        endTime: `${date}T${end}:00`,
        normalSeatPrice: Number(formData.get("normalSeatPrice") || 0),
        vipSeatPrice: Number(formData.get("vipSeatPrice") || 0),
        coupleSeatPrice: Number(formData.get("coupleSeatPrice") || formData.get("vipSeatPrice") || 0),
        status: "OPEN"
      });
      toast.success("Thao tác thành công");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="add-showtime-main">
          <section className="add-showtime-heading">
            <h1>Thêm suất chiếu</h1>
            <p>Thiết lập thời gian và rạp chiếu cho phim mới trong hệ thống.</p>
          </section>

          <form className="add-showtime-form" onSubmit={handleSubmit}>
            <div className="add-showtime-grid">
              <article className="add-showtime-card primary">
                <label>
                  <span><Film size={18} /> Chọn phim</span>
                  <select name="movieId" value={selectedMovieId} onChange={(event) => setSelectedMovieId(event.target.value)}>
                    <option value="" disabled>Chọn phim đang hoặc sắp chiếu</option>
                    {movies.map((movie) => (
                      <option value={movie.id} key={movie.id}>{movie.title}</option>
                    ))}
                  </select>
                </label>
                <div className="movie-meta-preview">
                  <div>
                    <small>Thời lượng</small>
                    <strong>{selectedMovie?.durationMinutes || 0} phút</strong>
                  </div>
                  <div>
                    <small>Độ tuổi</small>
                    <strong>{selectedMovie?.ageRating || "T13"}</strong>
                  </div>
                </div>
              </article>

              <article className="add-showtime-card secondary">
                <label>
                  <span><Clapperboard size={18} /> Rạp & phòng chiếu</span>
                  <select value={selectedCinemaId} onChange={(event) => setSelectedCinemaId(event.target.value)}>
                    <option value="" disabled>Chọn rạp chiếu</option>
                    {cinemas.map((cinema) => (
                      <option value={cinema.id} key={cinema.id}>{cinema.name}</option>
                    ))}
                  </select>
                </label>
                <select name="roomId" defaultValue="">
                  <option value="" disabled>Chọn phòng</option>
                  {rooms.map((room) => (
                    <option value={room.id} key={room.id}>{room.name} ({room.type})</option>
                  ))}
                </select>
              </article>

              <article className="add-showtime-card full">
                <header>
                  <span><CalendarDays size={18} /> Thời gian chiếu</span>
                </header>
                <div className="add-showtime-time-grid">
                  <label>
                    <span>Ngày chiếu</span>
                    <input name="date" type="date" />
                  </label>
                  <label>
                    <span>Giờ bắt đầu</span>
                    <input name="startTime" type="time" />
                  </label>
                  <label>
                    <span>Giờ kết thúc</span>
                    <input name="endTime" type="time" />
                  </label>
                  <label>
                    <span>Ngôn ngữ & định dạng</span>
                    <div>
                      <select defaultValue="sub">
                        <option value="sub">Phụ đề</option>
                        <option value="dub">Lồng tiếng</option>
                      </select>
                      <select defaultValue="2d">
                        <option value="2d">2D</option>
                        <option value="3d">3D</option>
                        <option value="imax">IMAX</option>
                      </select>
                    </div>
                  </label>
                </div>
              </article>

              <article className="add-showtime-card full">
                <header>
                  <span><Ticket size={18} /> Bảng giá vé (VNĐ)</span>
                </header>
                <div className="add-showtime-price-grid">
                  <PriceInput name="normalSeatPrice" title="Standard" subtitle="Ghế thường" placeholder="85000" />
                  <PriceInput name="vipSeatPrice" title="VIP / Gold Class" subtitle="Ghế cao cấp" placeholder="150000" highlighted />
                </div>
              </article>
            </div>

            <footer className="add-showtime-actions">
              <Link to="/showtimes">Hủy bỏ</Link>
              <button type="submit">
                <CheckCircle2 size={18} />
                Tạo suất chiếu
              </button>
            </footer>
          </form>
        </main>
      </div>
    </div>
  );
}

function PriceInput({ name, title, subtitle, placeholder, highlighted = false }) {
  return (
    <label className={highlighted ? "price-input highlighted" : "price-input"}>
      <span>
        <i>{highlighted ? <Save size={18} /> : <Ticket size={18} />}</i>
        <span>
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </span>
      </span>
      <input name={name} placeholder={placeholder} type="number" />
    </label>
  );
}

function AddShowtimeSidebar() {
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
        <p>Hệ thống quản trị</p>
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
        <LogOut size={18} />
      </div>
    </aside>
  );
}

function AddShowtimeTopbar() {
  return (
    <header className="add-movie-topbar">
      <div className="admin-breadcrumb">
        <Link to="/showtimes">Lịch chiếu</Link>
        <span>/</span>
        <strong>Thêm suất chiếu</strong>
      </div>
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
        <img className="topbar-avatar" src={adminAvatar} alt="Admin" />
      </div>
    </header>
  );
}

export default AddShowtimePage;
