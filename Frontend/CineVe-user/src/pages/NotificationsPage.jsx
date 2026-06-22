import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { notificationApi } from "../api/clientApi";
import AppNavbar from "../components/common/AppNavbar.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import { formatDateTime, getErrorMessage, translateStatus } from "../utils/format";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    notificationApi.list()
      .then((result) => setNotifications(result || []))
      .catch((err) => toast.error(getErrorMessage(err, "Không tải được thông báo")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể đánh dấu đã đọc"));
    }
  };

  const remove = async (id) => {
    try {
      await notificationApi.remove(id);
      toast.success("Đã xóa thông báo");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể xóa thông báo"));
    }
  };

  return (
    <div className="movies-page">
      <AppNavbar />
      <main className="movies-main">
        <header className="movies-header"><span><Bell size={18} /> CineVe</span><h1>Thông báo</h1><p>Cập nhật mới nhất về booking và vé của bạn.</p></header>
        {loading ? <LoadingState /> : notifications.length === 0 ? <LoadingState text="Bạn chưa có thông báo" /> : (
          <section className="notification-list">
            {notifications.map((item) => (
              <article className={`notification-card ${item.read ? "" : "unread"}`} key={item.id}>
                <div>
                  <span>{translateStatus(item.type)}</span>
                  <h2>{item.title}</h2>
                  <p>{item.content}</p>
                  <small>{formatDateTime(item.createdAt)}</small>
                </div>
                <div className="ticket-actions-row">
                  {!item.read && <button type="button" onClick={() => markRead(item.id)}><Check size={16} /> Đã đọc</button>}
                  <button type="button" onClick={() => remove(item.id)}><Trash2 size={16} /> Xóa</button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default NotificationsPage;
