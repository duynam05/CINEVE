import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Search, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { adminReviewApi, adminMovieApi } from "../api/adminApi";
import { toast } from "react-toastify";
import { getErrorMessage } from "../api/axiosClient";
import { asArray, getInitials, formatDateTime } from "../api/formatters";

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [movieFilter, setMovieFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    adminMovieApi.list().then(data => setMovies(asArray(data))).catch(console.error);
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = {};
      if (movieFilter !== "all") params.movieId = movieFilter;
      if (ratingFilter !== "all") params.rating = ratingFilter;

      const data = await adminReviewApi.list(params);
      setReviews(asArray(data));
    } catch (error) {
      toast.error(getErrorMessage(error));
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [movieFilter, ratingFilter]);

  const visibleReviews = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    setCurrentPage(1);
    return reviews.filter(review => {
      const matchQuery = [review.userFullName, review.content].join(" ").toLowerCase().includes(normalized);
      const matchVisibility = visibilityFilter === "all" || (visibilityFilter === "visible" ? review.visible : !review.visible);
      return matchQuery && matchVisibility;
    });
  }, [reviews, query, visibilityFilter]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const fiveStars = reviews.filter(r => r.rating === 5).length;
    const hidden = reviews.filter(r => !r.visible).length;
    const avgScore = total > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) : 0;
    
    return { total, fiveStars, hidden, avgScore };
  }, [reviews]);

  const totalPages = Math.ceil(visibleReviews.length / pageSize) || 1;
  const currentReviews = useMemo(() => {
    return visibleReviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [visibleReviews, currentPage]);

  const handleHide = async (review) => {
    try {
      await adminReviewApi.hide(review.id);
      toast.success("Đã ẩn đánh giá");
      loadReviews();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleShow = async (review) => {
    try {
      await adminReviewApi.show(review.id);
      toast.success("Đã hiển thị đánh giá");
      loadReviews();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này vĩnh viễn?")) return;
    try {
      await adminReviewApi.remove(review.id);
      toast.success("Xóa đánh giá thành công");
      loadReviews();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <main className="booking-admin-main">
          {/* Header Section */}
          <section className="booking-heading">
            <h1>Quản lý đánh giá</h1>
            <p>Quản lý các bài đánh giá và xếp hạng từ người dùng.</p>
          </section>

          {/* Statistics Cards */}
          <section className="booking-stat-grid">
            <StatCard label="Tổng đánh giá" value={stats.total} meta="Tất cả" tone="gold" trend="up" />
            <StatCard label="Đánh giá 5 sao" value={stats.fiveStars} meta="Xuất sắc" tone="gold" trend="up" />
            <StatCard label="Đánh giá bị ẩn" value={stats.hidden} meta="Vi phạm" tone="danger" trend="down" />
            <StatCard label="Điểm trung bình" value={stats.avgScore} meta="/ 5.0" tone="silver" />
          </section>

          {/* Toolbar / Filters */}
          <section className="booking-table-card">
            <div className="booking-filter-grid">
              <label className="wide">
                <div>
                  <Search size={18} />
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nội dung, tên..." />
                </div>
              </label>
              <label>
                <select value={movieFilter} onChange={e => setMovieFilter(e.target.value)}>
                  <option value="all">Tất cả phim</option>
                  {movies.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </label>
              <label>
                <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}>
                  <option value="all">Tất cả xếp hạng</option>
                  <option value="5">5 Sao</option>
                  <option value="4">4 Sao</option>
                  <option value="3">3 Sao</option>
                  <option value="2">2 Sao</option>
                  <option value="1">1 Sao</option>
                </select>
              </label>
              <label>
                <select value={visibilityFilter} onChange={e => setVisibilityFilter(e.target.value)}>
                  <option value="all">Tất cả hiển thị</option>
                  <option value="visible">Đang hiển thị</option>
                  <option value="hidden">Bị ẩn</option>
                </select>
              </label>
            </div>

            {/* Data Table */}
            <div className="booking-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Người đánh giá</th>
                    <th>Phim</th>
                    <th>Xếp hạng</th>
                    <th>Nội dung</th>
                    <th>Trạng thái</th>
                    <th>Ngày</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReviews.length ? currentReviews.map((review) => (
                    <tr key={review.id} style={{ opacity: review.visible ? 1 : 0.6 }}>
                      <td>
                        <div className="booking-customer">
                          <i>{getInitials(review.userFullName || "U")}</i>
                          <div>
                            <strong>{review.userFullName || "Người dùng"}</strong>
                            <span>{review.userId ? "Thành viên" : "--"}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{review.movieTitle}</strong>
                      </td>
                      <td>
                        <strong style={{ color: "#e9c349", fontSize: 18, letterSpacing: 2 }}>{renderStars(review.rating)}</strong>
                      </td>
                      <td>
                        <i style={{ color: "inherit", opacity: review.visible ? 1 : 0.8 }} title={review.content}>
                          {review.content?.length > 50 ? review.content.substring(0, 50) + "..." : review.content}
                        </i>
                      </td>
                      <td>
                        <div className="booking-status-wrap">
                          <span className={`booking-status ${review.visible ? "paid" : "danger"}`}>
                            <i />
                            {review.visible ? "Công khai" : "Đã ẩn"}
                          </span>
                        </div>
                      </td>
                      <td>{formatDateTime(review.createdAt)}</td>
                      <td>
                        <div className="booking-actions">
                          {review.visible ? (
                            <button type="button" aria-label="Ẩn" onClick={() => handleHide(review)}><EyeOff size={17} /></button>
                          ) : (
                            <button type="button" aria-label="Hiện" onClick={() => handleShow(review)}><Eye size={17} /></button>
                          )}
                          <button className="refund" type="button" aria-label="Xóa" onClick={() => handleDelete(review)}><Trash2 size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7">Không tìm thấy đánh giá nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <footer className="booking-pagination">
              <p>Hiển thị <strong>{currentReviews.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, visibleReviews.length)}</strong> trong số <strong>{visibleReviews.length}</strong> đánh giá</p>
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
