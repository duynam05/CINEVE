import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { favoriteApi } from "../api/clientApi";
import AppNavbar from "../components/common/AppNavbar.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import { assetUrl, getErrorMessage, translateStatus } from "../utils/format";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    favoriteApi.list()
      .then((result) => setFavorites(result || []))
      .catch((err) => toast.error(getErrorMessage(err, "Không tải được phim yêu thích")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (movieId) => {
    try {
      await favoriteApi.remove(movieId);
      toast.success("Đã xóa khỏi phim yêu thích");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể xóa phim yêu thích"));
    }
  };

  return (
    <div className="movies-page">
      <AppNavbar active="movies" />
      <main className="movies-main">
        <header className="movies-header"><span><Heart size={18} /> CineVe</span><h1>Phim yêu thích</h1><p>Danh sách phim bạn đã lưu.</p></header>
        {loading ? <LoadingState /> : favorites.length === 0 ? <LoadingState text="Bạn chưa có phim yêu thích" /> : (
          <section className="movie-card-grid">
            {favorites.map(({ id, movie }) => (
              <article className="movie-card" key={id}>
                <Link to={`/phim/${movie.id}`}><img src={assetUrl(movie.posterUrl)} alt={movie.title} /></Link>
                <div>
                  <span>{translateStatus(movie.status)}</span>
                  <h3>{movie.title}</h3>
                  <Link to={`/phim/${movie.id}`}>Xem chi tiết</Link>
                  <button type="button" onClick={() => remove(movie.id)}><Trash2 size={16} /> Xóa yêu thích</button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default FavoritesPage;
