import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import AddCinemaPage from "./pages/AddCinemaPage.jsx";
import AddComboPage from "./pages/AddComboPage.jsx";
import AddMoviePage from "./pages/AddMoviePage.jsx";
import AddPromotionPage from "./pages/AddPromotionPage.jsx";
import AddRoomPage from "./pages/AddRoomPage.jsx";
import AddShowtimePage from "./pages/AddShowtimePage.jsx";
import AddUserPage from "./pages/AddUserPage.jsx";
import BookingManagementPage from "./pages/BookingManagementPage.jsx";
import CinemaManagementPage from "./pages/CinemaManagementPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FoodManagementPage from "./pages/FoodManagementPage.jsx";
import MovieManagementPage from "./pages/MovieManagementPage.jsx";
import PromotionManagementPage from "./pages/PromotionManagementPage.jsx";
import RoomManagementPage from "./pages/RoomManagementPage.jsx";
import ShowtimeManagementPage from "./pages/ShowtimeManagementPage.jsx";
import UserManagementPage from "./pages/UserManagementPage.jsx";
import ReviewManagementPage from "./pages/ReviewManagementPage.jsx";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const refreshToken = params.get("refreshToken");
    const rawUser = params.get("user");

    if (!token) return;

    localStorage.setItem("cineve_admin_access_token", token);
    localStorage.setItem("cineve_access_token", token);

    if (refreshToken) {
      localStorage.setItem("cineve_admin_refresh_token", refreshToken);
      localStorage.setItem("cineve_refresh_token", refreshToken);
    }

    if (rawUser) {
      try {
        localStorage.setItem("cineve_admin_user", decodeURIComponent(rawUser));
      } catch {
        localStorage.setItem("cineve_admin_user", rawUser);
      }
    }

    window.history.replaceState({}, document.title, window.location.pathname || "/dashboard");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/movies/new" element={<AddMoviePage />} />
        <Route path="/phim/them-moi" element={<AddMoviePage />} />
        <Route path="/movies" element={<MovieManagementPage />} />
        <Route path="/phim" element={<MovieManagementPage />} />
        <Route path="/cinemas" element={<CinemaManagementPage />} />
        <Route path="/rap" element={<CinemaManagementPage />} />
        <Route path="/cinemas/new" element={<AddCinemaPage />} />
        <Route path="/rap/them-moi" element={<AddCinemaPage />} />
        <Route path="/rooms" element={<RoomManagementPage />} />
        <Route path="/phong-chieu" element={<RoomManagementPage />} />
        <Route path="/rooms/new" element={<AddRoomPage />} />
        <Route path="/phong-chieu/them-moi" element={<AddRoomPage />} />
        <Route path="/showtimes" element={<ShowtimeManagementPage />} />
        <Route path="/lich-chieu" element={<ShowtimeManagementPage />} />
        <Route path="/showtimes/new" element={<AddShowtimePage />} />
        <Route path="/lich-chieu/them-moi" element={<AddShowtimePage />} />
        <Route path="/bookings" element={<BookingManagementPage />} />
        <Route path="/dat-ve" element={<BookingManagementPage />} />
        <Route path="/foods" element={<FoodManagementPage />} />
        <Route path="/do-an" element={<FoodManagementPage />} />
        <Route path="/foods/new" element={<AddComboPage />} />
        <Route path="/do-an/them-moi" element={<AddComboPage />} />
        <Route path="/promotions" element={<PromotionManagementPage />} />
        <Route path="/khuyen-mai" element={<PromotionManagementPage />} />
        <Route path="/promotions/new" element={<AddPromotionPage />} />
        <Route path="/khuyen-mai/them-moi" element={<AddPromotionPage />} />
        <Route path="/users/new" element={<AddUserPage />} />
        <Route path="/nguoi-dung/them-moi" element={<AddUserPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/nguoi-dung" element={<UserManagementPage />} />
        <Route path="/reviews" element={<ReviewManagementPage />} />
        <Route path="/danh-gia" element={<ReviewManagementPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
