import { forwardRef, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail, Phone, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AuthNavbar from "../components/AuthNavbar.jsx";
import { login, register } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const backgroundImage =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80";

function AuthPage({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const title = useMemo(
    () => (mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản"),
    [mode]
  );

  const handleMouseMove = (event) => {
    const x = (event.clientX - window.innerWidth / 2) * 0.01;
    const y = (event.clientY - window.innerHeight / 2) * 0.01;
    setBgOffset({ x, y });
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    navigate(nextMode === "login" ? "/dang-nhap" : "/dang-ky", { replace: true });
  };

  return (
    <div className="auth-page" onMouseMove={handleMouseMove}>
      <div className="cinema-background" aria-hidden="true">
        <img
          src={backgroundImage}
          alt=""
          style={{ transform: `scale(1.1) translate(${bgOffset.x}px, ${bgOffset.y}px)` }}
        />
        <div className="background-overlay" />
      </div>

      <AuthNavbar mode={mode} onModeChange={handleModeChange} />

      <main className="auth-main">
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-heading">
            <h1 id="auth-title">{title}</h1>
            <p>
              {mode === "login"
                ? "Đăng nhập để tiếp tục trải nghiệm điện ảnh của bạn."
                : "Tham gia cùng cộng đồng yêu phim tại CineVe."}
            </p>
          </div>

          <div className="form-switcher" data-mode={mode}>
            <LoginForm
              isActive={mode === "login"}
              onRegisterClick={() => handleModeChange("register")}
              onLoggedIn={(authResult) => {
                signIn(authResult);
                toast.success("Đăng nhập thành công");
                if (isAdminUser(authResult?.user)) {
                  redirectToAdmin(authResult);
                  return;
                }
                navigate(location.state?.from?.pathname || "/", { replace: true });
              }}
            />
            <RegisterForm
              isActive={mode === "register"}
              onLoginClick={() => handleModeChange("login")}
              onRegistered={(result, email) => {
                toast.success("Đăng ký thành công, vui lòng xác thực Email");
                navigate("/xac-thuc-email", {
                  state: {
                    email,
                    otp: result?.verificationOtp
                  }
                });
              }}
            />
          </div>
        </section>
      </main>

    </div>
  );
}

function LoginForm({ isActive, onRegisterClick, onLoggedIn }) {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: true
    }
  });

  const onSubmit = async (values) => {
    try {
      const data = await login({
        email: values.email,
        password: values.password
      });
      onLoggedIn(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <form
      className={`auth-form ${isActive ? "visible" : "hidden"}`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Field
        icon={<Mail size={20} />}
        label="Email"
        type="email"
        placeholder="name@example.com"
        error={errors.email?.message}
        {...registerField("email", {
          required: "Vui lòng nhập Email",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Email không hợp lệ"
          }
        })}
      />

      <Field
        icon={<Lock size={20} />}
        label="Mật khẩu"
        type="password"
        placeholder="Nhập mật khẩu"
        error={errors.password?.message}
        {...registerField("password", {
          required: "Vui lòng nhập mật khẩu"
        })}
      />

      <div className="form-row">
        <label className="checkbox-label">
          <input type="checkbox" {...registerField("remember")} />
          <span>Ghi nhớ tôi</span>
        </label>
        <Link to="/quen-mat-khau">Quên mật khẩu?</Link>
      </div>

      <button className="primary-action" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <div className="switch-prompt">
        <span>Bạn chưa có tài khoản?</span>
        <button type="button" onClick={onRegisterClick}>
          Đăng ký ngay
        </button>
      </div>
    </form>
  );
}

function RegisterForm({ isActive, onLoginClick, onRegistered }) {
  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    }
  });

  const password = watch("password");

  const onSubmit = async (values) => {
    try {
      const result = await register({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password
      });
      onRegistered(result, values.email);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <form
      className={`auth-form ${isActive ? "visible" : "hidden"}`}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Field
        icon={<UserRound size={20} />}
        label="Họ tên"
        type="text"
        placeholder="Nguyễn Văn A"
        error={errors.fullName?.message}
        {...registerField("fullName", {
          required: "Vui lòng nhập họ tên",
          minLength: {
            value: 2,
            message: "Họ tên phải có ít nhất 2 ký tự"
          }
        })}
      />

      <Field
        icon={<Mail size={20} />}
        label="Email"
        type="email"
        placeholder="name@example.com"
        error={errors.email?.message}
        {...registerField("email", {
          required: "Vui lòng nhập Email",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Email không hợp lệ"
          }
        })}
      />

      <Field
        icon={<Phone size={20} />}
        label="Số điện thoại"
        type="tel"
        placeholder="0123456789"
        error={errors.phone?.message}
        {...registerField("phone", {
          pattern: {
            value: /^(|[0-9]{10,11})$/,
            message: "Số điện thoại phải có 10 đến 11 chữ số"
          }
        })}
      />

      <div className="field-grid">
        <Field
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          error={errors.password?.message}
          {...registerField("password", {
            required: "Vui lòng nhập mật khẩu",
            minLength: {
              value: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự"
            }
          })}
        />

        <Field
          label="Xác nhận"
          type="password"
          placeholder="Nhập lại mật khẩu"
          error={errors.confirmPassword?.message}
          {...registerField("confirmPassword", {
            required: "Vui lòng nhập lại mật khẩu",
            validate: (value) => value === password || "Mật khẩu xác nhận không khớp"
          })}
        />
      </div>

      <p className="terms">
        Bằng cách đăng ký, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>
      </p>

      <button className="primary-action" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
      </button>

      <div className="switch-prompt">
        <span>Đã có tài khoản?</span>
        <button type="button" onClick={onLoginClick}>
          Đăng nhập ngay
        </button>
      </div>
    </form>
  );
}

const Field = forwardRef(({ icon, label, error, ...inputProps }, ref) => (
  <label className="field">
    <span className="field-label">{label}</span>
    <span className={`input-shell ${error ? "has-error" : ""}`}>
      {icon && <span className="input-icon">{icon}</span>}
      <input ref={ref} className={icon ? "with-icon" : ""} {...inputProps} />
    </span>
    {error && <span className="field-error">{error}</span>}
  </label>
));

Field.displayName = "Field";

function isAdminUser(user) {
  const roles = Array.isArray(user?.roles) ? user.roles : Array.from(user?.roles || []);
  return roles.some((role) => {
    const name = typeof role === "string" ? role : role?.name;
    return name === "ADMIN" || name === "ROLE_ADMIN";
  });
}

function redirectToAdmin(authResult) {
  const adminBaseUrl = import.meta.env.VITE_ADMIN_BASE_URL || "http://localhost:5174";
  const params = new URLSearchParams({
    token: authResult?.token || "",
    refreshToken: authResult?.refreshToken || "",
    user: encodeURIComponent(JSON.stringify(authResult?.user || {}))
  });

  window.location.assign(`${adminBaseUrl}/dashboard?${params.toString()}`);
}

export default AuthPage;
