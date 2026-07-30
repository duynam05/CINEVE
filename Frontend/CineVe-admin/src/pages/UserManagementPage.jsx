import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Edit, Eye, Lock, LockOpen, Plus, Search, TrendingDown, TrendingUp, UserMinus } from "lucide-react";
import { adminUserApi } from "../api/adminApi";
import { toast } from "react-toastify";
import { getErrorMessage } from "../api/axiosClient";
import { asArray, getInitials } from "../api/formatters";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== "all") params.status = statusFilter;
      if (roleFilter !== "all") params.role = roleFilter;
      if (query.trim()) params.keyword = query.trim();

      const data = await adminUserApi.list(params);
      setUsers(asArray(data));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [statusFilter, roleFilter]); // query changes can be applied via button or debounce, but local filtering is also an option if backend doesn't support all. We'll do local filter for search if backend keyword doesn't work well, but let's try calling API on blur/enter or local filter.

  // Let's do local filter for the query since we already fetch based on status/role, 
  // or we can fetch whenever query changes (with debounce). 
  // For simplicity and immediate response, we'll do local filtering for the text query 
  // and status/role, but wait, the backend supports `keyword`, `status`, `role`.
  // Since we fetch on status/role changes, we can also filter locally to be fast.
  const visibleUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    setCurrentPage(1);
    return users.filter(user => {
      const matchQuery = [user.fullName, user.email, user.phone].join(" ").toLowerCase().includes(normalized);
      return matchQuery;
    });
  }, [users, query]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((item) => item.status === "ACTIVE").length,
      pending: users.filter((item) => item.status === "PENDING_VERIFICATION").length,
      disabled: users.filter((item) => item.status === "DISABLED").length
    };
  }, [users]);

  const totalPages = Math.ceil(visibleUsers.length / pageSize) || 1;
  const currentUsers = useMemo(() => {
    return visibleUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [visibleUsers, currentPage]);

  const handleLock = async (user) => {
    if (!window.confirm(`Khóa tài khoản ${user.email}?`)) return;
    try {
      await adminUserApi.lock(user.id);
      toast.success("Khóa tài khoản thành công");
      loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUnlock = async (user) => {
    if (!window.confirm(`Mở khóa tài khoản ${user.email}?`)) return;
    try {
      await adminUserApi.unlock(user.id);
      toast.success("Mở khóa tài khoản thành công");
      loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDisable = async (user) => {
    if (!window.confirm(`Vô hiệu hóa (xóa) tài khoản ${user.email}?`)) return;
    try {
      await adminUserApi.remove(user.id);
      toast.success("Vô hiệu hóa tài khoản thành công");
      loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const getStatusDisplay = (status) => {
    if (status === "ACTIVE") return { label: "Hoạt động", tone: "paid" };
    if (status === "PENDING_VERIFICATION") return { label: "Chờ xác minh", tone: "pending" };
    if (status === "DISABLED") return { label: "Đã khóa", tone: "cancelled" };
    return { label: status, tone: "silver" };
  };

  const getRoleDisplay = (roles) => {
    if (!roles || !roles.length) return "User";
    return roles.map(r => r.name.replace("ROLE_", "")).join(", ");
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="booking-admin-main">
          {/* Header Section */}
          <section className="booking-heading" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>Quản lý người dùng</h1>
              <p>Quản lý toàn bộ người dùng trong hệ thống.</p>
            </div>
            <Link className="add-movie-button" to="/users/new" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "var(--primary-strong)", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 600, textDecoration: "none" }}>
              <Plus size={18} />
              Thêm người dùng
            </Link>
          </section>

          {/* Stats Grid */}
          <section className="booking-stat-grid">
            <StatCard label="Tổng người dùng" value={stats.total} meta="Tất cả" tone="gold" trend="up" />
            <StatCard label="Đang hoạt động" value={stats.active} meta="Đã xác minh" tone="gold" trend="up" />
            <StatCard label="Chờ xác minh" value={stats.pending} meta="Chưa kích hoạt" tone="silver" />
            <StatCard label="Tài khoản bị khóa" value={stats.disabled} meta="Vô hiệu hóa" tone="danger" trend="down" />
          </section>

          {/* Table & Filters */}
          <section className="booking-table-card">
            <div className="booking-filter-grid">
              <label className="wide">
                <div>
                  <Search size={18} />
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tên khách, email..." />
                </div>
              </label>
              <label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="PENDING_VERIFICATION">Chờ xác minh</option>
                  <option value="DISABLED">Bị khóa</option>
                </select>
              </label>
              <label>
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                  <option value="all">Tất cả vai trò</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">Người dùng</option>
                </select>
              </label>
            </div>

            <div className="booking-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Liên hệ</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length ? currentUsers.map((user) => {
                    const statusInfo = getStatusDisplay(user.status);
                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="booking-customer">
                            <i>{getInitials(user.fullName || user.email)}</i>
                            <div>
                              <strong>{user.fullName || "--"}</strong>
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>{user.phone || "--"}</td>
                        <td>
                          <strong>{getRoleDisplay(user.roles)}</strong>
                        </td>
                        <td>
                          <div className="booking-status-wrap">
                            <span className={`booking-status ${statusInfo.tone}`}>
                              <i />
                              {statusInfo.label}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="booking-actions">
                            {user.status === "DISABLED" ? (
                              <button type="button" aria-label="Mở khóa" onClick={() => handleUnlock(user)}><LockOpen size={17} /></button>
                            ) : (
                              <button type="button" aria-label="Khóa" onClick={() => handleLock(user)}><Lock size={17} /></button>
                            )}
                            <button className="refund" type="button" aria-label="Xóa" onClick={() => handleDisable(user)}><UserMinus size={17} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="5">Không tìm thấy người dùng nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="booking-pagination">
              <p>Hiển thị <strong>{currentUsers.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, visibleUsers.length)}</strong> trong số <strong>{visibleUsers.length}</strong> người dùng</p>
              <div>
                <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}><ChevronLeft size={16} /></button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} type="button" className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                ))}
                <button type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}><ChevronRight size={16} /></button>
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, meta, tone, trend }) {
  return (
    <article className={`booking-stat-card ${tone}`}>
      <span>{label}</span>
      <div>
        <strong>{value}</strong>
        <small>
          {meta}
          {trend === "up" && <TrendingUp size={13} />}
          {trend === "down" && <TrendingDown size={13} />}
        </small>
      </div>
    </article>
  );
}
