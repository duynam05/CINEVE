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
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { adminGenreApi, adminMovieApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import { asArray, toAbsoluteImage } from "../api/formatters";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

function AddMoviePage() {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("id");
  const mode = searchParams.get("mode") || "create";
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isAddingGenre, setIsAddingGenre] = useState(false);
  const [newGenreName, setNewGenreName] = useState("");
  const [isCreatingGenre, setIsCreatingGenre] = useState(false);
  const [posterPreview, setPosterPreview] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [movieForm, setMovieForm] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [status, setStatus] = useState("Đang chiếu");
  const [isVip, setIsVip] = useState(false);

  const loadGenres = async () => {
    try {
      const data = asArray(await adminGenreApi.list());
      setGenres(data);
      return data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      setGenres([]);
      return [];
    }
  };

  React.useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      const loadedGenres = await loadGenres();
      if (!movieId) {
        if (isMounted) {
          setMovieForm(null);
          setSelectedGenres([]);
          setPosterPreview("");
          setPosterFile(null);
          setStatus("Đang chiếu");
          setIsVip(false);
        }
        return;
      }

      try {
        const movie = await adminMovieApi.detail(movieId);
        if (!isMounted) return;

        const movieGenres = asArray(movie?.genres);
        const movieGenreIds = movieGenres.map((genre) => genre.id).filter(Boolean);
        setMovieForm(movie || {});
        setSelectedGenres(movieGenreIds);
        setPosterPreview(movie?.posterUrl ? toAbsoluteImage(movie.posterUrl) : "");
        setPosterFile(null);
        setStatus(statusTextFromCode(movie?.status));
        setIsVip(movie?.ageRating === "VIP");
        setGenres(mergeGenres(loadedGenres, movieGenres));
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  const genreText = useMemo(
    () => selectedGenres.map((id) => genres.find((genre) => genre.id === id)?.name).filter(Boolean).join(", "),
    [genres, selectedGenres]
  );

  const handleCreateGenre = async () => {
    const names = splitGenreNames(newGenreName);

    if (!names.length) {
      toast.error("Vui lòng nhập tên thể loại");
      return;
    }

    try {
      setIsCreatingGenre(true);
      let currentGenres = genres;
      const genreIds = [];

      for (const name of names) {
        const existingGenre = findGenreByName(currentGenres, name);

        if (existingGenre?.id) {
          genreIds.push(existingGenre.id);
          continue;
        }

        try {
          const createdGenre = await adminGenreApi.create({
            name,
            description: ""
          });

          if (createdGenre?.id) {
            currentGenres = appendUniqueGenre(currentGenres, createdGenre);
            genreIds.push(createdGenre.id);
          }
        } catch (error) {
          const latestGenres = asArray(await adminGenreApi.list());
          currentGenres = mergeGenres(currentGenres, latestGenres);
          const existingAfterReload = findGenreByName(currentGenres, name);

          if (existingAfterReload?.id) {
            genreIds.push(existingAfterReload.id);
            continue;
          }

          throw error;
        }
      }

      setGenres(currentGenres);
      setSelectedGenres((current) => uniqueIds([...current, ...genreIds]));
      setNewGenreName("");
      setIsAddingGenre(false);
      toast.success("Thao tác thành công");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsCreatingGenre(false);
    }
  };

  const handlePosterChange = (event) => {
    if (isViewMode) return;
    const file = event.target.files?.[0];
    if (!file) return;
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isViewMode) return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: formData.get("title") || "",
      description: formData.get("description") || "",
      durationMinutes: Number(formData.get("durationMinutes") || 0),
      director: formData.get("director") || "",
      actors: formData.get("actors") || "",
      language: movieForm?.language || "Tiếng Việt",
      country: movieForm?.country || "Việt Nam",
      ageRating: isVip ? "VIP" : "T13",
      releaseDate: formData.get("releaseDate") || null,
      posterUrl: movieForm?.posterUrl || "",
      trailerUrl: formData.get("trailerUrl") || "",
      status: statusCodeFromText(status),
      genreIds: selectedGenres
    };

    try {
      const saved = isEditMode && movieId
        ? await adminMovieApi.update(movieId, payload)
        : await adminMovieApi.create(payload);
      const savedId = movieId || saved?.id;

      if (posterFile && savedId) {
        const posterData = new FormData();
        posterData.append("file", posterFile);
        await adminMovieApi.uploadPoster(savedId, posterData);
      }

      toast.success("Thao tác thành công");
      setShowToast(true);
      window.clearTimeout(window.__cineveAddMovieToast);
      window.__cineveAddMovieToast = window.setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleFormKeyDown = (event) => {
    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
      event.preventDefault();
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="add-movie-main">
          <form className="add-movie-layout" key={movieId ? `movie-${movieId}-${movieForm ? "ready" : "loading"}` : "new"} onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
            <aside className="add-movie-side">
              <section className="add-movie-glass poster-panel">
                <label className="poster-dropzone">
                  <input accept="image/*" type="file" onChange={handlePosterChange} disabled={isViewMode} />
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
                  <input checked={status === "Đang chiếu"} name="status" type="radio" onChange={() => setStatus("Đang chiếu")} disabled={isViewMode} />
                </label>
                <label>
                  <span>Sắp chiếu</span>
                  <input checked={status === "Sắp chiếu"} name="status" type="radio" onChange={() => setStatus("Sắp chiếu")} disabled={isViewMode} />
                </label>
                <label>
                  <span>Phim VIP</span>
                  <input checked={isVip} type="checkbox" onChange={(event) => setIsVip(event.target.checked)} disabled={isViewMode} />
                </label>
              </section>
            </aside>

            <section className="add-movie-form-wrap">
              <div className="add-movie-glass add-movie-form-card">
                <div className="add-movie-form-grid">
                  <label className="span-2">
                    <span>Tiêu đề phim *</span>
                    <input name="title" placeholder="Nhập tên phim chính thức..." defaultValue={movieForm?.title || ""} disabled={isViewMode} />
                  </label>

                  <fieldset className="span-2 genre-picker">
                    <legend>Thể loại (Chọn nhiều)</legend>
                    <div>
                      {selectedGenres.map((genreId) => {
                        const genre = genres.find((item) => item.id === genreId);
                        if (!genre) return null;

                        return (
                          <button
                            className="selected"
                            key={genre.id}
                            type="button"
                            onClick={() => {
                              if (!isViewMode) setSelectedGenres([]);
                            }}
                            disabled={isViewMode}
                          >
                            {genre.name}
                          </button>
                        );
                      })}
                      {isAddingGenre && !isViewMode ? (
                        <>
                          <input
                            value={newGenreName}
                            onChange={(event) => setNewGenreName(event.target.value)}
                            placeholder="Nhập tên thể loại..."
                          />
                          <button type="button" onClick={handleCreateGenre} disabled={isCreatingGenre}>
                            {isCreatingGenre ? "Đang thêm..." : "Lưu"}
                          </button>
                          <button type="button" onClick={() => setIsAddingGenre(false)}>
                            Hủy
                          </button>
                        </>
                      ) : !isViewMode ? (
                        <button className="add-genre" type="button" onClick={() => setIsAddingGenre(true)}>
                          <Plus size={15} />
                          Thêm mới
                        </button>
                      ) : null}
                    </div>
                    <small>{genreText || "Chưa có thể loại nào"}</small>
                  </fieldset>

                  <label>
                    <span>Thời lượng (Phút) *</span>
                    <div className="duration-input">
                      <input name="durationMinutes" defaultValue={movieForm?.durationMinutes || "120"} type="number" disabled={isViewMode} />
                      <em>phút</em>
                    </div>
                  </label>

                  <label>
                    <span>Ngày khởi chiếu *</span>
                    <input name="releaseDate" type="date" defaultValue={inputDateValue(movieForm?.releaseDate)} disabled={isViewMode} />
                  </label>

                  <label>
                    <span>Đạo diễn</span>
                    <input name="director" placeholder="Tên đạo diễn..." defaultValue={movieForm?.director || ""} disabled={isViewMode} />
                  </label>

                  <label>
                    <span>Trailer URL (Youtube/Vimeo)</span>
                    <div className="trailer-input">
                      <LinkIcon size={18} />
                      <input name="trailerUrl" placeholder="https://..." type="url" defaultValue={movieForm?.trailerUrl || ""} disabled={isViewMode} />
                    </div>
                  </label>

                  <label className="span-2">
                    <span>Diễn viên chính</span>
                    <input name="actors" placeholder="Ngăn cách bằng dấu phẩy (vd: Tom Cruise, Henry Cavill...)" defaultValue={movieForm?.actors || ""} disabled={isViewMode} />
                  </label>

                  <label className="span-2">
                    <span>Mô tả nội dung</span>
                    <textarea name="description" rows="5" placeholder="Tóm tắt cốt truyện phim..." defaultValue={movieForm?.description || ""} disabled={isViewMode} />
                  </label>
                </div>
              </div>

              <div className="add-movie-actions">
                <Link className="cancel-add-movie" to="/movies">Hủy bỏ</Link>
                <button className="save-add-movie" type="submit" disabled={isViewMode}>
                  <Save size={18} />
                  {isViewMode ? "Đang xem thông tin" : isEditMode ? "Lưu thay đổi" : "Lưu thông tin"}
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

function statusTextFromCode(status) {
  if (status === "COMING_SOON") return "Sắp chiếu";
  return "Đang chiếu";
}

function statusCodeFromText(status) {
  return status === "Sắp chiếu" ? "COMING_SOON" : "NOW_SHOWING";
}

function inputDateValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function mergeGenres(existingGenres, movieGenres) {
  const map = new Map();
  [...asArray(existingGenres), ...asArray(movieGenres)].forEach((genre) => {
    if (genre?.id) map.set(genre.id, genre);
  });
  return Array.from(map.values());
}

function appendUniqueGenre(genres, genre) {
  return mergeGenres(genres, [genre]);
}

function findGenreByName(genres, name) {
  const normalizedName = normalizeGenreName(name);
  return genres.find((genre) => normalizeGenreName(genre.name) === normalizedName);
}

function splitGenreNames(value) {
  const names = value
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  return Array.from(new Map(names.map((name) => [normalizeGenreName(name), name])).values());
}

function uniqueIds(ids) {
  return Array.from(new Set(ids.filter(Boolean)));
}

function normalizeGenreName(value = "") {
  return value.trim().toLocaleLowerCase("vi-VN");
}

export default AddMoviePage;
