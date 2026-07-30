import { useEffect, useState } from "react";
import { QrCode, Ticket } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { bookingApi } from "../api/clientApi";
import AppNavbar from "../components/common/AppNavbar.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import { formatCurrency, formatDateTime, getErrorMessage, translateStatus } from "../utils/format";

function TicketDetailPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const loadBooking = () => {
    setLoading(true);
    bookingApi.detail(id)
      .then(setBooking)
      .catch((err) => setError(getErrorMessage(err, "Không tải được chi tiết vé")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  const canCancel = booking && !["CANCELLED", "EXPIRED", "COMPLETED"].includes(booking.status) && booking.ticket?.status !== "CANCELLED";

  const handleCancel = async () => {
    if (!canCancel || !window.confirm("Bạn chắc chắn muốn hủy vé này?")) return;

    setCancelling(true);
    try {
      await bookingApi.cancel(id);
      toast.success("Hủy vé thành công");
      loadBooking();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể hủy vé"));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="booking-success-page">
      <AppNavbar active="tickets" />
      {loading ? (
        <LoadingState />
      ) : error ? (
        <LoadingState text={error} />
      ) : (
        <main className="booking-success-main">
          <section className="success-card">
            <Ticket size={54} />
            <h1>Chi tiết vé</h1>
            <p>Mã đặt vé: <strong>{booking.code}</strong></p>
            <div className="ticket-detail-grid">
              <Field label="Mã vé" value={booking.ticket?.code} accent />
              <Field label="Phim" value={booking.showtime?.movieTitle} />
              <Field label="Rạp" value={booking.showtime?.cinemaName} />
              <Field label="Phòng" value={booking.showtime?.roomName} />
              <Field label="Thời gian chiếu" value={formatDateTime(booking.showtime?.startTime)} />
              <Field label="Ghế" value={(booking.seats || []).map((seat) => seat.code).join(", ")} accent />
              <Field label="Tổng tiền" value={formatCurrency(booking.totalAmount)} accent />
              <Field label="Trạng thái vé" value={translateStatus(booking.ticket?.status || booking.status)} />
            </div>
            <div className="qr-panel">
              <QrCode size={112} />
              <strong>{booking.ticket?.qrCode || booking.ticket?.code || booking.code}</strong>
            </div>
            {canCancel && (
              <button className="primary-action" type="button" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? "Đang hủy vé..." : "Hủy vé"}
              </button>
            )}
            <Link className="primary-action" to="/ve-cua-toi">Quay lại vé của tôi</Link>
          </section>
        </main>
      )}
    </div>
  );
}

function Field({ label, value, accent }) {
  return <div><p>{label}</p><strong className={accent ? "accent" : ""}>{value || "Đang cập nhật"}</strong></div>;
}

export default TicketDetailPage;
