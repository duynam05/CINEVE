import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import UserLayout from "./components/layout/UserLayout.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";
import MoviesPage from "./pages/MoviesPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import BookingSuccessPage from "./pages/BookingSuccessPage.jsx";
import MyTicketsPage from "./pages/MyTicketsPage.jsx";
import CinemasPage from "./pages/CinemasPage.jsx";
import PromotionsPage from "./pages/PromotionsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SeatSelectionPage from "./pages/SeatSelectionPage.jsx";
import ShowtimeSelectionPage from "./pages/ShowtimeSelectionPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import TicketDetailPage from "./pages/TicketDetailPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/phim" element={<MoviesPage />} />
        <Route path="/rap" element={<CinemasPage />} />
        <Route path="/khuyen-mai" element={<PromotionsPage />} />
        <Route path="/phim/:id" element={<MovieDetailPage />} />
        <Route path="/chon-suat-chieu" element={<ShowtimeSelectionPage />} />
        <Route path="/chon-ghe" element={<ProtectedRoute><SeatSelectionPage /></ProtectedRoute>} />
        <Route path="/thanh-toan" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/dat-ve-thanh-cong" element={<ProtectedRoute><BookingSuccessPage /></ProtectedRoute>} />
        <Route path="/ve-cua-toi" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />
        <Route path="/ve-cua-toi/:id" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
        <Route path="/my-tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />
        <Route path="/my-tickets/:id" element={<ProtectedRoute><TicketDetailPage /></ProtectedRoute>} />
        <Route path="/thong-tin-ca-nhan" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/phim-yeu-thich" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/thong-bao" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/dang-nhap" element={<AuthPage initialMode="login" />} />
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/dang-ky" element={<AuthPage initialMode="register" />} />
        <Route path="/xac-thuc-email" element={<VerifyEmailPage />} />
        <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
