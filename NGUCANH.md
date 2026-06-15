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
## Giai đoạn 6 theo AGENT.md mới đã hoàn thành

Đã triển khai backend module quản lý suất chiếu:

- Tạo enum trạng thái suất chiếu: `OPEN`, `CLOSED`, `CANCELLED`, `FINISHED`.
- Tạo enum trạng thái ghế theo suất chiếu: `AVAILABLE`, `MAINTENANCE`, `DISABLED`, `BOOKED`.
- Tạo entity `Showtime`.
- Tạo repository cho suất chiếu.
- Tạo DTO request/response.
- Tạo mapper.
- Tạo service public xem/lọc lịch chiếu.
- Tạo service admin quản lý suất chiếu.
- Tạo API public xem lịch chiếu theo phim, rạp, ngày.
- Tạo API public xem sơ đồ ghế theo suất chiếu.
- Tạo API admin thêm/sửa/hủy suất chiếu.
- Tạo API admin lọc suất chiếu theo phim, rạp, ngày, phòng.
- Cấu hình public endpoint `/api/showtimes/**`.

## Logic suất chiếu hiện tại

Suất chiếu:

- Entity `Showtime` có các field chính: `id`, `movie`, `room`, `startTime`, `endTime`, `normalSeatPrice`, `vipSeatPrice`, `coupleSeatPrice`, `status`, `createdAt`, `updatedAt`.
- Public API không trả suất chiếu có `status = CANCELLED`.
- Admin API xem được tất cả suất chiếu.
- Khi xóa suất chiếu, backend không xóa cứng mà set `status = CANCELLED`.
- Khi tạo/cập nhật suất chiếu, backend kiểm tra:
  - Phim không bị ẩn.
  - Phòng chiếu đang `ACTIVE`.
  - Rạp của phòng chiếu đang `ACTIVE`.
  - `endTime` phải sau `startTime`.
  - Không có suất chiếu khác trùng thời gian trong cùng phòng.
- Điều kiện trùng thời gian: suất chiếu cũ có `startTime < endTime mới` và `endTime > startTime mới`.
- Suất chiếu đã `CANCELLED` không được tính khi kiểm tra trùng lịch.

Sơ đồ ghế theo suất chiếu:

- API hiện trả toàn bộ ghế thuộc phòng của suất chiếu.
- Ghế `ACTIVE` được trả trạng thái `AVAILABLE`.
- Ghế `MAINTENANCE` được trả trạng thái `MAINTENANCE`.
- Ghế `DISABLED` được trả trạng thái `DISABLED`.
- Trạng thái `BOOKED` đã chuẩn bị trong enum nhưng sẽ dùng thật sau giai đoạn đặt vé/booking.

## API suất chiếu đã có

Public API:

```text
GET /api/showtimes
GET /api/showtimes?movieId=&cinemaId=&roomId=&date=
GET /api/showtimes/{id}
GET /api/showtimes/{id}/seats
GET /api/movies/{movieId}/showtimes
GET /api/movies/{movieId}/showtimes?date=
GET /api/cinemas/{cinemaId}/showtimes
GET /api/cinemas/{cinemaId}/showtimes?date=
```

Admin API:

```text
GET    /api/admin/showtimes
GET    /api/admin/showtimes?movieId=&cinemaId=&roomId=&date=
GET    /api/admin/showtimes/{id}
POST   /api/admin/showtimes
PUT    /api/admin/showtimes/{id}
DELETE /api/admin/showtimes/{id}
```

Admin API cần header:

```text
Authorization: Bearer <admin_token>
```

## Body test API suất chiếu

Tạo suất chiếu:

```http
POST http://localhost:8080/api/admin/showtimes
Authorization: Bearer <admin_token>
```

```json
{
  "movieId": "MOVIE_ID",
  "roomId": "ROOM_ID",
  "startTime": "2026-06-10T19:00:00",
  "endTime": "2026-06-10T21:00:00",
  "normalSeatPrice": 70000,
  "vipSeatPrice": 90000,
  "coupleSeatPrice": 160000,
  "status": "OPEN"
}
```

Lọc suất chiếu public theo ngày:

```http
GET http://localhost:8080/api/showtimes?date=2026-06-10
```

Xem lịch chiếu theo phim:

```http
GET http://localhost:8080/api/movies/{movieId}/showtimes?date=2026-06-10
```

Xem lịch chiếu theo rạp:

```http
GET http://localhost:8080/api/cinemas/{cinemaId}/showtimes?date=2026-06-10
```

