import React, { useEffect, useMemo, useState } from "react";
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
import { toast } from "react-toastify";
import { adminFoodApi } from "../api/adminApi";
import { getErrorMessage } from "../api/axiosClient";
import { asArray, formatCurrency, toAbsoluteImage } from "../api/formatters";

function FoodManagementPage() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [loading, setLoading] = useState(true);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const data = await adminFoodApi.list();
      setProducts(asArray(data).map(mapFood));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  const visibleProducts = useMemo(() => {
    if (activeTab === "Tất cả") return products;
    return products.filter((product) => product.category === activeTab);
  }, [activeTab, products]);

  const handleToggle = async (product) => {
    try {
      await adminFoodApi.update(product.id, {
        name: product.name,
        description: product.description,
        type: product.rawType,
        price: product.rawPrice,
        imageUrl: product.rawImage,
        active: !product.active
      });
      toast.success("Thao tác thành công");
      loadFoods();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="food-admin-main">
          <section className="food-heading">
            <div>
              <h1>Quản lý đồ ăn / combo</h1>
              <p>{loading ? "Đang tải dữ liệu..." : "Danh mục món ăn, nước uống và các combo ưu đãi bán kèm vé xem phim."}</p>
            </div>
          </section>

          <section className="food-toolbar">
            <div className="food-tabs">
              {["Tất cả", "Bắp", "Nước", "Combo", "Snack"].map((tab) => (
                <button className={activeTab === tab ? "active" : ""} type="button" key={tab} onClick={() => setActiveTab(tab)}>
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
            {visibleProducts.length ? visibleProducts.map((product) => (
              <article className={`food-card ${product.featured ? "featured" : ""}`} key={product.id || product.name}>
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
                      <input type="checkbox" checked={product.active} onChange={() => handleToggle(product)} />
                      <span />
                    </label>
                  </div>
                </div>
              </article>
            )) : <p>Chưa có dữ liệu</p>}

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

function mapFood(food) {
  const categoryMap = {
    POPCORN: "Bắp",
    DRINK: "Nước",
    COMBO: "Combo",
    SNACK: "Snack"
  };

  return {
    id: food.id,
    name: food.name || "--",
    category: categoryMap[food.type] || "Snack",
    rawType: food.type || "SNACK",
    rawPrice: food.price ?? 0,
    rawImage: food.imageUrl || "",
    price: formatCurrency(food.price),
    description: food.description || "--",
    stock: food.active ? "Còn hàng" : "Hết hàng",
    active: Boolean(food.active),
    featured: food.type === "COMBO",
    image: toAbsoluteImage(food.imageUrl)
  };
}

export default FoodManagementPage;
