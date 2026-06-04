import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MovieDetailPage from "./pages/MovieDetailPage.jsx";
import MoviesPage from "./pages/MoviesPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/phim" element={<MoviesPage />} />
      <Route path="/phim/:id" element={<MovieDetailPage />} />
      <Route path="/dang-nhap" element={<AuthPage initialMode="login" />} />
      <Route path="/dang-ky" element={<AuthPage initialMode="register" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