Xem ghế theo suất chiếu:

```http
GET http://localhost:8080/api/showtimes/{showtimeId}/seats
```

Cập nhật suất chiếu:

```http
PUT http://localhost:8080/api/admin/showtimes/{showtimeId}
Authorization: Bearer <admin_token>
```

```json
{
  "movieId": "MOVIE_ID",
  "roomId": "ROOM_ID",
  "startTime": "2026-06-10T20:00:00",
  "endTime": "2026-06-10T22:00:00",
  "normalSeatPrice": 75000,
  "vipSeatPrice": 95000,
  "coupleSeatPrice": 170000,
  "status": "OPEN"
}
```

Hủy suất chiếu:

```http
DELETE http://localhost:8080/api/admin/showtimes/{showtimeId}
Authorization: Bearer <admin_token>
```

## File đã tạo/sửa ở giai đoạn 6 theo AGENT.md mới

File thêm:

- `src/main/java/com/duynam/cinema/constant/ShowtimeStatus.java`
- `src/main/java/com/duynam/cinema/constant/ShowtimeSeatStatus.java`
- `src/main/java/com/duynam/cinema/entity/Showtime.java`
- `src/main/java/com/duynam/cinema/repository/ShowtimeRepository.java`
- `src/main/java/com/duynam/cinema/dto/request/ShowtimeRequest.java`
- `src/main/java/com/duynam/cinema/dto/response/ShowtimeResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/ShowtimeSeatResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/ShowtimeSeatMapResponse.java`
- `src/main/java/com/duynam/cinema/mapper/ShowtimeMapper.java`
- `src/main/java/com/duynam/cinema/service/ShowtimeService.java`
- `src/main/java/com/duynam/cinema/controller/ShowtimeController.java`
- `src/main/java/com/duynam/cinema/controller/AdminShowtimeController.java`

File sửa:

- `src/main/java/com/duynam/cinema/controller/MovieController.java`
- `src/main/java/com/duynam/cinema/controller/CinemaController.java`
- `src/main/java/com/duynam/cinema/configuration/SecurityConfig.java`
- `src/main/java/com/duynam/cinema/exception/ErrorCode.java`
- `NGUCANH.md`

## Cách test đã dùng sau khi hoàn thiện giai đoạn 6

Command đã chạy thành công:

```bash
mvn.cmd test -q
```

Kết quả:

- Test pass.
- Spring Boot context start được với H2.
- JPA repository scan được 11 repository, bao gồm `ShowtimeRepository`.
- Query lọc suất chiếu và query kiểm tra trùng lịch load được.

## Giai đoạn 7 theo AGENT.md mới đã hoàn thành

Đã triển khai backend module đồ ăn, nước uống và mã giảm giá:

- Tạo enum loại sản phẩm: `POPCORN`, `DRINK`, `COMBO`, `SNACK`.
- Tạo enum loại mã giảm giá: `PERCENT`, `FIXED_AMOUNT`.
- Tạo entity `Food`, `Coupon`.
- Tạo repository cho đồ ăn, nước uống và mã giảm giá.
- Tạo DTO request/response.
- Tạo mapper.
- Tạo service public xem đồ ăn, nước uống.
- Tạo service admin quản lý đồ ăn, nước uống.
- Tạo service admin quản lý mã giảm giá.
- Tạo API public áp dụng mã giảm giá để tính thử số tiền giảm.
- Tạo API admin upload ảnh đồ ăn, nước uống local.
- Cấu hình public endpoint `/api/foods/**` và `/api/coupons/apply`.

## Logic đồ ăn, nước uống và mã giảm giá hiện tại

Đồ ăn, nước uống:

- Entity `Food` có các field chính: `id`, `name`, `slug`, `description`, `type`, `price`, `imageUrl`, `active`, `createdAt`, `updatedAt`.
- Public API chỉ trả sản phẩm có `active = true`.
- Admin API xem được cả sản phẩm đang active và đã ẩn.
- Khi xóa sản phẩm, backend không xóa cứng mà set `active = false`.
- Muốn hiện lại sản phẩm đã ẩn thì gọi `PUT /api/admin/foods/{id}` với `active = true`.
- Upload ảnh sản phẩm lưu local vào thư mục `uploads/foods`, public qua `/uploads/foods/...`.

Mã giảm giá:

