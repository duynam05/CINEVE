import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  DoorOpen,
  Film,
  LayoutDashboard,
  MapPin,
  Pencil,
  PlusCircle,
  Popcorn,
  Search,
  Settings,
  Ticket,
  Trash2,
  Warehouse,
  Wrench
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminCinemaApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import { asArray } from "../api/formatters";

const adminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=85";

function CinemaManagementPage() {
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const loadCinemas = async () => {
    try {
      setLoading(true);
      const data = await adminCinemaApi.list();
      setCinemas(asArray(data).map(mapCinema));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setCinemas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCinemas();
  }, []);

  const cityCount = useMemo(() => new Set(cinemas.map((cinema) => cinema.city).filter(Boolean)).size, [cinemas]);
  const totalPages = Math.max(1, Math.ceil(cinemas.length / pageSize));
  const pagedCinemas = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return cinemas.slice(startIndex, startIndex + pageSize);
  }, [cinemas, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (cinema) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa hẳn rạp "${cinema.name}" khỏi database không?`);
    if (!confirmed) return;

    try {
      await adminCinemaApi.remove(cinema.id);
      toast.success("Thao tác thành công");
      loadCinemas();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="cinema-admin-main">
          <section className="cinema-heading">
            <div>
              <h1>Quản lý rạp</h1>
              <p>{loading ? "Đang tải dữ liệu..." : "Hệ thống chi nhánh và cụm rạp toàn quốc"}</p>
            </div>
            <Link to="/cinemas/new" className="add-cinema-button">
              <PlusCircle size={20} />
              Thêm rạp mới
            </Link>
          </section>

          <section className="cinema-stat-grid">
            <CinemaStat icon={CheckCircle2} label="Rạp đang hoạt động" value={cinemas.filter((cinema) => cinema.tone === "active").length} tone="red" />
            <CinemaStat icon={Building2} label="Thành phố" value={cityCount} tone="gold" />
            <CinemaStat icon={Wrench} label="Đang bảo trì" value={cinemas.filter((cinema) => cinema.tone === "maintenance").length} tone="danger" />
          </section>

          <CinemaTable
            cinemas={pagedCinemas}
            total={cinemas.length}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onEdit={(cinema) => navigate(`/cinemas/new?id=${cinema.id}&mode=edit`)}
            onRooms={(cinema) => navigate(`/rooms?cinemaId=${cinema.id}`)}
            onDelete={handleDelete}
          />

          <section className="cinema-map-grid">
            <CinemaMapCard
              title="Vị trí rạp Miền Nam"
              meta={`${cinemas.length} cơ sở trong hệ thống`}
              image="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=900&q=85"
            />
            <CinemaMapCard
              title="Vị trí rạp Miền Bắc"
              meta={`${cityCount} thành phố đang phục vụ`}
              image="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=900&q=85"
            />
          </section>
        </main>
      </div>
    </div>
  );
}

function CinemaSidebar() {
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
        <p>Quản trị viên</p>
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
          <strong>Admin Profile</strong>
          <span>Quản trị viên</span>
        </div>
      </div>
    </aside>
  );
}

function CinemaTopbar() {
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

function CinemaStat({ icon: Icon, label, value, tone }) {
  return (
    <article className={`cinema-stat-card ${tone}`}>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
      <span>
        <Icon size={24} />
      </span>
    </article>
  );
}

function CinemaTable({ cinemas, total, currentPage, totalPages, pageSize, onPageChange, onEdit, onRooms, onDelete }) {
  const startItem = total ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="cinema-table-card">
      <div className="cinema-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Tên rạp</th>
              <th>Thành phố</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cinemas.length ? cinemas.map((cinema) => (
              <tr key={cinema.id || cinema.code}>
                <td>
                  <div className="cinema-name-cell">
                    <span>{cinema.code}</span>
                    <strong>{cinema.name}</strong>
                  </div>
                </td>
                <td>{cinema.city}</td>
                <td className="cinema-address">{cinema.address}</td>
                <td>{cinema.phone}</td>
                <td>
                  <span className={`cinema-status ${cinema.tone}`}>{cinema.status}</span>
                </td>
                <td>
                  <div className="cinema-row-actions">
                    <button type="button" aria-label={`Sửa ${cinema.name}`} onClick={() => onEdit(cinema)}><Pencil size={18} /></button>
                    <button type="button" aria-label={`Xem phòng ${cinema.name}`} onClick={() => onRooms(cinema)}><DoorOpen size={18} /></button>
                    <button type="button" aria-label={`Xóa ${cinema.name}`} onClick={() => onDelete(cinema)}><Trash2 size={18} /></button>
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
      <div className="cinema-pagination">
        <p>Hiển thị {startItem}-{endItem} trên {total} rạp</p>
        <div>
          <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}><ChevronLeft size={18} /></button>
          {pages.map((page) => (
            <button className={page === currentPage ? "active" : ""} type="button" key={page} onClick={() => onPageChange(page)}>
              {page}
            </button>
          ))}
          <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}><ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

function CinemaMapCard({ title, meta, image }) {
  return (
    <article className="cinema-map-card">
      <img src={image} alt={title} />
      <div>
        <MapPin size={24} />
        <h2>{title}</h2>
        <p>{meta}</p>
      </div>
    </article>
  );
}

function mapCinema(cinema) {
  const active = cinema.status === "ACTIVE";
  return {
    id: cinema.id,
    code: (cinema.name || "CV").slice(0, 2).toUpperCase(),
    name: cinema.name || "--",
    city: cinema.city || "--",
    address: cinema.address || "--",
    phone: cinema.phone || "--",
    status: active ? "Đang hoạt động" : "Bảo trì",
    tone: active ? "active" : "maintenance"
  };
}

export default CinemaManagementPage;
