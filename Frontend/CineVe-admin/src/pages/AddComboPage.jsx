import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  Clapperboard,
  CloudUpload,
  Film,
  Info,
  LayoutDashboard,
  LogOut,
  Plus,
  Popcorn,
  Settings,
  Ticket,
  Trash2,
  Utensils,
  Warehouse
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { adminFoodApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";

const includedItems = [
  {
    name: "Bắp rang bơ (Lớn)",
    detail: "Vị: Caramel, Phô mai",
    quantity: "x1",
    icon: Popcorn
  },
  {
    name: "Nước ngọt (Lớn)",
    detail: "Coca-cola / Pepsi / Sprite",
    quantity: "x2",
    icon: Utensils
  }
];

function AddComboPage() {
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const category = formData.get("type") || "COMBO";

    try {
      await adminFoodApi.create({
        name: formData.get("name") || "",
        description: formData.get("description") || "",
        type: category,
        price: Number(formData.get("price") || 0),
        imageUrl: "",
        active: formData.get("active") === "on"
      });
      toast.success("Thao tác thành công");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="add-combo-main">
          <header className="add-combo-title">
            <Link to="/foods" aria-label="Quay lại quản lý đồ ăn">
              <ArrowLeft size={21} />
            </Link>
            <div>
              <p>Đồ ăn / Combo</p>
              <h1>Thêm combo mới</h1>
            </div>
          </header>

          <form className="add-combo-form" onSubmit={handleSubmit}>
            <section className="add-combo-left">
              <article className="add-combo-panel">
                <label>
                  <span>Tên combo</span>
                  <input name="name" placeholder="Nhập tên combo (VD: Combo Solo, Combo Couple...)" />
                </label>
                <label>
                  <span>Mô tả</span>
                  <textarea name="description" rows="4" placeholder="Mô tả ngắn gọn về combo này..." />
                </label>
                <div className="add-combo-two-cols">
                  <label>
                    <span>Giá bán (VNĐ)</span>
                    <div className="add-combo-price">
                      <input name="price" type="number" min="0" placeholder="0" />
                      <strong>đ</strong>
                    </div>
                  </label>
                  <label>
                    <span>Danh mục</span>
                    <select name="type" defaultValue="COMBO">
                      <option value="COMBO">Combo tiết kiệm</option>
                      <option value="COMBO">Combo VIP</option>
                      <option value="SNACK">Đồ ăn lẻ</option>
                      <option value="DRINK">Nước uống</option>
                    </select>
                  </label>
                </div>
              </article>

              <article className="add-combo-panel">
                <div className="add-combo-section-head">
                  <h2>Món trong combo</h2>
                  <button type="button">
                    <Plus size={17} />
                    Thêm món
                  </button>
                </div>
                <div className="combo-item-list">
                  {includedItems.map((item) => (
                    <div className="combo-item-row" key={item.name}>
                      <span className="combo-item-icon">
                        <item.icon size={23} />
                      </span>
                      <div>
                        <strong>{item.name}</strong>
                        <small>{item.detail}</small>
                      </div>
                      <b>{item.quantity}</b>
                      <button type="button" aria-label={`Xóa ${item.name}`}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <aside className="add-combo-right">
              <article className="add-combo-panel">
                <label className="add-combo-upload-label">Ảnh sản phẩm</label>
                <div
                  className={`add-combo-dropzone ${isDragging ? "dragging" : ""}`}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                  }}
                >
                  <CloudUpload size={42} />
                  <strong>Kéo thả hoặc nhấp để tải lên</strong>
                  <span>PNG, JPG, tối đa 5MB</span>
                </div>
                <div className="add-combo-tip">
                  <Info size={18} />
                  <p>Sử dụng hình ảnh sản phẩm thực tế trên nền tối để đạt hiệu ứng tốt nhất trên giao diện khách hàng.</p>
                </div>
              </article>

              <article className="add-combo-panel add-combo-settings">
                <ToggleSetting
                  title="Hiển thị trên app"
                  description="Khách hàng có thể nhìn thấy combo này"
                  name="active"
                  defaultChecked
                />
                <ToggleSetting
                  title="Combo VIP"
                  description="Gắn nhãn vàng cao cấp"
                  accent="gold"
                />
                <div className="add-combo-actions">
                  <button type="submit">
                    <Check size={18} />
                    Lưu combo mới
                  </button>
                  <Link to="/foods">Hủy bỏ</Link>
                </div>
              </article>
            </aside>
          </form>
        </main>
      </div>
    </div>
  );
}

function ToggleSetting({ title, description, defaultChecked = false, accent = "red", name }) {
  return (
    <div className="add-combo-toggle-row">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <label className={`food-switch ${accent}`} aria-label={title}>
        <input name={name} type="checkbox" defaultChecked={defaultChecked} />
        <span />
      </label>
    </div>
  );
}

function AddComboSidebar() {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { label: "Phim", icon: Film, to: "/movies" },
    { label: "Rạp", icon: Warehouse, to: "/cinemas" },
    { label: "Phòng chiếu", icon: Clapperboard, to: "/rooms" },
    { label: "Lịch chiếu", icon: CalendarDays, to: "/showtimes" },
    { label: "Đặt vé", icon: Ticket, to: "/bookings" },
    { label: "Đồ ăn/Combo", icon: Popcorn, to: "/foods", active: true },
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

function AddComboTopbar() {
  return (
    <header className="admin-topbar">
      <div className="admin-breadcrumb">
        <Link to="/foods">Đồ ăn / Combo</Link>
        <span>/</span>
        <strong>Thêm combo mới</strong>
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

export default AddComboPage;
