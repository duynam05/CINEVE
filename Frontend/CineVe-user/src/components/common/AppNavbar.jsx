import { Bell, Search } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import AccountNavActions from "./AccountNavActions.jsx";

function AppNavbar({ active }) {
  return (
    <nav className="home-navbar solid">
      <div className="home-nav-shell">
        <Link to="/" className="home-brand">CineVe</Link>
        <div className="home-nav-links">
          <NavLink className={active === "home" ? "active" : ""} to="/">Trang chủ</NavLink>
          <NavLink className={active === "movies" ? "active" : ""} to="/phim">Phim</NavLink>
          <NavLink className={active === "cinemas" ? "active" : ""} to="/rap">Rạp</NavLink>
          <NavLink className={active === "promotions" ? "active" : ""} to="/khuyen-mai">Khuyến mãi</NavLink>
          <NavLink className={active === "tickets" ? "active" : ""} to="/ve-cua-toi">Vé của tôi</NavLink>
        </div>
        <div className="home-nav-actions">
          <Link className="icon-button" to="/phim" aria-label="Tìm kiếm"><Search size={20} /></Link>
          <Link className="icon-button" to="/thong-bao" aria-label="Thông báo"><Bell size={20} /></Link>
          <AccountNavActions />
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
