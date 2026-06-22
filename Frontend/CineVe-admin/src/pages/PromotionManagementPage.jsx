import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Filter,
  Film,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  PlusCircle,
  Popcorn,
  Search,
  Settings,
  Tag,
  Ticket,
  Warehouse
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { adminCouponApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import { activeStatusLabel, activeTone, asArray, formatCompactCurrency, formatCurrency, formatDate } from "../api/formatters";

function PromotionManagementPage() {
  const [promotions, setPromotions] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await adminCouponApi.list();
      setPromotions(asArray(data).map(mapPromotion));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const visiblePromotions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return promotions.filter((promo) => {
      const matchText = !normalized || [promo.code, promo.name, promo.description].join(" ").toLowerCase().includes(normalized);
      const matchStatus = statusFilter === "all" || promo.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [promotions, query, statusFilter]);

  const stats = useMemo(() => {
    const active = promotions.filter((promo) => promo.tone === "active").length;
    const warning = promotions.filter((promo) => promo.tone === "warning").length;
    const used = promotions.reduce((sum, promo) => sum + promo.used, 0);
    const saved = promotions.reduce((sum, promo) => sum + Number(promo.rawDiscount || 0) * promo.used, 0);
    return { active, warning, used, saved };
  }, [promotions]);

  const handleDelete = async (promo) => {
    try {
      await adminCouponApi.remove(promo.id);
      toast.success("Thao tác thành công");
      loadPromotions();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="promotion-main">
          <section className="promotion-heading">
            <div>
              <h1>Quản lý mã giảm giá</h1>
              <p>{loading ? "Đang tải dữ liệu..." : "Thiết lập các chương trình khuyến mãi và voucher cho hệ thống."}</p>
            </div>
            <Link className="promotion-create-button" to="/promotions/new">
              <PlusCircle size={19} />
              Thêm mã mới
            </Link>
          </section>

          <section className="promotion-stats">
            <PromotionStat label="Đang hoạt động" value={stats.active} tone="red" />
            <PromotionStat label="Sắp hết hạn" value={stats.warning} tone="gold" />
            <PromotionStat label="Tổng lượt sử dụng" value={stats.used} tone="silver" />
            <PromotionStat label="Tiết kiệm cho khách" value={formatCompactCurrency(stats.saved)} tone="muted" />
          </section>

          <section className="promotion-table-card">
            <header>
              <label className="promotion-search">
                <Search size={18} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã hoặc tên chương trình..." />
              </label>
              <div className="promotion-filter-actions">
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="Hoạt động">Đang hoạt động</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                  <option value="Hết hạn">Hết hạn</option>
                </select>
                <button type="button" aria-label="Lọc">
                  <Filter size={18} />
                </button>
              </div>
            </header>

            <div className="promotion-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Mã code</th>
                    <th>Chương trình</th>
                    <th>Loại</th>
                    <th>Giá trị</th>
                    <th>Đơn tối thiểu</th>
                    <th>Thời gian</th>
                    <th>Sử dụng</th>
                    <th>Trạng thái</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visiblePromotions.length ? visiblePromotions.map((promo) => (
                    <PromotionRow promo={promo} key={promo.code} onDelete={handleDelete} />
                  )) : (
                    <tr>
                      <td colSpan="9">Chưa có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="promotion-pagination">
              <p>Hiển thị 1-{visiblePromotions.length} trên {promotions.length} mã</p>
              <div>
                <button type="button" aria-label="Trang trước">
                  <ChevronLeft size={16} />
                </button>
                <button type="button" className="active">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button" aria-label="Trang sau">
                  <ChevronRight size={16} />
                </button>
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}

function PromotionStat({ label, value, tone }) {
  return (
    <article className={`promotion-stat ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function PromotionRow({ promo, onDelete }) {
  const progress = Math.min(100, Math.round((promo.used / Math.max(promo.limit, 1)) * 100));

  return (
    <tr className={promo.tone === "expired" ? "expired" : ""}>
      <td>
        <span className="promotion-code">{promo.code}</span>
      </td>
      <td>
        <strong>{promo.name}</strong>
        <small>{promo.description}</small>
      </td>
      <td>
        <span className={`promotion-type ${promo.type === "Tiền mặt" ? "cash" : "percent"}`}>
          {promo.type}
        </span>
      </td>
      <td className="promotion-value">{promo.value}</td>
      <td className="promotion-min">{promo.minOrder}</td>
      <td>
        <div className="promotion-date-range">
          <span><i className="start" />{promo.start}</span>
          <span><i className="end" />{promo.end}</span>
        </div>
      </td>
      <td>
        <div className="promotion-usage">
          <span>
            <i className={promo.tone} style={{ width: `${progress}%` }} />
          </span>
          <small>{promo.used} / {promo.limit} lượt</small>
        </div>
      </td>
      <td>
        <span className={`promotion-status ${promo.tone}`}>
          <i />
          {promo.status}
        </span>
      </td>
      <td>
        <button className="promotion-more" type="button" aria-label={`Thao tác ${promo.code}`} onClick={() => onDelete(promo)}>
          <MoreVertical size={18} />
        </button>
      </td>
    </tr>
  );
}

function PromotionSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies" },
    { label: "Rạp", icon: Warehouse, to: "/cinemas" },
    { label: "Phòng chiếu", icon: Clapperboard, to: "/rooms" },
    { label: "Lịch chiếu", icon: CalendarDays, to: "/showtimes" },
    { label: "Đặt vé", icon: Ticket, to: "/bookings" },
    { label: "Đồ ăn/Combo", icon: Popcorn, to: "/foods" },
    { label: "Mã giảm giá", icon: Tag, to: "/promotions", active: true }
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
        <span className="admin-letter-avatar">AD</span>
        <div>
          <strong>Admin Quản Trị</strong>
          <span>admin@cineve.vn</span>
        </div>
        <LogOut size={18} />
      </div>
    </aside>
  );
}

function PromotionTopbar() {
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
        <span className="booking-top-avatar">AD</span>
      </div>
    </header>
  );
}

function mapPromotion(coupon) {
  const expired = coupon.endTime && new Date(coupon.endTime).getTime() < Date.now();
  const usageLimit = coupon.usageLimit ?? 1;
  const used = coupon.usedCount ?? 0;
  const nearlyFull = used / Math.max(usageLimit, 1) >= 0.8;
  const tone = expired ? "expired" : nearlyFull ? "warning" : activeTone(coupon.active);

  return {
    id: coupon.id,
    code: coupon.code || "--",
    name: coupon.name || "--",
    description: coupon.description || "--",
    type: coupon.type === "FIXED_AMOUNT" ? "Tiền mặt" : "Phần trăm",
    value: coupon.type === "FIXED_AMOUNT" ? formatCurrency(coupon.discountValue) : `${coupon.discountValue ?? 0}%`,
    rawDiscount: coupon.discountValue,
    minOrder: formatCurrency(coupon.minOrderAmount),
    start: formatDate(coupon.startTime),
    end: formatDate(coupon.endTime),
    used,
    limit: usageLimit,
    status: expired ? "Hết hạn" : activeStatusLabel(Boolean(coupon.active)),
    tone
  };
}

export default PromotionManagementPage;
