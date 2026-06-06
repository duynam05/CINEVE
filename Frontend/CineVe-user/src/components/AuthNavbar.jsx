import { Bell, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

function AuthNavbar({ mode, onModeChange }) {
  return (
    <nav className="auth-navbar">
      <div className="nav-shell">
        <NavLink to="/dang-nhap" className="brand">
          CineVe
        </NavLink>

        <div className="nav-links" aria-label="Điều hướng chính">
          <NavLink to="/" className="nav-link">
            Trang chủ
          </NavLink>
          <NavLink to="/phim" className="nav-link">
            Phim
          </NavLink>
          <NavLink to="/rap" className="nav-link">
            Rạp
          </NavLink>
          <NavLink to="/khuyen-mai" className="nav-link">
            Khuyến mãi
          </NavLink>
          <NavLink to="/ve-cua-toi" className="nav-link">
            Vé của tôi
          </NavLink>
        </div>

        <div className="nav-actions">
          <div className="nav-icons" aria-label="Công cụ nhanh">
            <button className="icon-button" type="button" aria-label="Tìm kiếm">
              <Search size={20} />
            </button>
            <button className="icon-button" type="button" aria-label="Thông báo">
              <Bell size={20} />
            </button>
          </div>

          <button
            className={`text-button ${mode === "login" ? "selected" : ""}`}
            type="button"
            onClick={() => onModeChange("login")}
          >
            Đăng nhập
          </button>
          <button
            className="primary-pill"
            type="button"
            onClick={() => onModeChange("register")}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AuthNavbar;
