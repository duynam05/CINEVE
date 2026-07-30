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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { adminCinemaApi, adminMovieApi, adminRoomApi, adminShowtimeApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import { asArray, formatDateTime } from "../api/formatters";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

function AddShowtimePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showtimeId = searchParams.get("id");
  const mode = searchParams.get("mode");

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [formDataState, setFormDataState] = useState({
    roomId: "",
    date: "",
    startTime: "",
    endTime: "",
    normalSeatPrice: "",
    vipSeatPrice: "",
    coupleSeatPrice: ""
  });

  useEffect(() => {
    Promise.all([adminMovieApi.list(), adminCinemaApi.list()])
      .then(([movieData, cinemaData]) => {
        setMovies(asArray(movieData));
        setCinemas(asArray(cinemaData));
      })
      .catch((error) => toast.error(getErrorMessage(error)));
  }, []);

  useEffect(() => {
    if (showtimeId && mode === "edit") {
      adminShowtimeApi.detail(showtimeId).then((data) => {
        if (!data) return;
        setSelectedMovieId(data.movieId);
        setSelectedCinemaId(data.cinemaId);
        
        const startRaw = data.startTime ? data.startTime.split("T") : ["", ""];
        const endRaw = data.endTime ? data.endTime.split("T") : ["", ""];
        
        setFormDataState({
          roomId: data.roomId,
          date: startRaw[0] || "",
          startTime: startRaw[1]?.slice(0, 5) || "",
          endTime: endRaw[1]?.slice(0, 5) || "",
          normalSeatPrice: data.normalSeatPrice || "",
          vipSeatPrice: data.vipSeatPrice || "",
          coupleSeatPrice: data.coupleSeatPrice || ""
        });
      }).catch(err => toast.error(getErrorMessage(err)));
    }
  }, [showtimeId, mode]);

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

    const payload = {
        movieId: formData.get("movieId") || "",
        roomId: formData.get("roomId") || "",
        startTime: `${date}T${start}:00`,
        endTime: `${date}T${end}:00`,
        normalSeatPrice: Number(formData.get("normalSeatPrice") || 0),
        vipSeatPrice: Number(formData.get("vipSeatPrice") || 0),
        coupleSeatPrice: Number(formData.get("coupleSeatPrice") || formData.get("vipSeatPrice") || 0),
        status: "OPEN"
    };

    try {
      if (mode === "edit" && showtimeId) {
        await adminShowtimeApi.update(showtimeId, payload);
      } else {
        await adminShowtimeApi.create(payload);
      }
      toast.success("Thao tác thành công");
      navigate("/showtimes");
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

          <form key={formDataState.roomId || "new"} className="add-showtime-form" onSubmit={handleSubmit}>
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
                <select name="roomId" defaultValue={formDataState.roomId}>
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
                    <input name="date" type="date" defaultValue={formDataState.date} required />
                  </label>
                  <label>
                    <span>Giờ bắt đầu</span>
                    <input name="startTime" type="time" defaultValue={formDataState.startTime} required />
                  </label>
                  <label>
                    <span>Giờ kết thúc</span>
                    <input name="endTime" type="time" defaultValue={formDataState.endTime} required />
                  </label>
                </div>
              </article>

              <article className="add-showtime-card full">
                <header>
                  <span><Ticket size={18} /> Giá vé (VNĐ)</span>
                </header>
                <div className="add-showtime-time-grid">
                  <PriceInput name="normalSeatPrice" label="Ghế thường" placeholder="VD: 85000" defaultValue={formDataState.normalSeatPrice} />
                  <PriceInput name="vipSeatPrice" label="Ghế VIP" placeholder="VD: 105000" defaultValue={formDataState.vipSeatPrice} />
                  <PriceInput name="coupleSeatPrice" label="Ghế đôi" placeholder="VD: 220000" defaultValue={formDataState.coupleSeatPrice} />
                </div>
              </article>
            </div>

            <div className="add-showtime-actions">
              <button type="submit">
                <Save size={18} />
                {mode === "edit" ? "Cập nhật suất chiếu" : "Lưu suất chiếu"}
              </button>
              <Link to="/showtimes">Hủy bỏ</Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

function PriceInput({ name, label, title, subtitle, placeholder, defaultValue, highlighted = false }) {
  return (
    <label className={highlighted ? "price-input highlighted" : "price-input"}>
      <span>
        <i>{highlighted ? <Save size={18} /> : <Ticket size={18} />}</i>
        <span>
          <strong>{label || title}</strong>
          <small>{subtitle}</small>
        </span>
      </span>
      <input name={name} placeholder={placeholder} type="number" defaultValue={defaultValue} />
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
