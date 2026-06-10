import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Clapperboard,
  Film,
  Group,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Popcorn,
  Settings,
  ShieldCheck,
  Tag,
  Ticket,
  Warehouse
} from "lucide-react";
import { Link } from "react-router-dom";

function AddPromotionPage() {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");

  return (
    <div className="admin-shell">
      <AddPromotionSidebar />
      <div className="admin-workspace">
        <AddPromotionTopbar />
        <main className="add-promotion-main">
          <section className="add-promotion-header">
            <div>
              <h1>Thêm mã giảm giá</h1>
              <p>Tạo chương trình ưu đãi mới cho khách hàng CineVe.</p>
            </div>
            <Link to="/promotions">
              <ArrowLeft size={18} />
              Quay lại danh sách
            </Link>
          </section>

          <form className="add-promotion-grid" onSubmit={(event) => event.preventDefault()}>
            <section className="add-promotion-left">
              <article className="add-promotion-panel highlighted">
                <label>
                  <span>Promo Code</span>
                  <input
                    value={code}
                    onChange={(event) => setCode(event.target.value.toUpperCase())}
                    placeholder="VÍ DỤ: CINE2024"
                  />
                  <small>Mã nên ngắn gọn, dễ nhớ và viết hoa.</small>
                </label>
                <div className="add-promotion-two-cols">
                  <label>
                    <span>Discount Value (%)</span>
                    <div className="add-promotion-input-icon">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(event) => setDiscount(event.target.value)}
                        placeholder="0"
                      />
                      <strong>%</strong>
                    </div>
                  </label>
                  <label>
                    <span>Usage Limit</span>
                    <div className="add-promotion-input-icon">
                      <input type="number" min="0" placeholder="Số lượng tối đa" />
                      <Group size={18} />
                    </div>
                  </label>
                </div>
              </article>

              <article className="add-promotion-panel">
                <h2>Điều kiện áp dụng</h2>
                <div className="add-promotion-two-cols">
                  <label>
                    <span>Minimum Spend (VNĐ)</span>
                    <input placeholder="0" />
                  </label>
                  <label>
                    <span>Max Discount Amount (VNĐ)</span>
                    <input placeholder="Tối đa giảm" />
                  </label>
                </div>
              </article>
            </section>

            <aside className="add-promotion-right">
              <article className="add-promotion-panel">
                <label>
                  <span>Expiry Date</span>
                  <input type="date" value={expiry} onChange={(event) => setExpiry(event.target.value)} />
                  <small>Sau ngày này, mã sẽ tự động hết hiệu lực và không thể sử dụng.</small>
                </label>
              </article>

              <article className="add-promotion-panel preview">
                <h2>
                  <Tag size={18} />
                  Xem trước hiển thị
                </h2>
                <div className="promotion-preview-card">
                  <span>CineVe Voucher</span>
                  <strong>{code || "CINECODE"}</strong>
                  <div>
                    <b>{discount ? `${discount}% OFF` : "20% OFF"}</b>
                    <small>HSD: {formatDate(expiry) || "31/12/2024"}</small>
                  </div>
                </div>
              </article>

              <div className="add-promotion-actions">
                <button type="submit">Lưu mã giảm giá</button>
                <Link to="/promotions">Hủy bỏ</Link>
              </div>
            </aside>
          </form>

          <section className="add-promotion-tips">
            <article>
              <span>
                <Lightbulb size={21} />
              </span>
              <div>
                <h2>Mẹo đặt tên</h2>
                <p>Sử dụng tiền tố như KM, VOUCHER, CINE kèm theo năm hoặc sự kiện để dễ quản lý kho mã.</p>
              </div>
            </article>
            <article>
              <span>
                <ShieldCheck size={21} />
              </span>
              <div>
                <h2>Bảo mật</h2>
                <p>Mã giảm giá 100% nên được giới hạn số lần sử dụng nghiêm ngặt để tránh thất thoát doanh thu.</p>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function AddPromotionSidebar() {
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

function AddPromotionTopbar() {
  return (
    <header className="admin-topbar">
      <div className="admin-breadcrumb">
        <Link to="/promotions">Mã giảm giá</Link>
        <span>/</span>
        <strong>Thêm mã mới</strong>
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
        <span className="booking-top-avatar">AD</span>
      </div>
    </header>
  );
}

export default AddPromotionPage;