- Entity `Coupon` có các field chính: `id`, `code`, `name`, `description`, `type`, `discountValue`, `minOrderAmount`, `maxDiscountAmount`, `startTime`, `endTime`, `usageLimit`, `usedCount`, `active`, `createdAt`, `updatedAt`.
- `code` được chuẩn hóa thành chữ in hoa.
- Khi tạo/cập nhật mã giảm giá, backend kiểm tra:
  - `endTime` phải sau `startTime`.
  - Nếu type là `PERCENT`, `discountValue` không được vượt quá 100.
  - `usageLimit` không được nhỏ hơn `usedCount` khi cập nhật.
- Khi áp dụng mã giảm giá, backend kiểm tra:
  - Mã tồn tại.
  - Mã đang active.
  - Mã còn trong thời gian áp dụng.
  - Mã còn lượt dùng.
  - Tổng tiền đơn hàng đủ điều kiện tối thiểu.
- API `/api/coupons/apply` chỉ tính thử `discountAmount` và `finalAmount`, chưa tăng `usedCount`.
- `usedCount` sẽ nên tăng thật ở giai đoạn 8 khi tạo booking/thanh toán thành công.

## API đồ ăn, nước uống và mã giảm giá đã có

Public API:

```text
GET  /api/foods
GET  /api/foods?type=POPCORN
GET  /api/foods/{id}
POST /api/coupons/apply
```

Admin API:

```text
GET    /api/admin/foods
GET    /api/admin/foods/{id}
POST   /api/admin/foods
PUT    /api/admin/foods/{id}
POST   /api/admin/foods/{id}/image
DELETE /api/admin/foods/{id}

GET    /api/admin/coupons
GET    /api/admin/coupons/{id}
POST   /api/admin/coupons
PUT    /api/admin/coupons/{id}
DELETE /api/admin/coupons/{id}
```

Admin API cần header:

```text
Authorization: Bearer <admin_token>
```

## Body test API giai đoạn 7

Tạo đồ ăn, nước uống:

```http
POST http://localhost:8080/api/admin/foods
Authorization: Bearer <admin_token>
```

```json
{
  "name": "Combo bắp nước 1",
  "description": "1 bắp rang bơ lớn và 2 nước ngọt",
  "type": "COMBO",
  "price": 89000,
  "imageUrl": null,
  "active": true
}
```

Upload ảnh đồ ăn, nước uống:

- Method: `POST`
- URL: `http://localhost:8080/api/admin/foods/{foodId}/image`
- Header: `Authorization: Bearer <admin_token>`
- Body: `form-data`
- Key: `file`
- Type: `File`
- Chọn ảnh `.jpg`, `.png`, `.webp`

Xem danh sách đồ ăn, nước uống public:

```http
GET http://localhost:8080/api/foods
```

Lọc theo loại:

```http
GET http://localhost:8080/api/foods?type=COMBO
```

Ẩn đồ ăn, nước uống:

```http
DELETE http://localhost:8080/api/admin/foods/{foodId}
Authorization: Bearer <admin_token>
```

Tạo mã giảm theo phần trăm:

```http
POST http://localhost:8080/api/admin/coupons
Authorization: Bearer <admin_token>
```

```json
{
  "code": "CINEVE10",
  "name": "Giảm 10%",
  "description": "Giảm 10% tối đa 50000 cho đơn từ 100000",
  "type": "PERCENT",
  "discountValue": 10,
  "minOrderAmount": 100000,
  "maxDiscountAmount": 50000,
  "startTime": "2026-06-01T00:00:00",
  "endTime": "2026-12-31T23:59:59",
  "usageLimit": 100,
  "active": true
}
```

Tạo mã giảm số tiền cố định:

```json
{
  "code": "GIAM30000",
  "name": "Giảm 30000",
  "description": "Giảm 30000 cho đơn từ 150000",
  "type": "FIXED_AMOUNT",
  "discountValue": 30000,
  "minOrderAmount": 150000,
  "maxDiscountAmount": null,
  "startTime": "2026-06-01T00:00:00",
  "endTime": "2026-12-31T23:59:59",
  "usageLimit": 100,
  "active": true
}
```

Áp dụng mã giảm giá:

```http
POST http://localhost:8080/api/coupons/apply
```

```json
{
  "code": "CINEVE10",
  "orderAmount": 200000
}
```

Response trả `discountAmount` và `finalAmount` để frontend hiển thị.

Tắt mã giảm giá:

```http
DELETE http://localhost:8080/api/admin/coupons/{couponId}
Authorization: Bearer <admin_token>
```

