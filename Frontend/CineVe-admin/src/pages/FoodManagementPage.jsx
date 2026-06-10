import React from "react";
import {
  Bell,
  CalendarDays,
  Clapperboard,
  Film,
  LayoutDashboard,
  LogOut,
  Plus,
  Popcorn,
  Search,
  Settings,
  Ticket,
  Warehouse,
} from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    name: "Combo Gia Đình",
    category: "Combo",
    price: "199.000đ",
    description: "2 bắp lớn, 4 nước ngọt size L và 2 snack khoai tây. Phù hợp cho nhóm 4 người.",
    stock: "Còn hàng",
    active: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Bắp Phô Mai Lớn",
    category: "Bắp",
    price: "65.000đ",
    description: "Bắp rang bơ phủ lớp bột phô mai đặc biệt, giòn tan và đậm vị.",
    stock: "Còn hàng",
    active: true,
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Pepsi Max Size",
    category: "Nước",
    price: "45.000đ",
    description: "Nước ngọt Pepsi tươi mát dung tích 1L, phục vụ kèm đá lạnh.",
    stock: "Hết hàng",
    active: false,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Nachos Phô Mai",
    category: "Snack",
    price: "89.000đ",
    description: "Bánh ngô nướng giòn kèm sốt phô mai nóng và ớt Jalapeno cay nhẹ.",
    stock: "Còn hàng",
    active: true,
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Combo Thượng Hạng",
    category: "VIP Combo",
    price: "450.000đ",
    description: "Phần ăn đặc biệt cho phòng chiếu VIP gồm pizza hải sản, đồ uống cao cấp và tráng miệng.",
    stock: "Còn hàng",
    active: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85"
  }
];

function FoodManagementPage() {
  return (
    <div className="admin-shell">
      <FoodSidebar />
      <div className="admin-workspace">
        <FoodTopbar />
        <main className="food-admin-main">
          <section className="food-heading">
            <div>
              <h1>Quản lý đồ ăn / combo</h1>
              <p>Danh mục món ăn, nước uống và các combo ưu đãi bán kèm vé xem phim.</p>
            </div>
          </section>

          <section className="food-toolbar">
            <div className="food-tabs">
              {["Tất cả", "Bắp", "Nước", "Combo", "Snack"].map((tab, index) => (
                <button className={index === 0 ? "active" : ""} type="button" key={tab}>
                  {tab}
                </button>
              ))}
            </div>
            <Link className="food-primary-button" to="/foods/new">
              <Plus size={19} />
              Thêm combo mới
            </Link>
          </section>

          <section className="food-grid">
            {products.map((product) => (
              <article className={`food-card ${product.featured ? "featured" : ""}`} key={product.name}>
                <div className="food-card-media">
                  <img src={product.image} alt={product.name} />
                  <span>{product.category}</span>
                  <div className="food-card-overlay">
                    <button type="button">Chỉnh sửa</button>
                  </div>
                </div>
                <div className="food-card-body">
                  <div className="food-card-title">
                    <h2>{product.name}</h2>
                    <strong>{product.price}</strong>
                  </div>
                  <p>{product.description}</p>
                  <div className="food-card-footer">
                    <span className={product.active ? "food-stock in-stock" : "food-stock out-stock"}>
                      <i />
                      {product.stock}
                    </span>
                    <label className="food-switch" aria-label={`Trạng thái ${product.name}`}>
                      <input type="checkbox" defaultChecked={product.active} />
                      <span />
                    </label>
                  </div>
                </div>
              </article>
            ))}

            <Link className="food-add-card" to="/foods/new">
              <span>
                <Plus size={34} />
              </span>
              Thêm sản phẩm mới
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

function FoodSidebar() {
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

function FoodTopbar() {
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

export default FoodManagementPage;
