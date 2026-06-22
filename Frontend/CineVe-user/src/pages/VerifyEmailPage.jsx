import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "../api/clientApi";
import AuthNavbar from "../components/AuthNavbar.jsx";
import { getErrorMessage } from "../utils/format";

function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(location.state?.otp || "");
  const [submitting, setSubmitting] = useState(false);

  const verify = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await authApi.verifyEmail({ email, otp });
      toast.success("Xác thực Email thành công, bạn có thể đăng nhập");
      navigate("/dang-nhap", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Xác thực Email thất bại"));
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      const result = await authApi.resendVerification({ email });
      setOtp(result?.verificationOtp || "");
      toast.success("Đã gửi lại mã xác thực");
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể gửi lại mã xác thực"));
    }
  };

  return (
    <div className="auth-page">
      <AuthNavbar mode="login" onModeChange={() => navigate("/dang-nhap")} />
      <main className="auth-main">
        <section className="auth-card">
          <div className="auth-heading">
            <MailCheck size={40} />
            <h1>Xác thực Email</h1>
            <p>Nhập mã OTP backend trả về để kích hoạt tài khoản.</p>
          </div>
          <form className="auth-form visible" onSubmit={verify}>
            <label className="field"><span className="field-label">Email</span><span className="input-shell"><input value={email} onChange={(event) => setEmail(event.target.value)} /></span></label>
            <label className="field"><span className="field-label">Mã OTP</span><span className="input-shell"><input value={otp} onChange={(event) => setOtp(event.target.value)} /></span></label>
            <button className="primary-action" type="submit" disabled={submitting}>{submitting ? "Đang xác thực..." : "Xác thực Email"}</button>
            <button className="secondary-action" type="button" onClick={resend}>Gửi lại mã</button>
            <div className="switch-prompt"><span>Đã xác thực?</span><Link to="/dang-nhap">Đăng nhập</Link></div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default VerifyEmailPage;