## File đã tạo/sửa ở giai đoạn 7 theo AGENT.md mới

File thêm:

- `src/main/java/com/duynam/cinema/constant/FoodType.java`
- `src/main/java/com/duynam/cinema/constant/CouponType.java`
- `src/main/java/com/duynam/cinema/entity/Food.java`
- `src/main/java/com/duynam/cinema/entity/Coupon.java`
- `src/main/java/com/duynam/cinema/repository/FoodRepository.java`
- `src/main/java/com/duynam/cinema/repository/CouponRepository.java`
- `src/main/java/com/duynam/cinema/dto/request/FoodRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/CouponRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/ApplyCouponRequest.java`
- `src/main/java/com/duynam/cinema/dto/response/FoodResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/CouponResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/ApplyCouponResponse.java`
- `src/main/java/com/duynam/cinema/mapper/FoodMapper.java`
- `src/main/java/com/duynam/cinema/mapper/CouponMapper.java`
- `src/main/java/com/duynam/cinema/service/FoodService.java`
- `src/main/java/com/duynam/cinema/service/CouponService.java`
- `src/main/java/com/duynam/cinema/controller/FoodController.java`
- `src/main/java/com/duynam/cinema/controller/AdminFoodController.java`
- `src/main/java/com/duynam/cinema/controller/CouponController.java`
- `src/main/java/com/duynam/cinema/controller/AdminCouponController.java`

File sửa:

- `src/main/java/com/duynam/cinema/configuration/SecurityConfig.java`
- `src/main/java/com/duynam/cinema/exception/ErrorCode.java`
- `NGUCANH.md`

## Cách test đã dùng sau khi hoàn thiện giai đoạn 7

Command đã chạy thành công:

```bash
mvn.cmd test -q
```

Kết quả:

- Test pass.
- Spring Boot context start được với H2.
- JPA repository scan được 13 repository, bao gồm `FoodRepository` và `CouponRepository`.

## Giai đoạn 8 theo AGENT.md mới đã hoàn thành

Đã triển khai backend module đặt vé, thanh toán giả lập và vé:

- Tạo enum trạng thái booking: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `EXPIRED`.
- Tạo enum phương thức thanh toán: `CASH`, `MOMO`, `VNPAY`, `BANK_TRANSFER`, `BANK_CARD`.
- Tạo enum trạng thái thanh toán: `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`.
- Tạo enum trạng thái vé: `ACTIVE`, `USED`, `CANCELLED`, `EXPIRED`.
- Tạo entity `Booking`, `BookingSeat`, `BookingFood`, `Payment`, `Ticket`.
- Tạo repository, DTO request/response, mapper và service cho booking/payment/ticket.
- Tạo API user đặt vé, xem booking của tôi, xem chi tiết booking, xem vé theo booking, hủy vé.
- Tạo API user tạo thanh toán và giả lập thanh toán thành công/thất bại.
- Tạo API admin xem/lọc booking, xác nhận/hủy/hoàn tiền booking.
- Tạo API admin xem/lọc thanh toán, xem chi tiết thanh toán.
- Tạo API admin xem vé, xem chi tiết vé, đánh dấu vé đã sử dụng.
- Cập nhật API sơ đồ ghế theo suất chiếu để ghế đã được booking trả trạng thái `BOOKED`.

## Logic đặt vé, thanh toán và vé hiện tại

Đặt vé:

- User phải đăng nhập mới đặt vé được.
- Backend kiểm tra lại toàn bộ ghế trong transaction, không tin frontend.
- Khi đặt vé, backend kiểm tra:
  - Suất chiếu tồn tại và đang `OPEN`.
  - Suất chiếu phải còn ở tương lai.
  - Danh sách ghế không bị trùng.
  - Ghế thuộc đúng phòng của suất chiếu.
  - Ghế đang `ACTIVE`, không bảo trì hoặc bị khóa.
  - Ghế chưa thuộc booking đang giữ/chưa hủy trong cùng suất chiếu.
- Khi kiểm tra trùng ghế, backend chỉ xem các booking trạng thái `PENDING`, `CONFIRMED`, `COMPLETED` là đang giữ ghế.
- Booking `CANCELLED` hoặc `EXPIRED` không giữ ghế.
- Backend dùng pessimistic lock khi đọc danh sách ghế lúc đặt vé để giảm rủi ro đặt trùng.
- Backend tính tiền ghế theo loại ghế:
  - `NORMAL` dùng `normalSeatPrice`.
  - `VIP` dùng `vipSeatPrice`.
  - `COUPLE` dùng `coupleSeatPrice`.
