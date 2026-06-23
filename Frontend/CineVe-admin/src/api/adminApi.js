import axiosClient, { unwrap } from "./axiosClient";

const get = async (url, config) => unwrap(await axiosClient.get(url, config));
const post = async (url, payload, config) => unwrap(await axiosClient.post(url, payload, config));
const put = async (url, payload, config) => unwrap(await axiosClient.put(url, payload, config));
const patch = async (url, payload, config) => unwrap(await axiosClient.patch(url, payload, config));
const del = async (url, config) => unwrap(await axiosClient.delete(url, config));

export const adminDashboardApi = {
  summary: () => get("/admin/dashboard/summary"),
  revenueByDay: (params = {}) => get("/admin/dashboard/revenue-by-day", { params }),
  revenueByMonth: (params = {}) => get("/admin/dashboard/revenue-by-month", { params }),
  topMovies: (params = {}) => get("/admin/dashboard/top-movies", { params }),
  bookingStatus: () => get("/admin/dashboard/booking-status"),
  paymentMethods: () => get("/admin/dashboard/payment-methods")
};

export const adminMovieApi = {
  list: (params = {}) => get("/admin/movies", { params }),
  publicList: (params = {}) => get("/movies", { params }),
  detail: (id) => get(`/admin/movies/${id}`),
  create: (payload) => post("/admin/movies", payload),
  update: (id, payload) => put(`/admin/movies/${id}`, payload),
  updateStatus: (id, status) => patch(`/admin/movies/${id}/status`, null, { params: { status } }),
  remove: (id) => del(`/admin/movies/${id}`),
  uploadPoster: (id, formData) =>
    post(`/admin/movies/${id}/poster`, formData, { headers: { "Content-Type": "multipart/form-data" } })
};

export const adminGenreApi = {
  list: () => get("/admin/genres"),
  publicList: () => get("/genres"),
  create: (payload) => post("/admin/genres", payload),
  update: (id, payload) => put(`/admin/genres/${id}`, payload),
  remove: (id) => del(`/admin/genres/${id}`)
};

export const adminCinemaApi = {
  list: () => get("/admin/cinemas"),
  publicList: (params = {}) => get("/cinemas", { params }),
  detail: (id) => get(`/admin/cinemas/${id}`),
  create: (payload) => post("/admin/cinemas", payload),
  update: (id, payload) => put(`/admin/cinemas/${id}`, payload),
  updateStatus: (id, status) => patch(`/admin/cinemas/${id}/status`, null, { params: { status } }),
  remove: (id) => del(`/admin/cinemas/${id}`)
};

export const adminRoomApi = {
  list: (params = {}) => get("/admin/rooms", { params }),
  byCinema: (cinemaId) => get("/admin/rooms", { params: { cinemaId } }),
  detail: (id) => get(`/admin/rooms/${id}`),
  create: (payload) => post("/admin/rooms", payload),
  update: (id, payload) => put(`/admin/rooms/${id}`, payload),
  remove: (id) => del(`/admin/rooms/${id}`),
  generateSeats: (roomId) => post(`/admin/rooms/${roomId}/seats/generate`)
};

export const adminSeatApi = {
  byRoom: (roomId) => get("/admin/seats", { params: { roomId } }),
  update: (id, payload) => put(`/admin/seats/${id}`, payload),
  updateStatus: (id, status) => patch(`/admin/seats/${id}/status`, null, { params: { status } }),
  maintenance: (id) => patch(`/admin/seats/${id}/status`, null, { params: { status: "MAINTENANCE" } }),
  active: (id) => patch(`/admin/seats/${id}/status`, null, { params: { status: "ACTIVE" } })
};

export const adminShowtimeApi = {
  list: (params = {}) => get("/admin/showtimes", { params }),
  publicList: (params = {}) => get("/showtimes", { params }),
  detail: (id) => get(`/admin/showtimes/${id}`),
  create: (payload) => post("/admin/showtimes", payload),
  update: (id, payload) => put(`/admin/showtimes/${id}`, payload),
  remove: (id) => del(`/admin/showtimes/${id}`)
};

export const adminBookingApi = {
  list: (params = {}) => get("/admin/bookings", { params }),
  detail: (id) => get(`/admin/bookings/${id}`),
  confirm: (id) => put(`/admin/bookings/${id}/confirm`),
  cancel: (id) => put(`/admin/bookings/${id}/cancel`),
  refund: (id) => put(`/admin/bookings/${id}/refund`)
};

export const adminPaymentApi = {
  list: (params = {}) => get("/admin/payments", { params }),
  detail: (id) => get(`/admin/payments/${id}`)
};

export const adminFoodApi = {
  list: () => get("/admin/foods"),
  publicList: () => get("/foods"),
  detail: (id) => get(`/admin/foods/${id}`),
  create: (payload) => post("/admin/foods", payload),
  update: (id, payload) => put(`/admin/foods/${id}`, payload),
  remove: (id) => del(`/admin/foods/${id}`)
};

export const adminCouponApi = {
  list: () => get("/admin/coupons"),
  create: (payload) => post("/admin/coupons", payload),
  update: (id, payload) => put(`/admin/coupons/${id}`, payload),
  remove: (id) => del(`/admin/coupons/${id}`)
};

export const adminReviewApi = {
  list: (params = {}) => get("/admin/reviews", { params }),
  hide: (id) => patch(`/admin/reviews/${id}/hide`),
  show: (id) => patch(`/admin/reviews/${id}/show`),
  remove: (id) => del(`/admin/reviews/${id}`)
};

export const adminUserApi = {
  list: (params = {}) => get("/admin/users", { params }),
  detail: (id) => get(`/admin/users/${id}`),
  lock: (id) => put(`/admin/users/${id}/lock`),
  unlock: (id) => put(`/admin/users/${id}/unlock`),
  remove: (id) => del(`/admin/users/${id}`)
};
