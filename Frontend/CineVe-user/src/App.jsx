import { Navigate, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/phim" element={<MoviesPage />} />
      <Route path="/rap" element={<CinemasPage />} />
      <Route path="/khuyen-mai" element={<PromotionsPage />} />
      <Route path="/phim/:id" element={<MovieDetailPage />} />
      <Route path="/chon-suat-chieu" element={<ShowtimeSelectionPage />} />
      <Route path="/chon-ghe" element={<SeatSelectionPage />} />
      <Route path="/thanh-toan" element={<PaymentPage />} />
      <Route path="/dat-ve-thanh-cong" element={<BookingSuccessPage />} />
      <Route path="/ve-cua-toi" element={<MyTicketsPage />} />
      <Route path="/thong-tin-ca-nhan" element={<ProfilePage />} />
      <Route path="/dang-nhap" element={<AuthPage initialMode="login" />} />
      <Route path="/dang-ky" element={<AuthPage initialMode="register" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