- Backend tính tiền đồ ăn, nước uống theo số lượng và giá hiện tại của sản phẩm.
- Nếu có coupon, backend kiểm tra mã còn active, còn hạn, còn lượt dùng và đơn hàng đủ điều kiện.
- Nếu thanh toán giả lập thành công, booking chuyển `CONFIRMED`, payment chuyển `SUCCESS`, tạo ticket và tăng `usedCount` coupon.
- Nếu thanh toán giả lập thất bại, booking chuyển `EXPIRED`, payment chuyển `FAILED`, không tạo ticket và không giữ ghế.

Thanh toán:

- Payment có `transactionCode` giả lập.
- User xem được payment thuộc booking của chính mình.
- Admin xem được toàn bộ payment và lọc theo `status`, `method`.
- Admin hoàn tiền giả lập chuyển payment sang `REFUNDED`, booking sang `CANCELLED`, ticket sang `CANCELLED`.

Vé:

- Ticket được tạo khi thanh toán thành công.
- Ticket có `code` và `qrCode` giả lập dạng `QR-CINEVE:<ticketCode>:<bookingCode>`.
- User xem vé qua booking của chính mình.
- Admin xem danh sách vé, xem chi tiết vé.
- Admin đánh dấu vé đã sử dụng, ticket chuyển `USED`.

Hủy vé:

- User chỉ được hủy vé trước giờ chiếu ít nhất 2 giờ.
- Khi hủy, booking chuyển `CANCELLED`, ticket chuyển `CANCELLED`.
- Nếu payment đã `SUCCESS`, hệ thống chuyển payment sang `REFUNDED` giả lập.

## API đặt vé, thanh toán và vé đã có

User API:

```text
POST /api/bookings
GET  /api/bookings/my
GET  /api/bookings/{id}
GET  /api/bookings/{id}/ticket
PUT  /api/bookings/{id}/cancel

POST /api/payments/create
POST /api/payments/fake-success?paymentId=
POST /api/payments/fake-failed?paymentId=
GET  /api/payments/{id}
```

Admin API:

```text
GET /api/admin/bookings
GET /api/admin/bookings?keyword=&status=
GET /api/admin/bookings/{id}
PUT /api/admin/bookings/{id}/confirm
PUT /api/admin/bookings/{id}/cancel
PUT /api/admin/bookings/{id}/refund

GET /api/admin/payments
GET /api/admin/payments?status=&method=
GET /api/admin/payments/{id}

GET /api/admin/tickets
GET /api/admin/tickets/{id}
PUT /api/admin/tickets/{id}/used
```

Các API này cần header:

```text
Authorization: Bearer <token>
```

Riêng `/api/admin/**` cần role `ADMIN`.

## Body test API giai đoạn 8

Đặt vé:

```http
POST http://localhost:8080/api/bookings
Authorization: Bearer <user_token>
```

```json
{
  "showtimeId": "SHOWTIME_ID",
  "seatIds": ["SEAT_ID_1", "SEAT_ID_2"],
  "foods": [
    {
      "foodId": "FOOD_ID",
      "quantity": 2
    }
  ],
  "couponCode": "CINEVE10",
  "paymentMethod": "MOMO",
  "paymentSuccess": true
}
```

Xem booking của tôi:

```http
GET http://localhost:8080/api/bookings/my
Authorization: Bearer <user_token>
```

Xem vé theo booking:

```http
GET http://localhost:8080/api/bookings/{bookingId}/ticket
Authorization: Bearer <user_token>
```

Hủy vé:

```http
PUT http://localhost:8080/api/bookings/{bookingId}/cancel
Authorization: Bearer <user_token>
```

Giả lập thanh toán:

```http
POST http://localhost:8080/api/payments/fake-success?paymentId=PAYMENT_ID
Authorization: Bearer <user_token>
```

```http
POST http://localhost:8080/api/payments/fake-failed?paymentId=PAYMENT_ID
Authorization: Bearer <user_token>
```

Admin lọc booking:

```http
GET http://localhost:8080/api/admin/bookings?status=CONFIRMED
Authorization: Bearer <admin_token>
```

Admin lọc thanh toán:

```http
GET http://localhost:8080/api/admin/payments?status=SUCCESS&method=MOMO
Authorization: Bearer <admin_token>
```

Admin đánh dấu vé đã sử dụng:

