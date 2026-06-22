import { ChevronDown, LogOut, Ticket, UserRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";
import { assetUrl } from "../../utils/format";

const defaultAvatar =
  "https://ui-avatars.com/api/?name=CineVe&background=e50914&color=ffffff&bold=true";

function AccountNavActions() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const displayName = useMemo(() => getDisplayName(user), [user]);
  const avatarUrl = user?.avatar ? assetUrl(user.avatar) : defaultAvatar;

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const logout = () => {
    signOut();
    setOpen(false);
    toast.success("Đăng xuất thành công");
    navigate("/");
  };

  if (user) {
    return (
      <div
        className="nav-user-menu"
        ref={menuRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          className={`nav-user-trigger ${open ? "active" : ""}`}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <img className="nav-user-avatar" src={avatarUrl} alt={displayName} />
          <span>{displayName}</span>
          <ChevronDown size={16} />
        </button>

        {open && (
          <div className="nav-user-dropdown" role="menu">
            <Link to="/thong-tin-ca-nhan" role="menuitem" onClick={() => setOpen(false)}>
              <UserRound size={18} />
              <span>Thông tin cá nhân</span>
            </Link>
            <Link to="/ve-cua-toi" role="menuitem" onClick={() => setOpen(false)}>
              <Ticket size={18} />
              <span>Vé của tôi</span>
            </Link>
            <button type="button" role="menuitem" onClick={logout}>
              <LogOut size={18} />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Link className="nav-login" to="/dang-nhap">Đăng nhập</Link>
      <Link className="nav-register" to="/dang-ky">Đăng ký</Link>
    </>
  );
}

function getDisplayName(user) {
  if (!user) return "Người dùng";
  if (user.fullName) return user.fullName;
  if (user.name) return user.name;
  if (user.email?.includes("@")) return user.email.split("@")[0];
  return "Người dùng";
}

export default AccountNavActions;
