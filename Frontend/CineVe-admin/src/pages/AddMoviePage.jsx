import React, { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clapperboard,
  Film,
  ImagePlus,
  LayoutDashboard,
  Link as LinkIcon,
  Plus,
  Popcorn,
  Save,
  Settings,
  Ticket,
  Warehouse
} from "lucide-react";
import { Link } from "react-router-dom";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

const genres = ["Hành động", "Tình cảm", "Kinh dị", "Hoạt hình", "Khoa học viễn tưởng"];

function AddMoviePage() {
  const [selectedGenres, setSelectedGenres] = useState(["Hành động"]);
  const [posterPreview, setPosterPreview] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [status, setStatus] = useState("Đang chiếu");
  const [isVip, setIsVip] = useState(false);

  const genreText = useMemo(() => selectedGenres.join(", "), [selectedGenres]);

  const toggleGenre = (genre) => {
    setSelectedGenres((current) =>
      current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre]
    );
  };

  const handlePosterChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowToast(true);
    window.clearTimeout(window.__cineveAddMovieToast);
    window.__cineveAddMovieToast = window.setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="admin-shell">
      <AddMovieSidebar />
      <div className="admin-workspace">
        <AddMovieTopbar />
        <main className="add-movie-main">
          <form className="add-movie-layout" onSubmit={handleSubmit}>
            <aside className="add-movie-side">
              <section className="add-movie-glass poster-panel">
                <label className="poster-dropzone">
                  <input accept="image/*" type="file" onChange={handlePosterChange} />
                  {posterPreview ? (
                    <img src={posterPreview} alt="Poster xem trước" />
                  ) : (
                    <div>
                      <ImagePlus size={52} />
                      <p>
                        Tải lên Poster phim (Dọc)
                        <span>Dung lượng tối đa 5MB</span>
                      </p>
                    </div>
                  )}
                  <strong>Thay đổi ảnh</strong>
                </label>
                <p>Định dạng khuyên dùng: 1000x1500px JPG/PNG</p>
              </section>

              <section className="add-movie-glass visibility-panel">
                <h2>
                  <Clapperboard size={18} />
                  Trạng thái hiển thị
                </h2>
                <label>
                  <span>Đang chiếu</span>
                  <input checked={status === "Đang chiếu"} name="status" type="radio" onChange={() => setStatus("Đang chiếu")} />
                </label>
                <label>
                  <span>Sắp chiếu</span>
                  <input checked={status === "Sắp chiếu"} name="status" type="radio" onChange={() => setStatus("Sắp chiếu")} />
                </label>
                <label>
                  <span>Phim VIP</span>
                  <input checked={isVip} type="checkbox" onChange={(event) => setIsVip(event.target.checked)} />
                </label>
              </section>
            </aside>

            <section className="add-movie-form-wrap">
              <div className="add-movie-glass add-movie-form-card">
                <div className="add-movie-form-grid">
                  <label className="span-2">
                    <span>Tiêu đề phim *</span>
                    <input placeholder="Nhập tên phim chính thức..." />
                  </label>

                  <fieldset className="span-2 genre-picker">
                    <legend>Thể loại (Chọn nhiều) *</legend>
                    <div>
                      {genres.map((genre) => (
                        <button
                          className={selectedGenres.includes(genre) ? "selected" : ""}
                          key={genre}
                          type="button"
                          onClick={() => toggleGenre(genre)}
                        >
                          {genre}
                        </button>
                      ))}
                      <button className="add-genre" type="button">
                        <Plus size={15} />
                        Thêm mới
                      </button>
                    </div>
                    <small>{genreText || "Chưa chọn thể loại"}</small>
                  </fieldset>

                  <label>
                    <span>Thời lượng (Phút) *</span>
                    <div className="duration-input">
                      <input defaultValue="120" type="number" />
                      <em>phút</em>
                    </div>
                  </label>

                  <label>
                    <span>Ngày khởi chiếu *</span>
                    <input type="date" />
                  </label>

                  <label>
                    <span>Đạo diễn</span>
                    <input placeholder="Tên đạo diễn..." />
                  </label>

                  <label>
                    <span>Trailer URL (Youtube/Vimeo)</span>
                    <div className="trailer-input">
                      <LinkIcon size={18} />
                      <input placeholder="https://..." type="url" />
                    </div>
                  </label>

                  <label className="span-2">
                    <span>Diễn viên chính</span>
                    <input placeholder="Ngăn cách bằng dấu phẩy (vd: Tom Cruise, Henry Cavill...)" />
                  </label>

                  <label className="span-2">
                    <span>Mô tả nội dung</span>
                    <textarea rows="5" placeholder="Tóm tắt cốt truyện phim..." />
                  </label>
                </div>
              </div>

              <div className="add-movie-actions">
                <Link className="cancel-add-movie" to="/movies">Hủy bỏ</Link>
                <button className="save-add-movie" type="submit">
                  <Save size={18} />
                  Lưu thông tin
                </button>
              </div>
            </section>
          </form>
        </main>
      </div>
      <div className={showToast ? "add-movie-toast visible" : "add-movie-toast"}>
        <span>
          <CheckCircle2 size={22} />
        </span>
        <div>
          <strong>Thành công!</strong>
          <p>Phim mới đã được thêm vào hệ thống.</p>
        </div>
      </div>
    </div>
  );
}

function AddMovieSidebar() {
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
      </div>
    </aside>
  );
}

function AddMovieTopbar() {
  return (
    <header className="add-movie-topbar">
      <div className="admin-breadcrumb">
        <Link to="/movies">Phim</Link>
        <span>/</span>
        <strong>Thêm phim mới</strong>
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

export default AddMoviePage;
