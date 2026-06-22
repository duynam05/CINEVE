import { LogOut } from "lucide-react";

const defaultAdminAvatar =
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=85";

function getStoredAdmin() {
  try {
    const rawUser = localStorage.getItem("cineve_user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
}

function AdminProfileCard() {
  const admin = getStoredAdmin();
  const name = admin?.fullName || "Quản trị viên";
  const avatar = admin?.avatar || admin?.avatarUrl || defaultAdminAvatar;

  return (
    <section className="admin-profile-card shared-admin-profile" aria-label="Thông tin quản trị viên">
      <img src={avatar} alt={name} />
      <div>
        <strong>{name}</strong>
        <span>CINEVE ADMIN</span>
      </div>
      <button type="button" aria-label="Đăng xuất">
        <LogOut size={18} />
      </button>
    </section>
  );
}

export default AdminProfileCard;
