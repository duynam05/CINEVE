import React, { useState } from "react";
import {
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clapperboard,
  Film,
  Info,
  LayoutDashboard,
  MapPin,
  Popcorn,
  Save,
  Settings,
  Star,
  Ticket,
  Upload,
  Warehouse
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { adminCinemaApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

const facilities = [
  "Bãi đỗ xe",
  "Ghế VIP/Couple",
  "Khu vui chơi trẻ em",
  "Wi-Fi miễn phí",
  "Quầy bắp VIP",
  "Hỗ trợ người khuyết tật",
  "Phòng chờ hạng sang",
  "Máy ATM"
];

function AddCinemaPage() {
  const [searchParams] = useSearchParams();
  const cinemaId = searchParams.get("id");
  const isEditMode = searchParams.get("mode") === "edit" && Boolean(cinemaId);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [coverPreview, setCoverPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [cinemaForm, setCinemaForm] = useState(null);

  React.useEffect(() => {
    if (!cinemaId) {
      setCinemaForm(null);
      return;
    }

    adminCinemaApi.detail(cinemaId)
      .then((data) => setCinemaForm(data || {}))
      .catch((error) => toast.error(getErrorMessage(error)));
  }, [cinemaId]);

  const handleFile = (event, setter) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setter(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") || "",
      address: formData.get("address") || "",
      city: formData.get("city") || "",
      phone: formData.get("phone") || "",
      email: formData.get("email") || "",
      description: formData.get("description") || "",
      status: cinemaForm?.status || "ACTIVE"
    };

    try {
      if (isEditMode) {
        await adminCinemaApi.update(cinemaId, payload);
      } else {
        await adminCinemaApi.create(payload);
      }
      toast.success("Thao tác thành công");
      setShowToast(true);
      window.clearTimeout(window.__cineveAddCinemaToast);
      window.__cineveAddCinemaToast = window.setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="add-cinema-main">
          <form className="add-cinema-layout" id="cinema-form" key={cinemaId ? `cinema-${cinemaId}-${cinemaForm ? "ready" : "loading"}` : "new"} onSubmit={handleSubmit}>
            <section className="add-cinema-left">
              <article className="add-cinema-panel">
                <header>
                  <Info size={22} />
                  <h2>Thông tin cơ bản</h2>
                </header>
                <div className="add-cinema-grid">
                  <label>
                    <span>Tên rạp chiếu phim</span>
                    <input name="name" placeholder="Nhập tên rạp..." defaultValue={cinemaForm?.name || ""} />
                  </label>
                  <label>
                    <span>Thành phố / Tỉnh</span>
                    <select name="city" defaultValue={cinemaForm?.city || ""}>
                      <option value="" disabled>Chọn địa điểm</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                    </select>
                  </label>
                  <label className="span-2">
                    <span>Địa chỉ chi tiết</span>
                    <input name="address" placeholder="Số nhà, tên đường, phường/xã..." defaultValue={cinemaForm?.address || ""} />
                  </label>
                  <label>
                    <span>Số điện thoại liên hệ</span>
                    <input name="phone" placeholder="024 XXXX XXXX" type="tel" defaultValue={cinemaForm?.phone || ""} />
                  </label>
                  <label>
                    <span>Email hỗ trợ</span>
                    <input name="email" placeholder="support@cineve.vn" type="email" defaultValue={cinemaForm?.email || ""} />
                  </label>
                </div>
              </article>

              <article className="add-cinema-panel">
                <header className="gold">
                  <Star size={22} />
                  <h2>Tiện ích & Dịch vụ</h2>
                </header>
                <div className="facility-grid">
                  {facilities.map((facility) => (
                    <label key={facility}>
                      <input type="checkbox" />
                      <span>{facility}</span>
                    </label>
                  ))}
                </div>
              </article>
            </section>

            <aside className="add-cinema-media">
              <article className="add-cinema-panel">
                <h3>Ảnh bìa rạp (Cover Photo)</h3>
                <label className="cover-upload">
                  <input accept="image/*" type="file" onChange={(event) => handleFile(event, setCoverPreview)} />
                  {coverPreview ? (
                    <img src={coverPreview} alt="Ảnh bìa xem trước" />
                  ) : (
                    <div>
                      <Camera size={38} />
                      <strong>Kéo thả hoặc Click</strong>
                      <span>PNG, JPG tối đa 5MB (1200x675px)</span>
                    </div>
                  )}
                </label>
              </article>

              <article className="add-cinema-panel">
                <h3>Logo chi nhánh</h3>
                <div className="logo-upload-row">
                  <label className="logo-upload">
                    <input accept="image/*" type="file" onChange={(event) => handleFile(event, setLogoPreview)} />
                    {logoPreview ? <img src={logoPreview} alt="Logo xem trước" /> : <Upload size={26} />}
                  </label>
                  <div>
                    <strong>Tải lên logo</strong>
                    <p>Sử dụng định dạng PNG nền trong suốt để hiển thị tốt nhất.</p>
                  </div>
                </div>
              </article>

              <article className="add-cinema-panel">
                <h3>Xem trước vị trí</h3>
                <div className="cinema-location-preview">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=85"
                    alt="Bản đồ vị trí rạp"
                  />
                  <span>
                    <MapPin size={15} />
                    Vị trí tự động xác định dựa trên địa chỉ
                  </span>
                </div>
              </article>
            </aside>

            <footer className="add-cinema-actions">
              <Link className="cancel-add-cinema" to="/cinemas">Hủy bỏ</Link>
              <button className="save-add-cinema" type="submit" disabled={isSaving}>
                <Save size={18} />
                {isSaving ? "Đang lưu..." : isEditMode ? "Lưu thay đổi" : "Lưu thông tin"}
              </button>
            </footer>
          </form>
        </main>
      </div>
      <div className={showToast ? "add-movie-toast visible" : "add-movie-toast"}>
        <span>
          <CheckCircle2 size={22} />
        </span>
        <div>
          <strong>Thành công!</strong>
          <p>Dữ liệu rạp mới đã được lưu thành công.</p>
        </div>
      </div>
    </div>
  );
}

function AddCinemaSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies" },
    { label: "Rạp", icon: Warehouse, to: "/cinemas", active: true },
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

function AddCinemaTopbar() {
  return (
    <header className="add-movie-topbar">
      <div className="admin-breadcrumb">
        <Link to="/cinemas">Rạp</Link>
        <span>/</span>
        <strong>Thêm rạp mới</strong>
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

export default AddCinemaPage;
