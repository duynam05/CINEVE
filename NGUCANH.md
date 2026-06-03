# Ngữ cảnh dự án CineVe

## Thông tin chung

- Tên dự án: CineVe - Website đặt vé xem phim trực tuyến.
- Mục tiêu: xây dựng website đặt vé xem phim đầy đủ backend, frontend và database để học tập, đưa GitHub/CV.
- Ngôn ngữ giao diện: tiếng Việt có dấu.
- Backend hiện tại nằm tại: `D:\cinema\cinema`.
- Thư mục `D:\cinema\project-web` được dùng làm ví dụ cấu trúc backend Spring Boot.

## Công nghệ mục tiêu

Backend:

- Java 21.
- Spring Boot 3.5.x.
- Maven.
- Package chính: `com.duynam.cinema`.
- Spring Web.
- Spring Data JPA.
- Spring Security.
- JWT Authentication.
- MySQL Driver.
- Lombok.
- Validation.
- Swagger / Springdoc OpenAPI.
- BCrypt mã hóa mật khẩu.
- RESTful API.
- DTO Request / Response.
- Global Exception Handler.

Frontend sau này:

- ReactJS.
- Vite.
- React Router DOM.
- Axios.
- React Hook Form.
- React Toastify.
- Recharts.
- Bootstrap hoặc Tailwind CSS.
- Auth Context.
- Protected Route.
- Admin Route.
- Responsive UI.

Database:

- MySQL.
- Database name: `cineve`.

## Quy ước kiến trúc

Dự án backend đi theo cấu trúc giống mẫu `project-web`, gồm các package chính:

```text
configuration
constant
controller
dto/request
dto/response
entity
exception
mapper
repository
service
validator
```

Nguyên tắc code:

- Controller chỉ nhận request và trả response.
- Service xử lý nghiệp vụ.
- Repository thao tác database.
- Entity ánh xạ bảng database.
- DTO dùng để nhận/trả dữ liệu, không trả trực tiếp entity nếu không cần.
- Mapper chuyển Entity sang DTO.
- Response thống nhất qua `ApiResponse`.
- Lỗi xử lý tập trung qua `GlobalExceptionHandler`.
- Mật khẩu luôn mã hóa bằng BCrypt.
- Phân quyền bằng role `USER` và `ADMIN`.
- API admin sau này phải chặn user thường.

## Giai đoạn 1 đã hoàn thành

Đã triển khai backend authentication cơ bản:

- Setup cấu hình backend.
- Cấu hình MySQL database `cineve`.
- Tạo cấu trúc package theo mẫu.
- Tạo authentication:
  - Đăng ký.
  - Đăng nhập.
  - Lấy thông tin user hiện tại.
  - Đổi mật khẩu.
  - JWT.
  - BCrypt.
  - Role `USER` / `ADMIN`.
  - CORS.
  - Swagger.
  - Global exception handler.

Đã mở rộng authentication:

- Đăng xuất bằng cách đưa access token vào blacklist và thu hồi refresh token nếu có.
- Refresh token, dùng cơ chế xoay vòng refresh token sau mỗi lần làm mới.
- Quên mật khẩu giả lập, backend trả `resetToken` và `otp` trong response để test trước khi tích hợp gửi email thật.
- Xác thực email khi đăng ký:
  - User đăng ký xong ở trạng thái `PENDING_VERIFICATION`.
  - Backend tạo OTP xác thực email và trả trong response để test.
  - User gọi API xác thực email bằng OTP.
  - Tài khoản chuyển sang `ACTIVE`.
  - User chưa xác thực email không đăng nhập được.

## API đã có

Base path:

```text
/api/auth
```

Danh sách endpoint:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
POST /api/auth/verify-email
POST /api/auth/resend-verification
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
PUT  /api/auth/change-password
```

Endpoint public:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/verify-email
POST /api/auth/resend-verification
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /swagger-ui.html
GET  /swagger-ui/**
GET  /v3/api-docs/**
```

Các API còn lại cần header:

```text
Authorization: Bearer <token>
```

## Logic authentication hiện tại

Đăng ký:

- Nhận `fullName`, `email`, `phone`, `password`.
- Chuẩn hóa email về chữ thường.
- Kiểm tra email đã tồn tại chưa.
- Mã hóa password bằng BCrypt.
- Gán role mặc định `USER`.
- Gán trạng thái ban đầu `PENDING_VERIFICATION`.
- Lưu user vào database.
- Tạo OTP xác thực email, lưu vào bảng `auth_tokens` với type `EMAIL_VERIFICATION`.
- Trả về `RegisterResponse` gồm `user` và `verificationOtp` để test.

Xác thực email:

- Nhận `email`, `otp`.
- Tìm OTP còn hiệu lực, chưa dùng trong bảng `auth_tokens`.
- Nếu OTP hợp lệ, chuyển user sang `ACTIVE`.
- Đánh dấu token đã dùng bằng `usedAt`.
- User chưa `ACTIVE` không đăng nhập được.

Gửi lại mã xác thực:

