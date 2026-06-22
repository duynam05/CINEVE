import { Globe2, Mail, Play, Smartphone, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

const quickLinks = [
  { label: "Về chúng tôi", to: "/" },
  { label: "Phim đang chiếu", to: "/phim" },
  { label: "Rạp & Giá vé", to: "/rap" },
  { label: "Khuyến mãi mới nhất", to: "/khuyen-mai" }
];

const supportLinks = [
  { label: "Điều khoản sử dụng", to: "/" },
  { label: "Chính sách bảo mật", to: "/" },
  { label: "Câu hỏi thường gặp", to: "/" },
  { label: "Liên hệ", to: "/" }
];

function Footer() {
  return (
    <footer className="cineve-footer">
      <div className="cineve-footer-inner">
        <section className="cineve-footer-brand" aria-label="Thông tin CineVe">
          <Link className="cineve-footer-logo" to="/">CineVe</Link>
          <p>
            Nâng tầm trải nghiệm điện ảnh với hệ thống đặt vé hiện đại nhất Việt Nam.
            Phim hay, ghế đẹp, bắp nước sẵn sàng.
          </p>
          <div className="cineve-footer-socials" aria-label="Kênh liên hệ">
            <a href="/" aria-label="Website CineVe">
              <Globe2 size={20} />
            </a>
            <a href="/phim" aria-label="Phim tại CineVe">
              <Ticket size={20} />
            </a>
            <a href="mailto:support@cineve.vn" aria-label="Email hỗ trợ CineVe">
              <Mail size={20} />
            </a>
          </div>
        </section>

        <FooterColumn title="Liên kết nhanh" links={quickLinks} />
        <FooterColumn title="Hỗ trợ" links={supportLinks} />

        <section className="cineve-footer-apps" aria-label="Tải ứng dụng">
          <h2>Tải ứng dụng</h2>
          <div className="cineve-app-buttons">
            <a href="/" aria-label="Tải CineVe trên App Store">
              <Smartphone size={24} />
              <span>
                <small>DOWNLOAD ON</small>
                <strong>App Store</strong>
              </span>
            </a>
            <a href="/" aria-label="Tải CineVe trên Google Play">
              <Play size={24} />
              <span>
                <small>GET IT ON</small>
                <strong>Google Play</strong>
              </span>
            </a>
          </div>
        </section>
      </div>

      <div className="cineve-footer-bottom">
        <p>© 2026 CineVe. Trải nghiệm điện ảnh đỉnh cao.</p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <section className="cineve-footer-column">
      <h2>{title}</h2>
      <nav aria-label={title}>
        {links.map((link) => (
          <Link to={link.to} key={link.label}>{link.label}</Link>
        ))}
      </nav>
    </section>
  );
}

export default Footer;