```http
PUT http://localhost:8080/api/admin/tickets/{ticketId}/used
Authorization: Bearer <admin_token>
```

## File đã tạo/sửa ở giai đoạn 8 theo AGENT.md mới

File thêm:

- `src/main/java/com/duynam/cinema/constant/BookingStatus.java`
- `src/main/java/com/duynam/cinema/constant/PaymentMethod.java`
- `src/main/java/com/duynam/cinema/constant/PaymentStatus.java`
- `src/main/java/com/duynam/cinema/constant/TicketStatus.java`
- `src/main/java/com/duynam/cinema/entity/Booking.java`
- `src/main/java/com/duynam/cinema/entity/BookingSeat.java`
- `src/main/java/com/duynam/cinema/entity/BookingFood.java`
- `src/main/java/com/duynam/cinema/entity/Payment.java`
- `src/main/java/com/duynam/cinema/entity/Ticket.java`
- `src/main/java/com/duynam/cinema/repository/BookingRepository.java`
- `src/main/java/com/duynam/cinema/repository/BookingSeatRepository.java`
- `src/main/java/com/duynam/cinema/repository/BookingFoodRepository.java`
- `src/main/java/com/duynam/cinema/repository/PaymentRepository.java`
- `src/main/java/com/duynam/cinema/repository/TicketRepository.java`
- `src/main/java/com/duynam/cinema/dto/request/BookingRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/BookingFoodRequest.java`
- `src/main/java/com/duynam/cinema/dto/request/PaymentRequest.java`
- `src/main/java/com/duynam/cinema/dto/response/BookingResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/BookingSeatResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/BookingFoodResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/PaymentResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/TicketResponse.java`
- `src/main/java/com/duynam/cinema/mapper/BookingMapper.java`
- `src/main/java/com/duynam/cinema/service/BookingService.java`
- `src/main/java/com/duynam/cinema/controller/BookingController.java`
- `src/main/java/com/duynam/cinema/controller/AdminBookingController.java`
- `src/main/java/com/duynam/cinema/controller/PaymentController.java`
- `src/main/java/com/duynam/cinema/controller/AdminPaymentController.java`
- `src/main/java/com/duynam/cinema/controller/AdminTicketController.java`

File sửa:

- `src/main/java/com/duynam/cinema/repository/SeatRepository.java`
- `src/main/java/com/duynam/cinema/service/ShowtimeService.java`
- `src/main/java/com/duynam/cinema/exception/ErrorCode.java`
- `NGUCANH.md`

## Cách test đã dùng sau khi hoàn thiện giai đoạn 8

Command đã chạy thành công:

```bash
mvn.cmd test -q
```

Kết quả:

- Test pass.
- Spring Boot context start được với H2.
- JPA repository scan được 18 repository, bao gồm `BookingRepository`, `BookingSeatRepository`, `BookingFoodRepository`, `PaymentRepository`, `TicketRepository`.
- Query kiểm tra ghế đã booking, query lọc booking/payment và các quan hệ booking-payment-ticket load được.

Luồng test API thủ công gợi ý:

1. Đăng nhập user để lấy `user_token`.
2. Đăng nhập admin để lấy `admin_token`.
3. Gọi `GET /api/showtimes/{showtimeId}/seats` để lấy ghế `AVAILABLE`.
4. Gọi `POST /api/bookings` với `paymentSuccess = true` để tạo booking `CONFIRMED`, payment `SUCCESS` và ticket `ACTIVE`.
5. Gọi lại `GET /api/showtimes/{showtimeId}/seats` để kiểm tra ghế vừa đặt chuyển sang `BOOKED`.
6. Gọi lại `POST /api/bookings` với cùng ghế để kiểm tra lỗi `SEAT_ALREADY_BOOKED`.
7. Gọi `GET /api/bookings/my`, `GET /api/bookings/{id}` và `GET /api/bookings/{id}/ticket` để kiểm tra user chỉ xem được dữ liệu của mình.
8. Gọi `PUT /api/bookings/{id}/cancel` để kiểm tra hủy vé trước giờ chiếu ít nhất 2 giờ.
9. Gọi các API admin `/api/admin/bookings`, `/api/admin/payments`, `/api/admin/tickets` để kiểm tra lọc, xem chi tiết, hoàn tiền và đánh dấu vé đã sử dụng.

## Tiến độ hiện tại theo AGENT.md mới

