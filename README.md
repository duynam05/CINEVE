# CineVe - Hệ Thống Đặt Vé Xem Phim Trực Tuyến

Dự án website đặt vé xem phim trực tuyến gồm Backend (Spring Boot 3) và Frontend (ReactJS/Vite) phân quyền người dùng và quản trị viên.

## 1. Yêu Cầu Hệ Thống
- **Java:** JDK 21
- **Node.js:** v18+ 
- **Database:** MySQL 8+ (tạo database tên `cineve`)

## 2. Khởi Chạy Backend
Mở terminal tại thư mục `cinema`:
```bash
cd cinema
mvn.cmd spring-boot:run
```
*(Cấu hình database được thiết lập tại `src/main/resources/application.yaml`)*

## 3. Khởi Chạy Frontend User
Mở terminal mới tại thư mục `Frontend/CineVe-user`:
```bash
npm install
npm run dev
```

## 4. Khởi Chạy Frontend Admin
Mở terminal mới tại thư mục `Frontend/CineVe-admin`:
```bash
npm install
npm run dev
```

## 5. Tạo Dữ Liệu Mẫu (Seed Data)
Đảm bảo backend đang chạy ở `http://localhost:8080`, sau đó chạy script tự động tạo dữ liệu mẫu (8 phim, 3 rạp, phòng chiếu, 15 suất chiếu, combo, khuyến mãi...):
```bash
cd D:\cinema
npm install axios
node seed.js
```

## 6. Danh Sách Tính Năng Hiện Có
- **Xác thực:** Đăng ký, Đăng nhập, Gửi OTP xác thực Email, Quên mật khẩu.
- **Người dùng:** Đặt vé, chọn ghế theo sơ đồ (Thường/VIP/Couple), áp dụng mã giảm giá, mua đồ ăn, xem lịch sử đặt vé, hủy vé.
- **Tính năng mở rộng:** Đánh giá phim (cho người đã xem), lưu phim yêu thích, hệ thống thông báo in-app.
- **Admin:** Dashboard thống kê (Recharts), quản lý phim, cụm rạp, phòng chiếu (sinh sơ đồ ghế tự động), suất chiếu (validate chống trùng giờ), quản lý đơn hàng/vé, voucher.

## 7. Tài khoản Test
- **Admin:** `admin@cineve.vn` / `admin123`
- **User:** Bạn có thể tự đăng ký một tài khoản trên giao diện User.
