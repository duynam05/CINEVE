import React from "react";
import { Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get("token");
  
  const token = tokenFromUrl || localStorage.getItem("cineve_admin_access_token") || localStorage.getItem("cineve_access_token");
  
  const handleLogout = () => {
    localStorage.removeItem("cineve_admin_access_token");
    localStorage.removeItem("cineve_access_token");
    localStorage.removeItem("cineve_admin_refresh_token");
    localStorage.removeItem("cineve_refresh_token");
    localStorage.removeItem("cineve_admin_user");
    localStorage.removeItem("cineve_user");
    window.location.reload();
  };

  const renderError = (title, message, showLogout = false) => (
    <div style={{ padding: "50px", textAlign: "center", color: "#e2e2e2", background: "#121414", minHeight: "100vh" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>{title}</h2>
      <p style={{ color: "#a0a0a0", marginBottom: "24px" }}>{message}</p>
      {showLogout && (
        <button 
          onClick={handleLogout} 
          style={{ padding: "10px 20px", cursor: "pointer", background: "var(--primary-strong, #e50914)", color: "#fff", border: "none", borderRadius: 8, fontWeight: "bold" }}
        >
          Đăng xuất / Quay lại
        </button>
      )}
    </div>
  );

  if (!token) {
    return renderError("Không có quyền truy cập", "Vui lòng đăng nhập với tài khoản Quản trị viên để tiếp tục.");
  }

  try {
    const base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    
    if (!payload.exp) {
      return renderError("Phiên đăng nhập không hợp lệ", "Token không chứa thời gian hết hạn.", true);
    }

    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      return renderError("Phiên đăng nhập đã hết hạn", "Token của bạn đã hết hạn, vui lòng đăng nhập lại.", true);
    }

    const roles = (payload.scope || "").split(" ");
    if (!roles.includes("ROLE_ADMIN")) {
      return renderError("Truy cập bị từ chối", "Tài khoản của bạn không có quyền truy cập trang quản trị.", true);
    }
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    return renderError("Lỗi xác thực", "Token không hợp lệ hoặc bị hỏng.", true);
  }

  return <Outlet />;
}