Cập nhật lần cuối: 13/06/2026 sau khi hoàn thành Giai đoạn 9 - Đánh giá phim, phim yêu thích và thông báo.

Cập nhật đến hiện tại:

- Đã hoàn thành Giai đoạn 1: Setup nền tảng backend.
- Đã hoàn thành Giai đoạn 2: Authentication và phân quyền.
- Đã hoàn thành Giai đoạn 3: Quản lý người dùng.
- Đã hoàn thành Giai đoạn 4: Quản lý phim và thể loại phim.
- Đã hoàn thành Giai đoạn 5: Quản lý rạp, phòng chiếu và ghế.
- Đã hoàn thành Giai đoạn 6: Quản lý suất chiếu.
- Đã hoàn thành Giai đoạn 7: Đồ ăn, nước uống và mã giảm giá.
- Đã hoàn thành Giai đoạn 8: Đặt vé, thanh toán và vé.
- Đã hoàn thành Giai đoạn 9: Đánh giá phim, phim yêu thích và thông báo.
- Giai đoạn tiếp theo cần làm: Giai đoạn 10 - Dashboard Admin.

Các API đã có theo nhóm chính:

- Auth: đăng ký, đăng nhập, refresh token, logout, xác thực email, quên/reset mật khẩu, lấy thông tin đăng nhập, đổi mật khẩu.
- User: xem/cập nhật hồ sơ cá nhân, admin tìm kiếm/lọc/xem/khóa/mở khóa/vô hiệu hóa người dùng.
- Movie/Genre: public xem/tìm/lọc phim và thể loại, admin quản lý phim/thể loại, trailer, upload poster.
- Cinema/Room/Seat: public xem/lọc rạp, admin quản lý rạp/phòng/ghế, tạo ghế tự động.
- Showtime: public xem/lọc lịch chiếu, xem ghế theo suất chiếu, admin quản lý suất chiếu và kiểm tra trùng lịch.
- Food/Coupon: public xem đồ ăn, nước uống, áp dụng mã giảm giá; admin quản lý đồ ăn, nước uống và mã giảm giá.
- Booking/Payment/Ticket: user đặt vé, xem/hủy booking, xem vé, thanh toán giả lập; admin quản lý booking, payment, ticket.
- Review/Favorite/Notification: public xem đánh giá phim; user đánh giá phim khi đã đặt vé, quản lý phim yêu thích và thông báo; admin lọc, ẩn/hiện/xóa đánh giá.

Các phần chưa làm:

- Giai đoạn 10: Dashboard Admin.
- Giai đoạn 11: Frontend người dùng.
- Giai đoạn 12: Frontend Admin.
- Giai đoạn 13: Hoàn thiện, dữ liệu mẫu và deploy.

Ghi chú kỹ thuật hiện tại:

- Backend nằm tại `D:\cinema\cinema`.
- Chạy test bằng `mvn.cmd test -q`.
- Lần test gần nhất đã pass sau khi hoàn thiện đặt vé, thanh toán và vé.
- `GET /api/auth/me` vẫn giữ để kiểm tra token thuộc module auth.
- `GET /api/users/me` và `PUT /api/users/me` là API hồ sơ cá nhân thuộc module user.

## Giai đoạn 9 đã hoàn thành

Đã triển khai backend module đánh giá phim, phim yêu thích và thông báo:

- Tạo enum `NotificationType`.
- Tạo entity `Review`, `Favorite`, `Notification`.
- Tạo repository, DTO response/request, mapper, service và controller tương ứng.
- User xem đánh giá public của phim.
- User tạo/sửa/xóa đánh giá của mình.
- Backend kiểm tra user phải từng có booking `CONFIRMED` hoặc `COMPLETED` cho phim đó mới được đánh giá.
- Backend kiểm tra mỗi user chỉ được đánh giá một lần cho một phim.
- Admin xem/lọc đánh giá theo phim và số sao.
- Admin ẩn/hiện/xóa đánh giá.
- User thêm/xóa/xem danh sách phim yêu thích.
- User xem thông báo cá nhân, đánh dấu đã đọc, xóa thông báo.
- Backend tự tạo thông báo khi booking được xác nhận thành công.
- Backend tự tạo thông báo khi booking bị hủy hoặc hoàn tiền.
- Cập nhật security để các API public của phim/rạp/suất chiếu/đồ ăn chỉ public với method `GET`; `POST /api/movies/{movieId}/reviews` bắt buộc đăng nhập.

## API đánh giá, yêu thích và thông báo đã có

Public API:

