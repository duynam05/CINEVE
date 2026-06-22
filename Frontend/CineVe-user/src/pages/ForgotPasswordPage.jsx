import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "../api/clientApi";
import AuthNavbar from "../components/AuthNavbar.jsx";
import { getErrorMessage } from "../utils/format";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requestReset = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await authApi.forgotPassword({ email });
      setResetToken(result?.resetToken || "");
      toast.success("Đã tạo mã đặt lại mật khẩu");
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể tạo mã đặt lại mật khẩu"));
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await authApi.resetPassword({ resetToken, newPassword });
      toast.success("Đặt lại mật khẩu thành công");
      navigate("/dang-nhap", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Đặt lại mật khẩu thất bại"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthNavbar mode="login" onModeChange={() => navigate("/dang-nhap")} />
      <main className="auth-main">
        <section className="auth-card">
          <div className="auth-heading">
            <KeyRound size={40} />
            <h1>Quên mật khẩu</h1>
            <p>Nhập Email để lấy reset token test từ backend, sau đó đặt mật khẩu mới.</p>
          </div>
          <form className="auth-form visible" onSubmit={requestReset}>
            <label className="field"><span className="field-label">Email</span><span className="input-shell"><input value={email} onChange={(event) => setEmail(event.target.value)} /></span></label>
            <button className="primary-action" type="submit" disabled={submitting}>Lấy mã đặt lại</button>
          </form>
          <form className="auth-form visible" onSubmit={resetPassword}>
            <label className="field"><span className="field-label">Reset token</span><span className="input-shell"><input value={resetToken} onChange={(event) => setResetToken(event.target.value)} /></span></label>
            <label className="field"><span className="field-label">Mật khẩu mới</span><span className="input-shell"><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></span></label>
            <button className="primary-action" type="submit" disabled={submitting}>Đặt lại mật khẩu</button>
            <div className="switch-prompt"><span>Đã nhớ mật khẩu?</span><Link to="/dang-nhap">Đăng nhập</Link></div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default ForgotPasswordPage;
