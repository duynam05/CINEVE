import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddUserPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    toast.success("Thêm người dùng thành công");
    navigate("/users");
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full text-body-md font-body-md text-on-background">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-8">
        <Link className="hover:text-primary" to="/dashboard">Dashboard</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link className="hover:text-primary" to="/users">Người dùng</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary font-semibold">Thêm người dùng</span>
      </nav>

      {/* Main Form Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left Column: Avatar Management */}
          <div className="w-full md:w-[35%] bg-surface-container-low p-10 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-outline-variant/10">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-outline-variant/30 p-1 flex items-center justify-center overflow-hidden bg-surface shadow-xl">
                <img 
                  className="w-full h-full object-cover rounded-full" 
                  alt="Avatar preview" 
                  id="avatar-preview" 
                  src={avatarPreview || "https://lh3.googleusercontent.com/aida-public/AB6AXuCdMgXTNPmPe4QJDZAw6gy5XdNFAB2QRBfpGDH6LwUz-gZIOKAjN7HGwPmVPim6A1eJ0ZUgoiegeCixEQRN5BppYHCmgbAHOZzO9hF776UQCKUZ87ZwkHdiJkthQTjcUMlzc5PSjVdvRcXCKsa27FuKKsQTGUujROwz48IeIZ5WPuCq8UXmiMlQufGZfpHbPC6E4t0lRCeqeeyr3BWzLo-jFVJayoyk0QVqeeptvWHiJzHRClj1HSg6"} 
                />
              </div>
              <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
              </label>
            </div>
          </div>

          {/* Right Column: Form Information */}
          <div className="flex-1 p-8 md:p-12">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Họ và tên</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">person</span>
                    <input className="w-full bg-surface border-outline-variant/30 rounded-xl py-3.5 pl-12 pr-4 text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all" placeholder="Nguyễn Văn A" type="text" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">mail</span>
                    <input className="w-full bg-surface border-outline-variant/30 rounded-xl py-3.5 pl-12 pr-4 text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all" placeholder="email@cinebooking.com" type="email" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Mật khẩu</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
                    <input className="w-full bg-surface border-outline-variant/30 rounded-xl py-3.5 pl-12 pr-12 text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all" placeholder="••••••••" type={showPassword ? "text" : "password"} required />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary" type="button" onClick={() => setShowPassword(!showPassword)}>
                      <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Số điện thoại</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">call</span>
                    <input className="w-full bg-surface border-outline-variant/30 rounded-xl py-3.5 pl-12 pr-4 text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all" placeholder="0901 234 567" type="tel" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Vai trò</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">badge</span>
                    <select className="w-full bg-surface border-outline-variant/30 rounded-xl py-3.5 pl-12 pr-10 text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all appearance-none">
                      <option value="khach_hang">Khách hàng</option>
                      <option value="nhan_vien">Nhân viên</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Trạng thái</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">check_circle</span>
                    <select className="w-full bg-surface border-outline-variant/30 rounded-xl py-3.5 pl-12 pr-10 text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all appearance-none">
                      <option value="hoat_dong">Hoạt động</option>
                      <option value="tam_khoa">Tạm khóa</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-end items-center gap-4">
                <button type="button" onClick={() => navigate("/users")} className="w-full sm:w-auto px-10 py-3.5 border border-outline-variant text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-high active:scale-95 transition-all">
                  Hủy
                </button>
                <button type="submit" className="w-full sm:w-auto px-10 py-3.5 bg-primary-container text-on-primary-container font-bold rounded-xl neon-glow-primary active:scale-95 transition-transform flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">person_add</span>
                  Thêm người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Additional Help/Info Section (Bento Style) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary-container">security</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-1">Bảo mật tối ưu</h4>
            <p className="text-sm text-on-surface-variant/70">Mật khẩu được mã hóa chuẩn AES-256 trước khi lưu vào hệ thống.</p>
          </div>
        </div>
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary">mail</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-1">Xác thực Email</h4>
            <p className="text-sm text-on-surface-variant/70">Hệ thống sẽ gửi mã kích hoạt tự động sau khi tài khoản được tạo.</p>
          </div>
        </div>
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-tertiary">history</span>
          </div>
          <div>
            <h4 className="font-bold text-on-surface mb-1">Nhật ký hoạt động</h4>
            <p className="text-sm text-on-surface-variant/70">Mọi thao tác thêm mới đều được ghi lại trong log hệ thống.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
