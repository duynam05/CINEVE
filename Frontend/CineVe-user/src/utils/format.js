export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8080";

export const fallbackPoster =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85";

export function assetUrl(url) {
  if (!url) return fallbackPoster;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "Chưa cập nhật";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) return "Chưa cập nhật";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

export function formatTime(value) {
  if (!value) return "--:--";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function translateStatus(status) {
  const labels = {
    COMING_SOON: "Sắp chiếu",
    NOW_SHOWING: "Đang chiếu",
    ENDED: "Đã kết thúc",
    HIDDEN: "Đã ẩn",
    OPEN: "Đang mở bán",
    CLOSED: "Đã đóng",
    CANCELLED: "Đã hủy",
    FINISHED: "Đã kết thúc",
    PENDING: "Chờ thanh toán",
    CONFIRMED: "Đã xác nhận",
    COMPLETED: "Đã hoàn thành",
    EXPIRED: "Hết hạn",
    ACTIVE: "Còn hiệu lực",
    USED: "Đã sử dụng",
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
    REFUNDED: "Đã hoàn tiền",
    NORMAL: "Ghế thường",
    VIP: "Ghế VIP",
    COUPLE: "Ghế đôi",
    MAINTENANCE: "Bảo trì",
    DISABLED: "Đã khóa",
    CASH: "Thanh toán tại quầy",
    MOMO: "MoMo",
    VNPAY: "VNPay",
    BANK_TRANSFER: "Chuyển khoản",
    BANK_CARD: "Thẻ ngân hàng"
  };

  return labels[status] || status || "Chưa cập nhật";
}

export function getErrorMessage(error, fallback = "Có lỗi xảy ra, vui lòng thử lại") {
  return error?.response?.data?.message || error?.message || fallback;
}