- Nhận `email`.
- Chỉ áp dụng cho tài khoản chưa xác thực.
- Tạo OTP xác thực email mới.
- Trả `verificationOtp` trong response để test.

Đăng nhập:

- Nhận `email`, `password`.
- Kiểm tra user tồn tại.
- Kiểm tra tài khoản không bị `DISABLED`.
- Kiểm tra tài khoản đã xác thực email, trạng thái phải là `ACTIVE`.
- So khớp password bằng BCrypt.
- Sinh JWT HS512.
- JWT có subject là email.
- JWT có claim `scope`, ví dụ `ROLE_USER` hoặc `ROLE_ADMIN`.
- JWT có `jti` để phục vụ blacklist khi logout.
- Tạo refresh token, lưu vào bảng `refresh_tokens`.
- Trả về access token, refresh token và thông tin user.

Refresh token:

- Nhận `refreshToken`.
- Kiểm tra token tồn tại, chưa bị revoke, chưa hết hạn.
- Kiểm tra user vẫn còn `ACTIVE`.
- Revoke refresh token cũ.
- Tạo access token mới và refresh token mới.
- Trả về cặp token mới.

Đăng xuất:

- Endpoint cần Bearer access token.
- Đọc `jti` và thời hạn của access token.
- Lưu `jti` vào bảng `invalidated_tokens`.
- Nếu request có `refreshToken`, revoke refresh token đó.
- Các API bảo vệ sẽ từ chối access token đã nằm trong blacklist.

Quên mật khẩu:

- Nhận `email`.
- Kiểm tra user tồn tại và không bị khóa.
- Tạo reset token và OTP, lưu vào bảng `auth_tokens` với type `PASSWORD_RESET`.
- Trả `resetToken` và `otp` trong response để test, chưa gửi email thật.

Đặt lại mật khẩu:

- Nhận `resetToken`, `newPassword`.
- Kiểm tra reset token tồn tại, chưa dùng, chưa hết hạn.
- Mã hóa mật khẩu mới bằng BCrypt.
- Lưu lại user.
- Đánh dấu reset token đã dùng.

Lấy thông tin hiện tại:

- Đọc email từ `SecurityContextHolder`.
- Tìm user theo email.
- Trả về `UserResponse`.

Đổi mật khẩu:

- Bắt buộc đăng nhập.
- Kiểm tra mật khẩu hiện tại.
- Mã hóa mật khẩu mới.
- Lưu lại user.

## Admin bootstrap

Khi app khởi động:

- Tự tạo role `USER` nếu chưa có.
- Tự tạo role `ADMIN` nếu chưa có.
- Nếu bật `app.bootstrap.admin.enabled=true`, tự tạo admin mặc định nếu email chưa tồn tại.

Cấu hình mặc định trong `application.yaml`:

```yaml
app:
  bootstrap:
    admin:
      enabled: true
      email: admin@cineve.vn
      password: admin123
      full-name: Quản trị viên
```

## Cấu hình chính hiện tại

File:

```text
src/main/resources/application.yaml
```

Các cấu hình quan trọng:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/cineve}
    username: ${SPRING_DATASOURCE_USERNAME:root}
    password: ${SPRING_DATASOURCE_PASSWORD:root}
  jpa:
    hibernate:
      ddl-auto: ${SPRING_JPA_HIBERNATE_DDL_AUTO:update}

jwt:
  signer-key: ${JWT_SIGNER_KEY:0123456789012345678901234567890123456789012345678901234567890123}
  valid-duration: ${JWT_VALID_DURATION:86400}
  refreshable-duration: ${JWT_REFRESHABLE_DURATION:604800}
```

Lưu ý:

- `signer-key` mặc định chỉ dùng để học/dev.
- Khi làm thật hoặc deploy cần đổi qua biến môi trường `JWT_SIGNER_KEY`.
- `valid-duration` là thời hạn access token, mặc định 86400 giây.
- `refreshable-duration` là thời hạn refresh token, mặc định 604800 giây.

## Cấu hình test

Đã thêm file:

```text
src/test/resources/application.yaml
```

Test dùng H2 in-memory để không phụ thuộc MySQL local:

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:cineve_test;MODE=MySQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
```

## File đã tạo/sửa ở Giai đoạn 1

File sửa:

- `pom.xml`
- `src/main/resources/application.yaml`

File thêm:

- `src/main/java/com/duynam/cinema/configuration/ApplicationInitConfig.java`
- `src/main/java/com/duynam/cinema/configuration/BootstrapAdminProperties.java`
- `src/main/java/com/duynam/cinema/configuration/CorsProperties.java`
- `src/main/java/com/duynam/cinema/configuration/JwtAuthenticationEntryPoint.java`
- `src/main/java/com/duynam/cinema/configuration/JwtProperties.java`
- `src/main/java/com/duynam/cinema/configuration/SecurityConfig.java`
- `src/main/java/com/duynam/cinema/constant/PredefinedRole.java`
- `src/main/java/com/duynam/cinema/constant/UserStatus.java`
- `src/main/java/com/duynam/cinema/controller/AuthenticationController.java`
- `src/main/java/com/duynam/cinema/dto/request/AuthenticationRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/ChangePasswordRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/RegisterRequest.java`
- `src/main/java/com/duynam/cinema/dto/response/ApiResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/AuthenticationResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/RoleResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/UserResponse.java`
- `src/main/java/com/duynam/cinema/entity/Role.java`
- `src/main/java/com/duynam/cinema/entity/User.java`
- `src/main/java/com/duynam/cinema/exception/AppException.java`
- `src/main/java/com/duynam/cinema/exception/ErrorCode.java`
- `src/main/java/com/duynam/cinema/exception/GlobalExceptionHandler.java`
- `src/main/java/com/duynam/cinema/mapper/UserMapper.java`
- `src/main/java/com/duynam/cinema/repository/RoleRepository.java`
- `src/main/java/com/duynam/cinema/repository/UserRepository.java`
- `src/main/java/com/duynam/cinema/service/AuthenticationService.java`
- `src/main/java/com/duynam/cinema/service/UserService.java`
- `src/test/resources/application.yaml`

## Cách test đã dùng

Command đã chạy thành công:

```bash
mvn.cmd test -q
```

Kết quả:

- Test pass.
- Context Spring Boot start được với H2.
- JPA repository scan được `UserRepository`, `RoleRepository`, `AuthTokenRepository`, `RefreshTokenRepository`, `InvalidatedTokenRepository`.
- Security/JWT config load được.

Lưu ý môi trường:

- Gọi trực tiếp `.\mvnw.cmd test` đang lỗi Maven wrapper trên PowerShell.
- Máy có Maven cài sẵn tại `C:\dev\apache-maven-3.9.9\bin\mvn.cmd`.
- Vì vậy hiện tại dùng `mvn.cmd` để build/test.

## Cách chạy backend với MySQL

Tạo database:

```sql
CREATE DATABASE cineve CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Chạy app:

```bash
mvn.cmd spring-boot:run
```

Swagger:

```text
http://localhost:8080/swagger-ui.html
```

## Body test API

Luồng test authentication khuyến nghị:

1. Đăng ký.
2. Lấy `verificationOtp` trong response.
3. Thử đăng nhập trước khi xác thực để kiểm tra lỗi `ACCOUNT_NOT_VERIFIED`.
4. Xác thực email bằng OTP.
5. Đăng nhập lại để lấy `token` và `refreshToken`.
6. Gọi `/api/auth/me`.
7. Refresh token.
8. Đổi mật khẩu.
9. Test quên mật khẩu và reset mật khẩu.
10. Đăng xuất và kiểm tra access token cũ không dùng lại được.

Đăng ký:

```http
POST http://localhost:8080/api/auth/register
```

```json
{
  "fullName": "Nguyễn Văn A",
  "email": "vana@gmail.com",
  "phone": "0912345678",
  "password": "123456"
}
```

Response đăng ký sẽ trả `verificationOtp` để test:

```json
{
  "user": {
    "email": "vana@gmail.com",
    "status": "PENDING_VERIFICATION"
  },
  "verificationOtp": "123456"
}
```

Xác thực email:

```http
POST http://localhost:8080/api/auth/verify-email
```

```json
{
  "email": "vana@gmail.com",
  "otp": "OTP_LAY_TU_RESPONSE_DANG_KY"
}
```

Gửi lại OTP xác thực email:

```http
POST http://localhost:8080/api/auth/resend-verification
```

```json
{
  "email": "vana@gmail.com"
}
```

Đăng nhập:

```http
POST http://localhost:8080/api/auth/login
```

```json
{
  "email": "vana@gmail.com",
  "password": "123456"
}
```

Response đăng nhập trả `token` và `refreshToken`.

Refresh token:

```http
POST http://localhost:8080/api/auth/refresh-token
```

```json
{
  "refreshToken": "REFRESH_TOKEN"
}
```

Lấy thông tin user:

```http
GET http://localhost:8080/api/auth/me
Authorization: Bearer <token>
```

Đổi mật khẩu:

```http
PUT http://localhost:8080/api/auth/change-password
Authorization: Bearer <token>
```

```json
{
  "currentPassword": "123456",
  "newPassword": "1234567"
}
```

Quên mật khẩu:

```http
POST http://localhost:8080/api/auth/forgot-password
```

```json
{
  "email": "vana@gmail.com"
}
```

Response trả `resetToken` và `otp` để test.

Đặt lại mật khẩu:

```http
POST http://localhost:8080/api/auth/reset-password
```

```json
{
  "resetToken": "RESET_TOKEN",
  "newPassword": "12345678"
}
```

Đăng xuất:

```http
POST http://localhost:8080/api/auth/logout
Authorization: Bearer <token>
```

```json
{
  "refreshToken": "REFRESH_TOKEN"
}
```

Sau khi logout:

- Dùng lại access token cũ gọi `/api/auth/me` sẽ bị từ chối.
- Dùng lại refresh token cũ gọi `/api/auth/refresh-token` sẽ bị từ chối.

## File đã tạo/sửa khi mở rộng authentication

File sửa:

- `src/main/resources/application.yaml`
- `src/main/java/com/duynam/cinema/configuration/JwtProperties.java`
- `src/main/java/com/duynam/cinema/configuration/SecurityConfig.java`
- `src/main/java/com/duynam/cinema/constant/UserStatus.java`
- `src/main/java/com/duynam/cinema/controller/AuthenticationController.java`
- `src/main/java/com/duynam/cinema/dto/response/AuthenticationResponse.java`
- `src/main/java/com/duynam/cinema/exception/ErrorCode.java`
- `src/main/java/com/duynam/cinema/service/AuthenticationService.java`
- `src/main/java/com/duynam/cinema/service/UserService.java`

File thêm:

- `src/main/java/com/duynam/cinema/constant/AuthTokenType.java`
- `src/main/java/com/duynam/cinema/entity/AuthToken.java`
- `src/main/java/com/duynam/cinema/entity/InvalidatedToken.java`
- `src/main/java/com/duynam/cinema/entity/RefreshToken.java`
- `src/main/java/com/duynam/cinema/repository/AuthTokenRepository.java`
- `src/main/java/com/duynam/cinema/repository/InvalidatedTokenRepository.java`
- `src/main/java/com/duynam/cinema/repository/RefreshTokenRepository.java`
- `src/main/java/com/duynam/cinema/dto/request/ForgotPasswordRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/LogoutRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/RefreshTokenRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/ResendEmailVerificationRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/ResetPasswordRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/VerifyEmailRequest.java`
- `src/main/java/com/duynam/cinema/dto/response/EmailVerificationResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/ForgotPasswordResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/RegisterResponse.java`

## Giai đoạn 2 đã hoàn thành

Đã triển khai backend module phim và thể loại:

- Tạo enum trạng thái phim: `COMING_SOON`, `NOW_SHOWING`, `ENDED`, `HIDDEN`.
- Tạo entity `Genre`, `Movie`.
- Tạo repository cho phim và thể loại.
- Tạo DTO request/response.
- Tạo mapper.
- Tạo service xử lý public và admin.
- Tạo API public xem danh sách, chi tiết, tìm kiếm, lọc phim.
- Tạo API public xem danh sách và chi tiết thể loại.
- Tạo API admin thêm/sửa/ẩn phim.
- Tạo API admin thêm/sửa/ẩn thể loại.
- Tạo API public xem trailer phim.
- Tạo API admin upload poster phim local.
- Cấu hình public static resource `/uploads/**` để frontend/browser xem poster đã upload.

## Logic phim và thể loại hiện tại

Thể loại:

- Entity `Genre` có các field chính: `id`, `name`, `slug`, `description`, `active`, `createdAt`, `updatedAt`.
- Public API chỉ trả thể loại có `active = true`.
- Admin API xem được cả thể loại đang active và đã ẩn.
- Khi ẩn thể loại, backend không xóa cứng mà set `active = false`.
- Muốn hiện lại thể loại đã ẩn thì gọi `PUT /api/admin/genres/{id}` để cập nhật, service sẽ set lại `active = true`.

Phim:

- Entity `Movie` có các field chính:
  - `id`
  - `title`
  - `slug`
  - `description`
  - `durationMinutes`
  - `director`
  - `actors`
  - `language`
  - `country`
  - `ageRating`
  - `releaseDate`
  - `posterUrl`
  - `trailerUrl`
  - `status`
  - `genres`
  - `createdAt`
  - `updatedAt`
- Public API chỉ ẩn phim có `status = HIDDEN`.
- Các trạng thái `NOW_SHOWING`, `COMING_SOON`, `ENDED` đều được xem là đang hiển thị ở public API.
- Khi gọi API ẩn phim, backend set `status = HIDDEN`.
- Muốn hiện lại phim đã ẩn thì gọi:

```http
PATCH /api/admin/movies/{movieId}/status?status=NOW_SHOWING
```

hoặc đổi sang:

```text
COMING_SOON
ENDED
```

Trailer:

- Hiện tại trailer được lưu bằng field `trailerUrl`.
- API chi tiết phim cũng trả `trailerUrl`.
- Đã thêm API riêng để frontend lấy trailer rõ ràng hơn:

```http
GET /api/movies/{id}/trailer
```

- Nếu phim chưa có trailer, backend trả lỗi `MOVIE_TRAILER_NOT_FOUND`.

Poster:

- Khi tạo/sửa phim, admin vẫn có thể truyền `posterUrl` thủ công.
- Đã thêm upload poster thật ở mức local dev:

```http
POST /api/admin/movies/{id}/poster
```

- Request dùng `multipart/form-data`, field file tên là `file`.
- File upload được lưu vào:

```text
uploads/posters/
```

- Sau upload, `posterUrl` được cập nhật dạng:

```text
/uploads/posters/<ten-file>
```

- Browser/frontend có thể xem ảnh qua:

```text
http://localhost:8080/uploads/posters/<ten-file>
```

Lưu ý:

- Upload poster hiện tại chỉ lưu local, phù hợp giai đoạn học tập/dev.
- Khi deploy thật có thể đổi sang Cloudinary, S3 hoặc Firebase Storage.
- Chưa triển khai đánh giá phim vì nghiệp vụ đúng cần module booking/ticket để kiểm tra user đã đặt vé phim đó hay chưa.

## API phim và thể loại đã có

Public API:

```text
GET /api/genres
GET /api/genres/{id}
GET /api/movies
GET /api/movies?keyword=&genreId=&status=&language=&country=
GET /api/movies/now-showing
GET /api/movies/coming-soon
GET /api/movies/{id}
GET /api/movies/{id}/trailer
GET /uploads/**
```

Admin API:

```text
GET    /api/admin/genres
POST   /api/admin/genres
PUT    /api/admin/genres/{id}
DELETE /api/admin/genres/{id}

GET    /api/admin/movies
GET    /api/admin/movies/{id}
POST   /api/admin/movies
PUT    /api/admin/movies/{id}
PATCH  /api/admin/movies/{id}/status?status=NOW_SHOWING
POST   /api/admin/movies/{id}/poster
DELETE /api/admin/movies/{id}
```

Admin API cần header:

```text
Authorization: Bearer <admin_token>
```

## Body test API giai đoạn 2

Tạo thể loại:

```http
POST http://localhost:8080/api/admin/genres
Authorization: Bearer <admin_token>
```

```json
{
  "name": "Hành động",
  "description": "Phim hành động, kịch tính"
}
```

Cập nhật thể loại:

```http
PUT http://localhost:8080/api/admin/genres/{genreId}
Authorization: Bearer <admin_token>
```

```json
{
  "name": "Hành động",
  "description": "Phim hành động tốc độ cao"
}
```

Ẩn thể loại:

```http
DELETE http://localhost:8080/api/admin/genres/{genreId}
Authorization: Bearer <admin_token>
```

Hiện lại thể loại:

```http
PUT http://localhost:8080/api/admin/genres/{genreId}
Authorization: Bearer <admin_token>
```

```json
{
  "name": "Hành động",
  "description": "Phim hành động, kịch tính"
}
```

Tạo phim:

```http
POST http://localhost:8080/api/admin/movies
Authorization: Bearer <admin_token>
```

```json
{
  "title": "Lật Mặt 9",
  "description": "Một bộ phim hành động Việt Nam.",
  "durationMinutes": 120,
  "director": "Lý Hải",
  "actors": "Diễn viên A, Diễn viên B",
  "language": "Tiếng Việt",
  "country": "Việt Nam",
  "ageRating": "T13",
  "releaseDate": "2026-06-10",
  "posterUrl": "https://example.com/poster.jpg",
  "trailerUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "status": "NOW_SHOWING",
  "genreIds": ["GENRE_ID"]
}
```

Cập nhật trạng thái phim:

```http
PATCH http://localhost:8080/api/admin/movies/{movieId}/status?status=HIDDEN
Authorization: Bearer <admin_token>
```

Hiện lại phim đã ẩn:

```http
PATCH http://localhost:8080/api/admin/movies/{movieId}/status?status=NOW_SHOWING
Authorization: Bearer <admin_token>
```

Lấy trailer phim:

```http
GET http://localhost:8080/api/movies/{movieId}/trailer
```

Upload poster bằng Postman:

- Method: `POST`
- URL: `http://localhost:8080/api/admin/movies/{movieId}/poster`
- Header: `Authorization: Bearer <admin_token>`
- Body: `form-data`
- Key: `file`
- Type: `File`
- Chọn ảnh `.jpg`, `.png`, `.webp`

## File đã tạo/sửa ở Giai đoạn 2

File sửa:

- `src/main/java/com/duynam/cinema/configuration/SecurityConfig.java`
- `src/main/java/com/duynam/cinema/exception/ErrorCode.java`

File thêm:

- `src/main/java/com/duynam/cinema/configuration/WebMvcConfig.java`
- `src/main/java/com/duynam/cinema/constant/MovieStatus.java`
- `src/main/java/com/duynam/cinema/controller/AdminGenreController.java`
- `src/main/java/com/duynam/cinema/controller/AdminMovieController.java`
- `src/main/java/com/duynam/cinema/controller/GenreController.java`
- `src/main/java/com/duynam/cinema/controller/MovieController.java`
- `src/main/java/com/duynam/cinema/dto/request/GenreRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/MovieRequest.java`
- `src/main/java/com/duynam/cinema/dto/response/GenreResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/MovieResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/MovieTrailerResponse.java`
- `src/main/java/com/duynam/cinema/entity/Genre.java`
- `src/main/java/com/duynam/cinema/entity/Movie.java`
- `src/main/java/com/duynam/cinema/mapper/GenreMapper.java`
- `src/main/java/com/duynam/cinema/mapper/MovieMapper.java`
- `src/main/java/com/duynam/cinema/repository/GenreRepository.java`
- `src/main/java/com/duynam/cinema/repository/MovieRepository.java`
- `src/main/java/com/duynam/cinema/service/GenreService.java`
- `src/main/java/com/duynam/cinema/service/MovieService.java`

## Cách test đã dùng sau Giai đoạn 2

Command đã chạy thành công:

```bash
mvn.cmd test -q
```

Kết quả:

- Test pass.
- Spring Boot context start được với H2.
- JPA repository scan được 7 repository:
  - `UserRepository`
  - `RoleRepository`
  - `AuthTokenRepository`
  - `RefreshTokenRepository`
  - `InvalidatedTokenRepository`
  - `GenreRepository`
  - `MovieRepository`
- Static resource `/uploads/**` load được.

## Giai đoạn tiếp theo

Theo `AGENT.md`, sau Giai đoạn 2 sẽ làm Giai đoạn 3:

- Module rạp.
- Module phòng chiếu.
- Module ghế.
- Chức năng tạo ghế tự động.

Đề xuất thứ tự Giai đoạn 3:

1. Tạo enum trạng thái rạp/phòng/ghế.
2. Tạo entity `Cinema`, `Room`, `Seat`.
3. Tạo repository.
4. Tạo DTO request/response.
5. Tạo mapper.
6. Tạo service public xem danh sách rạp.
7. Tạo service admin quản lý rạp/phòng.
8. Tạo logic admin tạo ghế tự động theo số hàng và số cột.
9. Tạo controller public `/api/cinemas`.
10. Tạo controller admin `/api/admin/cinemas`, `/api/admin/rooms`, `/api/admin/seats`.
11. Thêm validate và test build.
## Giai đoạn 3 đã hoàn thành

Đã triển khai backend module rạp, phòng chiếu và ghế:

- Tạo enum trạng thái rạp: `ACTIVE`, `HIDDEN`.
- Tạo enum loại phòng: `TWO_D`, `THREE_D`, `IMAX`, `VIP`.
- Tạo enum trạng thái phòng: `ACTIVE`, `MAINTENANCE`, `DISABLED`.
- Tạo enum loại ghế: `NORMAL`, `VIP`, `COUPLE`.
- Tạo enum trạng thái ghế: `ACTIVE`, `MAINTENANCE`, `DISABLED`.
- Tạo entity `Cinema`, `Room`, `Seat`.
- Tạo repository cho rạp, phòng chiếu và ghế.
- Tạo DTO request/response.
- Tạo mapper.
- Tạo service public xem danh sách/chi tiết rạp.
- Tạo service admin quản lý rạp, phòng chiếu, ghế.
- Tạo API admin tạo ghế tự động theo số hàng và số cột của phòng.
- Cấu hình public endpoint `/api/cinemas/**`.

## Logic rạp, phòng chiếu và ghế hiện tại

Rạp:

- Entity `Cinema` có các field chính: `id`, `name`, `slug`, `address`, `city`, `phone`, `email`, `description`, `status`, `createdAt`, `updatedAt`.
- Public API chỉ trả rạp có `status = ACTIVE`.
- Admin API xem được cả rạp `ACTIVE` và `HIDDEN`.
- Khi xóa rạp, backend không xóa cứng mà set `status = HIDDEN`.
- Muốn hiện lại rạp đã ẩn thì gọi:

```http
PATCH /api/admin/cinemas/{cinemaId}/status?status=ACTIVE
```

Phòng chiếu:

- Entity `Room` có các field chính: `id`, `cinema`, `name`, `rowCount`, `columnCount`, `type`, `status`, `createdAt`, `updatedAt`.
- Một rạp không được có hai phòng trùng tên.
- Khi xóa phòng, backend không xóa cứng mà set `status = DISABLED`.
- Muốn mở lại phòng thì gọi:

```http
PATCH /api/admin/rooms/{roomId}/status?status=ACTIVE
```

Ghế:

- Entity `Seat` có các field chính: `id`, `room`, `code`, `rowName`, `columnNumber`, `type`, `status`, `createdAt`, `updatedAt`.
- Mã ghế dạng `A1`, `A2`, `B1`, `B2`.
- Một phòng không được có hai ghế trùng mã.
- Khi tạo ghế thủ công, backend kiểm tra vị trí ghế không vượt quá `rowCount` và `columnCount` của phòng.
- Khi ẩn ghế, backend không xóa cứng mà set `status = DISABLED`.

Tạo ghế tự động:

- Gọi API:

```http
POST /api/admin/rooms/{roomId}/seats/generate
```

- Backend xóa layout ghế cũ của phòng và sinh lại toàn bộ ghế theo `rowCount` và `columnCount`.
- Hàng ghế sinh từ `A` đến tối đa `Z`.
- Phòng loại `VIP` sinh toàn bộ ghế loại `VIP`.
- Phòng thường sinh nửa đầu là `NORMAL`, nửa sau là `VIP`, hàng cuối là `COUPLE` nếu phòng có từ 2 cột trở lên.

## API rạp, phòng chiếu và ghế đã có

Public API:

```text
GET /api/cinemas
GET /api/cinemas?city=
GET /api/cinemas/{id}
```

Admin API:

```text
GET    /api/admin/cinemas
GET    /api/admin/cinemas/{id}
POST   /api/admin/cinemas
PUT    /api/admin/cinemas/{id}
PATCH  /api/admin/cinemas/{id}/status?status=ACTIVE
DELETE /api/admin/cinemas/{id}

GET    /api/admin/rooms
GET    /api/admin/rooms?cinemaId=
GET    /api/admin/rooms/{id}
POST   /api/admin/rooms
PUT    /api/admin/rooms/{id}
PATCH  /api/admin/rooms/{id}/status?status=ACTIVE
POST   /api/admin/rooms/{id}/seats/generate
DELETE /api/admin/rooms/{id}

GET    /api/admin/seats?roomId=
POST   /api/admin/seats
PUT    /api/admin/seats/{id}
PATCH  /api/admin/seats/{id}/status?status=ACTIVE
DELETE /api/admin/seats/{id}
```

Admin API cần header:

```text
Authorization: Bearer <admin_token>
```

## Body test API giai đoạn 3

Tạo rạp:

```http
POST http://localhost:8080/api/admin/cinemas
Authorization: Bearer <admin_token>
```

```json
{
  "name": "CineVe Nguyễn Trãi",
  "address": "123 Nguyễn Trãi, Quận 1",
  "city": "TP. Hồ Chí Minh",
  "phone": "0912345678",
  "email": "nguyentrai@cineve.vn",
  "description": "Rạp CineVe trung tâm thành phố",
  "status": "ACTIVE"
}
```

Tạo phòng chiếu:

```http
POST http://localhost:8080/api/admin/rooms
Authorization: Bearer <admin_token>
```

```json
{
  "cinemaId": "CINEMA_ID",
  "name": "Phòng 01",
  "rowCount": 8,
  "columnCount": 12,
  "type": "TWO_D",
  "status": "ACTIVE"
}
```

Tạo ghế tự động:

```http
POST http://localhost:8080/api/admin/rooms/{roomId}/seats/generate
Authorization: Bearer <admin_token>
```

Xem ghế theo phòng:

```http
GET http://localhost:8080/api/admin/seats?roomId={roomId}
Authorization: Bearer <admin_token>
```

Cập nhật ghế thủ công:

```http
PUT http://localhost:8080/api/admin/seats/{seatId}
Authorization: Bearer <admin_token>
```

```json
{
  "roomId": "ROOM_ID",
  "rowName": "A",
  "columnNumber": 1,
  "type": "VIP",
  "status": "ACTIVE"
}
```

## File đã tạo/sửa ở Giai đoạn 3

File sửa:

- `src/main/java/com/duynam/cinema/configuration/SecurityConfig.java`
- `src/main/java/com/duynam/cinema/exception/ErrorCode.java`
- `NGUCANH.md`

File thêm:

- `src/main/java/com/duynam/cinema/constant/CinemaStatus.java`
- `src/main/java/com/duynam/cinema/constant/RoomStatus.java`
- `src/main/java/com/duynam/cinema/constant/RoomType.java`
- `src/main/java/com/duynam/cinema/constant/SeatStatus.java`
- `src/main/java/com/duynam/cinema/constant/SeatType.java`
- `src/main/java/com/duynam/cinema/controller/AdminCinemaController.java`
- `src/main/java/com/duynam/cinema/controller/AdminRoomController.java`
- `src/main/java/com/duynam/cinema/controller/AdminSeatController.java`
- `src/main/java/com/duynam/cinema/controller/CinemaController.java`
- `src/main/java/com/duynam/cinema/dto/request/CinemaRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/RoomRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/SeatRequest.java`
- `src/main/java/com/duynam/cinema/dto/response/CinemaResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/RoomResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/SeatResponse.java`
- `src/main/java/com/duynam/cinema/entity/Cinema.java`
- `src/main/java/com/duynam/cinema/entity/Room.java`
- `src/main/java/com/duynam/cinema/entity/Seat.java`
- `src/main/java/com/duynam/cinema/mapper/CinemaMapper.java`
- `src/main/java/com/duynam/cinema/mapper/RoomMapper.java`
- `src/main/java/com/duynam/cinema/mapper/SeatMapper.java`
- `src/main/java/com/duynam/cinema/repository/CinemaRepository.java`
- `src/main/java/com/duynam/cinema/repository/RoomRepository.java`
- `src/main/java/com/duynam/cinema/repository/SeatRepository.java`
- `src/main/java/com/duynam/cinema/service/CinemaService.java`
- `src/main/java/com/duynam/cinema/service/RoomService.java`
- `src/main/java/com/duynam/cinema/service/SeatService.java`

## Cách test đã dùng sau Giai đoạn 3

Command đã chạy thành công:

```bash
mvn.cmd test -q
```

Kết quả:

- Test pass.
- Spring Boot context start được với H2.
- JPA repository scan được 10 repository: `UserRepository`, `RoleRepository`, `AuthTokenRepository`, `RefreshTokenRepository`, `InvalidatedTokenRepository`, `GenreRepository`, `MovieRepository`, `CinemaRepository`, `RoomRepository`, `SeatRepository`.

## Giai đoạn tiếp theo

Sau Giai đoạn 3 sẽ làm Giai đoạn 4:

- Module suất chiếu.
- Kiểm tra trùng thời gian chiếu trong cùng một phòng.
- API lấy ghế theo suất chiếu, có trạng thái ghế đã đặt/còn trống theo booking.
## Giai đoạn 3 theo AGENT.md mới đã hoàn thành

Đã triển khai backend module quản lý người dùng:

- User xem thông tin cá nhân qua `/api/users/me`.
- User cập nhật thông tin cá nhân qua `/api/users/me`.
- Admin xem danh sách người dùng.
- Admin tìm kiếm người dùng theo `keyword`.
- Admin lọc người dùng theo `status` và `role`.
- Admin xem chi tiết người dùng.
- Admin khóa tài khoản.
- Admin mở khóa tài khoản.
- Admin vô hiệu hóa tài khoản.

Lưu ý:

- Các API auth cũ vẫn giữ nguyên, gồm `GET /api/auth/me` và `PUT /api/auth/change-password`.
- API `/api/users/me` là endpoint profile đúng theo giai đoạn 3 mới.
- Khóa tài khoản và vô hiệu hóa tài khoản hiện đều set `status = DISABLED`.
- Mở khóa tài khoản set `status = ACTIVE`.
- Chưa cho admin sửa role user ở giai đoạn này vì AGENT.md giai đoạn 3 chỉ yêu cầu tìm/lọc theo role, khóa/mở khóa/vô hiệu hóa.

## API quản lý người dùng đã có

User API:

```text
GET /api/users/me
PUT /api/users/me
```

Admin API:

```text
GET    /api/admin/users
GET    /api/admin/users?keyword=&status=&role=
GET    /api/admin/users/{id}
PUT    /api/admin/users/{id}/lock
PUT    /api/admin/users/{id}/unlock
DELETE /api/admin/users/{id}
```

Các API này cần header:

```text
Authorization: Bearer <token>
```

Riêng `/api/admin/users/**` cần token role `ADMIN`.

## Body test API quản lý người dùng

Lấy thông tin cá nhân:

```http
GET http://localhost:8080/api/users/me
Authorization: Bearer <user_token>
```

Cập nhật thông tin cá nhân:

```http
PUT http://localhost:8080/api/users/me
Authorization: Bearer <user_token>
```

```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0912345678"
}
```

Admin xem danh sách người dùng:

```http
GET http://localhost:8080/api/admin/users
Authorization: Bearer <admin_token>
```

Admin tìm kiếm người dùng:

```http
GET http://localhost:8080/api/admin/users?keyword=vana
Authorization: Bearer <admin_token>
```

Admin lọc theo trạng thái:

```http
GET http://localhost:8080/api/admin/users?status=ACTIVE
Authorization: Bearer <admin_token>
```

Trạng thái hợp lệ:

```text
PENDING_VERIFICATION
ACTIVE
DISABLED
```

Admin lọc theo role:

```http
GET http://localhost:8080/api/admin/users?role=USER
Authorization: Bearer <admin_token>
```

Role hợp lệ hiện tại:

```text
USER
ADMIN
```

Admin xem chi tiết người dùng:

```http
GET http://localhost:8080/api/admin/users/{userId}
Authorization: Bearer <admin_token>
```

Admin khóa tài khoản:

```http
PUT http://localhost:8080/api/admin/users/{userId}/lock
Authorization: Bearer <admin_token>
```

Admin mở khóa tài khoản:

```http
PUT http://localhost:8080/api/admin/users/{userId}/unlock
Authorization: Bearer <admin_token>
```

Admin vô hiệu hóa tài khoản:

```http
DELETE http://localhost:8080/api/admin/users/{userId}
Authorization: Bearer <admin_token>
```

## File đã tạo/sửa ở giai đoạn 3 theo AGENT.md mới

File thêm:

- `src/main/java/com/duynam/cinema/controller/UserController.java`
- `src/main/java/com/duynam/cinema/controller/AdminUserController.java`
- `src/main/java/com/duynam/cinema/dto/request/UserUpdateRequest.java`

File sửa:

- `src/main/java/com/duynam/cinema/repository/UserRepository.java`
- `src/main/java/com/duynam/cinema/service/UserService.java`
- `NGUCANH.md`

## Cách test đã dùng sau khi hoàn thiện giai đoạn 3 mới

Command đã chạy thành công:

```bash
mvn.cmd test -q
```

Kết quả:

- Test pass.
- Spring Boot context start được với H2.
- Query tìm/lọc user trong `UserRepository` load được.
- JPA repository scan được 10 repository.
