import httpClient, { unwrap } from "./httpClient";

const get = async (url, config) => unwrap(await httpClient.get(url, config));
const post = async (url, payload, config) => unwrap(await httpClient.post(url, payload, config));
const put = async (url, payload, config) => unwrap(await httpClient.put(url, payload, config));
const del = async (url, config) => unwrap(await httpClient.delete(url, config));

export const authApi = {
  login: (payload) => post("/api/auth/login", payload),
  register: (payload) => post("/api/auth/register", payload),
  me: () => get("/api/auth/me"),
  changePassword: (payload) => put("/api/auth/change-password", payload),
  logout: (refreshToken) => post("/api/auth/logout", { refreshToken }),
  verifyEmail: (payload) => post("/api/auth/verify-email", payload),
  resendVerification: (payload) => post("/api/auth/resend-verification", payload),
  forgotPassword: (payload) => post("/api/auth/forgot-password", payload),
  resetPassword: (payload) => post("/api/auth/reset-password", payload)
};

export const userApi = {
  me: () => get("/api/users/me"),
  updateMe: (payload) => put("/api/users/me", payload)
};

export const movieApi = {
  list: (params = {}) => get("/api/movies", { params }),
  nowShowing: () => get("/api/movies/now-showing"),
  comingSoon: () => get("/api/movies/coming-soon"),
  detail: (id) => get(`/api/movies/${id}`),
  showtimes: (id, date) => get(`/api/movies/${id}/showtimes`, { params: date ? { date } : {} }),
  reviews: (id) => get(`/api/movies/${id}/reviews`),
  createReview: (id, payload) => post(`/api/movies/${id}/reviews`, payload)
};

export const genreApi = {
  list: () => get("/api/genres")
};

export const cinemaApi = {
  list: (city) => get("/api/cinemas", { params: city ? { city } : {} }),
  detail: (id) => get(`/api/cinemas/${id}`),
  showtimes: (id, date) => get(`/api/cinemas/${id}/showtimes`, { params: date ? { date } : {} })
};

export const showtimeApi = {
  list: (params = {}) => get("/api/showtimes", { params }),
  detail: (id) => get(`/api/showtimes/${id}`),
  seats: (id) => get(`/api/showtimes/${id}/seats`)
};

export const foodApi = {
  list: () => get("/api/foods")
};

export const couponApi = {
  apply: (payload) => post("/api/coupons/apply", payload)
};

export const bookingApi = {
  create: (payload) => post("/api/bookings", payload),
  my: () => get("/api/bookings/my"),
  detail: (id) => get(`/api/bookings/${id}`),
  ticket: (id) => get(`/api/bookings/${id}/ticket`),
  cancel: (id) => put(`/api/bookings/${id}/cancel`)
};

export const favoriteApi = {
  list: () => get("/api/favorites"),
  add: (movieId) => post(`/api/favorites/${movieId}`),
  remove: (movieId) => del(`/api/favorites/${movieId}`)
};

export const notificationApi = {
  list: () => get("/api/notifications/my"),
  markRead: (id) => put(`/api/notifications/${id}/read`),
  remove: (id) => del(`/api/notifications/${id}`)
};
