import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AddMoviePage from "./pages/AddMoviePage.jsx";
import CinemaManagementPage from "./pages/CinemaManagementPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import MovieManagementPage from "./pages/MovieManagementPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/movies/new" element={<AddMoviePage />} />
      <Route path="/phim/them-moi" element={<AddMoviePage />} />
      <Route path="/movies" element={<MovieManagementPage />} />
      <Route path="/phim" element={<MovieManagementPage />} />
      <Route path="/cinemas" element={<CinemaManagementPage />} />
      <Route path="/rap" element={<CinemaManagementPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
