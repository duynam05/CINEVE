import { useEffect, useState } from "react";
import {
  Bell,
  Crown,
  Edit3,
  Eye,
  EyeOff,
  Gift,
  History,
  Save,
  Search,
  ShieldCheck,
  Star,
  Ticket,
  UserRound,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi, userApi } from "../api/clientApi";
import AccountNavActions from "../components/common/AccountNavActions.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { assetUrl, getErrorMessage } from "../utils/format";

const initialProfile = {
  fullName: "Nguyễn Thế Vinh",
  email: "vinh.nguyen@example.com",
  phone: "0912 345 678",
  birthday: "1998-08-18"
};

const defaultAvatar =
  "https://ui-avatars.com/api/?name=CineVe&background=e50914&color=ffffff&bold=true";

const benefits = [
  "Giảm 20% bắp nước cho mọi suất chiếu",
  "Nâng cấp ghế VIP miễn phí 2 lần mỗi tháng",
  "Quà tặng sinh nhật và ưu đãi chiếu sớm"
];

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: ""
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false
  });

  useEffect(() => {
    let ignore = false;

    const applyUser = (currentUser) => {
      const nextProfile = {
        ...initialProfile,
        fullName: currentUser?.fullName || currentUser?.name || initialProfile.fullName,
        email: currentUser?.email || initialProfile.email,
        phone: currentUser?.phone || initialProfile.phone
      };
      setProfile(nextProfile);
      setSavedProfile(nextProfile);
    };

    if (user) {
      applyUser(user);
    }

    userApi.me()
      .then((currentUser) => {
        if (!ignore) applyUser(currentUser);
      })
      .catch((error) => {
        if (!ignore && !user) {
          toast.error(getErrorMessage(error, "Không tải được thông tin cá nhân"));
        }
      });

    return () => {
      ignore = true;
    };
  }, [user]);

  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const updatePassword = (field, value) => {
    setPasswords((current) => ({ ...current, [field]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);

    try {
      const updated = await userApi.updateMe({
        fullName: profile.fullName,
        phone: profile.phone?.replace(/\s/g, "") || ""
      });
      const nextProfile = {
        ...profile,
        fullName: updated.fullName || profile.fullName,
        email: updated.email || profile.email,
        phone: updated.phone || profile.phone
      };
      setProfile(nextProfile);
      setSavedProfile(nextProfile);
      updateUser(updated);
      toast.success("Đã lưu thông tin cá nhân");
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể lưu thông tin cá nhân"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      toast.error("Vui lòng nhập đầy đủ thông tin mật khẩu");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      toast.error("Mật khẩu xác nhận chưa khớp");
      return;
    }

    setSavingPassword(true);

    try {
      await authApi.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next
      });
      setPasswords({ current: "", next: "", confirm: "" });
      toast.success("Đã cập nhật mật khẩu");
    } catch (error) {
      toast.error(getErrorMessage(error, "Không thể cập nhật mật khẩu"));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="profile-page">
      <ProfileNavbar />

      <main className="profile-main">
        <aside className="profile-sidebar">
          <section className="profile-card profile-summary-card">
            <div className="profile-avatar-wrap">
              <img
                className="profile-avatar"
                src={user?.avatar ? assetUrl(user.avatar) : defaultAvatar}
                alt="Ảnh đại diện người dùng"
              />
              <button type="button" className="avatar-edit" aria-label="Đổi ảnh đại diện">
                <Edit3 size={16} />
              </button>
            </div>
            <h1>{profile.fullName}</h1>
            <p>{profile.email}</p>
            <span className="member-pill">
              <Crown size={16} />
              Hạng Kim Cương
            </span>

            <div className="profile-stats">
              <div>
                <strong>1,250</strong>
                <span>CinePoints</span>
              </div>
              <div>
                <strong>12</strong>
                <span>Vé đã đặt</span>
              </div>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-card-title">
              <Gift size={20} />
              <h2>Quyền lợi thành viên</h2>
            </div>
            <ul className="benefit-list">
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <Star size={16} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <section className="profile-content">
          <form className="profile-panel" onSubmit={handleProfileSubmit}>
            <div className="profile-panel-heading">
              <div>
                <span>Hồ sơ cá nhân</span>
                <h2>Thông tin cá nhân</h2>
              </div>
              <UserRound size={26} />
            </div>

            <div className="profile-form-grid">
              <label>
                <span>Họ và tên</span>
                <input value={profile.fullName} onChange={(event) => updateProfile("fullName", event.target.value)} />
              </label>
              <label>
                <span>Email</span>
                <input type="email" value={profile.email} disabled readOnly />
              </label>
              <label>
                <span>Số điện thoại</span>
                <input value={profile.phone} onChange={(event) => updateProfile("phone", event.target.value)} />
              </label>
              <label>
                <span>Ngày sinh</span>
                <input type="date" value={profile.birthday} onChange={(event) => updateProfile("birthday", event.target.value)} />
              </label>
            </div>

            <div className="profile-actions">
              <button type="button" className="secondary-action" onClick={() => setProfile(savedProfile)}>
                <X size={18} />
                Hủy thay đổi
              </button>
              <button type="submit" className="primary-action">
                <Save size={18} />
                {savingProfile ? "Đang lưu..." : "Lưu thông tin"}
              </button>
            </div>
          </form>

          <section className="profile-panel password-panel">
            <div className="profile-panel-heading">
              <div>
                <span>Bảo mật tài khoản</span>
                <h2>Đổi mật khẩu</h2>
              </div>
              <ShieldCheck size={26} />
            </div>

            <div className="security-layout">
              <form className="password-form" onSubmit={handlePasswordSubmit}>
                <PasswordField
                  label="Mật khẩu hiện tại"
                  value={passwords.current}
                  visible={showPassword.current}
                  onChange={(value) => updatePassword("current", value)}
                  onToggle={() => setShowPassword((current) => ({ ...current, current: !current.current }))}
                />
                <PasswordField
                  label="Mật khẩu mới"
                  value={passwords.next}
                  visible={showPassword.next}
                  onChange={(value) => updatePassword("next", value)}
                  onToggle={() => setShowPassword((current) => ({ ...current, next: !current.next }))}
                />
                <PasswordField
                  label="Xác nhận mật khẩu"
                  value={passwords.confirm}
                  visible={showPassword.confirm}
                  onChange={(value) => updatePassword("confirm", value)}
                  onToggle={() => setShowPassword((current) => ({ ...current, confirm: !current.confirm }))}
                />
                <button type="submit" className="primary-action">
                  <ShieldCheck size={18} />
                  {savingPassword ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </button>
              </form>

              <div className="security-tips">
                <h3>Gợi ý bảo mật</h3>
                <p>Dùng mật khẩu tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
                <p>Không chia sẻ mã đặt vé, mã QR hoặc thông tin đăng nhập cho người khác.</p>
              </div>
            </div>
          </section>

          <section className="profile-reward-grid">
            <article className="profile-mini-card">
              <Gift size={24} />
              <div>
                <h3>Ưu đãi độc quyền</h3>
                <p>03 voucher đang chờ bạn sử dụng trong tháng này.</p>
              </div>
            </article>
            <article className="profile-mini-card">
              <History size={24} />
              <div>
                <h3>Lịch sử hoạt động</h3>
                <p>Đã tích điểm từ 6 giao dịch gần nhất tại CineVe.</p>
              </div>
            </article>
            <article className="profile-mini-card">
              <Ticket size={24} />
              <div>
                <h3>Vé sắp tới</h3>
                <p>Bạn có 2 suất chiếu đang chờ check-in.</p>
              </div>
            </article>
          </section>
        </section>
      </main>

    </div>
  );
}

function PasswordField({ label, value, visible, onChange, onToggle }) {
  return (
    <label className="password-field">
      <span>{label}</span>
      <div>
        <input type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} />
        <button type="button" onClick={onToggle} aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

function ProfileNavbar() {
  return (
    <nav className="home-navbar solid">
      <div className="home-nav-shell profile-nav-shell">
        <Link to="/" className="home-brand">CineVe</Link>
        <div className="home-nav-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/phim">Phim</Link>
          <Link to="/rap">Rạp</Link>
          <Link to="/khuyen-mai">Khuyến mãi</Link>
          <Link to="/ve-cua-toi">Vé của tôi</Link>
        </div>
        <div className="home-nav-actions profile-nav-actions">
          <button className="icon-button" type="button" aria-label="Tìm kiếm">
            <Search size={20} />
          </button>
          <button className="icon-button" type="button" aria-label="Thông báo">
            <Bell size={20} />
          </button>
          <AccountNavActions />
        </div>
      </div>
    </nav>
  );
}

function ProfileFooter() {
  return (
    <footer className="profile-footer">
      <div>
        <Link to="/" className="footer-brand">CineVe</Link>
        <p>Trải nghiệm đặt vé nhanh, quản lý tài khoản và nhận ưu đãi thành viên trong một nơi.</p>
      </div>
      <div className="profile-footer-links">
        <Link to="/khuyen-mai">Ưu đãi</Link>
        <Link to="/ve-cua-toi">Vé của tôi</Link>
        <Link to="/rap">Hệ thống rạp</Link>
      </div>
    </footer>
  );
}

export default ProfilePage;
