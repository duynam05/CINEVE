const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=320&q=85";

export const asArray = (value) => (Array.isArray(value) ? value : []);

export const safeText = (value, fallback = "--") => {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
};

export const formatCurrency = (value) => {
  const number = Number(value ?? 0);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(Number.isFinite(number) ? number : 0);
};

export const formatCompactCurrency = (value) => {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return "0đ";
  if (number >= 1_000_000_000) return `${(number / 1_000_000_000).toFixed(1)}B`;
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`;
  if (number >= 1_000) return `${Math.round(number / 1_000)}K`;
  return formatCurrency(number);
};

export const formatDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("vi-VN").format(date);
};

export const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit"
  }).format(date);
};

export const formatTimeRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return "--";
  const formatter = new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" });
  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
};

export const toAbsoluteImage = (url) => {
  if (!url) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(url)) return url;
  return `http://localhost:8080${url}`;
};

export const getInitials = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "AD";

export const movieStatusLabel = (status) =>
  ({
    NOW_SHOWING: "Đang chiếu",
    COMING_SOON: "Sắp chiếu",
    ENDED: "Ngừng chiếu",
    HIDDEN: "Đã ẩn"
  }[status] || "--");

export const movieStatusTone = (status) =>
  ({
    NOW_SHOWING: "showing",
    COMING_SOON: "upcoming",
    ENDED: "ended",
    HIDDEN: "ended"
  }[status] || "ended");

export const bookingStatusLabel = (status) =>
  ({
    PENDING: "Chờ thanh toán",
    CONFIRMED: "Đã thanh toán",
    COMPLETED: "Hoàn tất",
    CANCELLED: "Đã hủy",
    EXPIRED: "Hết hạn"
  }[status] || "--");

export const bookingTone = (status) =>
  ({
    PENDING: "pending",
    CONFIRMED: "paid",
    COMPLETED: "paid",
    CANCELLED: "cancelled",
    EXPIRED: "cancelled"
  }[status] || "pending");

export const activeStatusLabel = (active) => (active ? "Hoạt động" : "Tạm dừng");

export const activeTone = (active) => (active ? "active" : "expired");