```text
GET /api/movies/{movieId}/reviews
```

User API:

```text
POST   /api/movies/{movieId}/reviews
PUT    /api/reviews/{id}
DELETE /api/reviews/{id}

GET    /api/favorites
POST   /api/favorites/{movieId}
DELETE /api/favorites/{movieId}

GET    /api/notifications/my
PUT    /api/notifications/{id}/read
DELETE /api/notifications/{id}
```

Admin API:

```text
GET    /api/admin/reviews
GET    /api/admin/reviews?movieId=&rating=
PATCH  /api/admin/reviews/{id}/hide
PATCH  /api/admin/reviews/{id}/show
DELETE /api/admin/reviews/{id}
```

## Body test API giai đoạn 9

Tạo đánh giá phim:

```http
POST http://localhost:8080/api/movies/{movieId}/reviews
Authorization: Bearer <user_token>
```

```json
{
  "rating": 5,
  "content": "Phim hay, âm thanh và hình ảnh rất tốt"
}
```

Cập nhật đánh giá:

```http
PUT http://localhost:8080/api/reviews/{reviewId}
Authorization: Bearer <user_token>
```

```json
{
  "rating": 4,
  "content": "Phim ổn, đáng xem"
}
```

Thêm phim yêu thích:

```http
POST http://localhost:8080/api/favorites/{movieId}
Authorization: Bearer <user_token>
```

Xem thông báo của tôi:

```http
GET http://localhost:8080/api/notifications/my
Authorization: Bearer <user_token>
```

Đánh dấu thông báo đã đọc:

```http
PUT http://localhost:8080/api/notifications/{notificationId}/read
Authorization: Bearer <user_token>
```

Admin lọc đánh giá:

```http
GET http://localhost:8080/api/admin/reviews?rating=5
Authorization: Bearer <admin_token>
```

## File đã tạo/sửa ở giai đoạn 9

File thêm:

- `src/main/java/com/duynam/cinema/constant/NotificationType.java`
- `src/main/java/com/duynam/cinema/entity/Review.java`
- `src/main/java/com/duynam/cinema/entity/Favorite.java`
- `src/main/java/com/duynam/cinema/entity/Notification.java`
- `src/main/java/com/duynam/cinema/repository/ReviewRepository.java`
- `src/main/java/com/duynam/cinema/repository/FavoriteRepository.java`
- `src/main/java/com/duynam/cinema/repository/NotificationRepository.java`
- `src/main/java/com/duynam/cinema/dto/request/ReviewRequest.java`
- `src/main/java/com/duynam/cinema/dto/response/ReviewResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/FavoriteResponse.java`
- `src/main/java/com/duynam/cinema/dto/response/NotificationResponse.java`
- `src/main/java/com/duynam/cinema/mapper/ReviewMapper.java`
- `src/main/java/com/duynam/cinema/mapper/FavoriteMapper.java`
- `src/main/java/com/duynam/cinema/mapper/NotificationMapper.java`
- `src/main/java/com/duynam/cinema/service/ReviewService.java`
- `src/main/java/com/duynam/cinema/service/FavoriteService.java`
- `src/main/java/com/duynam/cinema/service/NotificationService.java`
- `src/main/java/com/duynam/cinema/controller/ReviewController.java`
- `src/main/java/com/duynam/cinema/controller/AdminReviewController.java`
- `src/main/java/com/duynam/cinema/controller/FavoriteController.java`
- `src/main/java/com/duynam/cinema/controller/NotificationController.java`

File sửa:

- `src/main/java/com/duynam/cinema/configuration/SecurityConfig.java`
- `src/main/java/com/duynam/cinema/exception/ErrorCode.java`
- `src/main/java/com/duynam/cinema/repository/BookingRepository.java`
- `src/main/java/com/duynam/cinema/service/BookingService.java`
- `NGUCANH.md`

## Cách test đã dùng sau khi hoàn thiện giai đoạn 9

Command đã chạy thành công:

```bash
mvn.cmd test -q
```

Kết quả:

- Test pass.
- Spring Boot context start được với H2.
- JPA repository scan được 21 repository, bao gồm `ReviewRepository`, `FavoriteRepository`, `NotificationRepository`.

## Tiến độ hiện tại sau giai đoạn 9

- Đã hoàn thành Giai đoạn 9: Đánh giá phim, phim yêu thích và thông báo.
- Giai đoạn tiếp theo cần làm: Giai đoạn 10 - Dashboard Admin.
