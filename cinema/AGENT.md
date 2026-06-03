Bạn là một senior full-stack developer. Hãy hỗ trợ tôi xây dựng dự án **Website đặt vé xem phim trực tuyến** để học tập và đưa vào CV.

Tên dự án: **CineVe - Website đặt vé xem phim trực tuyến**

Ngôn ngữ giao diện: **Tiếng Việt có dấu**

==================================================

1. MỤC TIÊU DỰ ÁN
   ==================================================

Tôi muốn xây dựng một website đặt vé xem phim trực tuyến hoàn chỉnh, có đầy đủ frontend, backend và database.

Dự án dùng để:

* Học full-stack web development.
* Học Java Spring Boot backend.
* Học ReactJS frontend.
* Học thiết kế database MySQL.
* Học xác thực, phân quyền, RESTful API.
* Học nghiệp vụ đặt vé, chọn ghế, thanh toán giả lập.
* Có thể đưa vào GitHub và CV xin thực tập Java Backend / Full-stack Intern.

Website mô phỏng hệ thống đặt vé xem phim như CGV, Lotte Cinema, Beta Cinema bản đơn giản.

Người dùng có thể:

* Xem danh sách phim.
* Xem chi tiết phim.
* Xem lịch chiếu.
* Chọn suất chiếu.
* Chọn ghế.
* Đặt vé.
* Thanh toán.
* Xem vé đã đặt.
* Hủy vé nếu đủ điều kiện.
* Đánh giá phim.

Admin có thể:

* Quản lý người dùng.
* Quản lý phim.
* Quản lý thể loại phim.
* Quản lý rạp.
* Quản lý phòng chiếu.
* Quản lý ghế.
* Quản lý suất chiếu.
* Quản lý đơn đặt vé.
* Quản lý thanh toán.
* Quản lý mã giảm giá.
* Quản lý đồ ăn, nước uống.
* Xem dashboard thống kê.

==================================================
2. THÔNG TIN KỸ THUẬT
=====================

Backend:

* Java 21
* Spring Boot 3.x
* Maven
* Package: com.duynam.cinema
* Spring Web
* Spring Data JPA
* Spring Security
* JWT Authentication
* MySQL Driver
* Lombok
* Validation
* Swagger / Springdoc OpenAPI
* BCrypt mã hóa mật khẩu
* RESTful API
* DTO Request / Response
* Global Exception Handler
* Transaction khi đặt vé

Frontend:

* ReactJS
* Vite
* React Router DOM
* Axios
* React Hook Form
* React Toastify
* Recharts
* Bootstrap hoặc Tailwind CSS
* Auth Context
* Protected Route
* Admin Route
* Responsive UI

Database:

* MySQL
* Database name: cineve

Cấu hình backend hiện tại:

* Project: Maven
* Language: Java
* Spring Boot: 3.5.x
* Group: com.duynam
* Artifact: cinema
* Package name: com.duynam.cinema
* Packaging: Jar
* Java: 21
* Configuration: YAML

==================================================
3. YÊU CẦU CHUNG KHI CODE
=========================

Yêu cầu kiến trúc:

* Code theo mô hình nhiều layer rõ ràng.
* Controller chỉ nhận request và trả response.
* Service xử lý nghiệp vụ chính.
* Repository thao tác database.
* Entity ánh xạ database.
* DTO dùng để nhận và trả dữ liệu.
* Không trả trực tiếp Entity ra frontend nếu không cần thiết.
* Có Mapper để chuyển Entity sang DTO.
* Có GlobalExceptionHandler để xử lý lỗi tập trung.
* Có ApiResponse thống nhất format trả về.
* Dùng enum cho các trạng thái.
* Dùng @Transactional cho nghiệp vụ đặt vé.
* Validate dữ liệu đầu vào bằng annotation.
* Phân quyền rõ USER và ADMIN.
* Không cho USER truy cập API admin.
* Không lưu mật khẩu dạng text thường.
* Mật khẩu phải mã hóa bằng BCrypt.
* Có CORS để frontend gọi API.
* Có Swagger để test API.

Yêu cầu nghiệp vụ:

* User chưa đăng nhập không được đặt vé.
* User chỉ được xem vé và booking của chính mình.
* Admin được xem và quản lý toàn bộ hệ thống.
* Không cho đặt ghế đã được đặt trong cùng một suất chiếu.
* Backend bắt buộc kiểm tra lại trạng thái ghế khi đặt vé.
* Không chỉ kiểm tra ghế ở frontend.
* Một phòng không được có hai suất chiếu trùng thời gian.
* Giờ kết thúc suất chiếu phải sau giờ bắt đầu.
* Chỉ cho hủy vé trước giờ chiếu theo quy định.
* Sau khi thanh toán thành công thì booking chuyển sang CONFIRMED.
* Sau khi hủy vé thì booking chuyển sang CANCELLED.
* Sau khi đặt vé thành công thì tạo ticket.
* Ticket có mã vé và QR Code giả lập.
* Chỉ người đã đặt vé phim đó mới được đánh giá phim.
* Mỗi user chỉ được đánh giá một lần cho một phim.
* Coupon phải kiểm tra còn hạn, còn lượt dùng và đủ điều kiện đơn hàng.

Yêu cầu giao diện:

* Toàn bộ giao diện dùng tiếng Việt có dấu.
* Không dùng tiếng Anh cho menu, button, label, thông báo, lỗi.
* Chỉ giữ tiếng Anh với thuật ngữ phổ biến như Email, Admin, VIP, QR Code.
* Theme website: tối, hiện đại, phong cách rạp phim.
* Màu chủ đạo: đen, đỏ, trắng, vàng.
* Button chính màu đỏ.
* Ghế VIP dùng màu vàng.
* Có loading khi gọi API.
* Có toast thông báo thành công / thất bại.
* Có modal xác nhận khi xóa hoặc hủy.
* Giao diện responsive cho desktop và mobile.

==================================================
4. CÁC CHỨC NĂNG CẦN LÀM
========================

4.1. Chức năng xác thực

* Đăng ký tài khoản.
* Đăng nhập.
* Đăng xuất.
* Lấy thông tin người dùng hiện tại.
* Đổi mật khẩu.
* Mã hóa mật khẩu bằng BCrypt.
* Xác thực bằng JWT.
* Phân quyền USER / ADMIN.

API gợi ý:

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/me
* PUT /api/auth/change-password

4.2. Chức năng người dùng

* Xem thông tin cá nhân.
* Cập nhật thông tin cá nhân.
* Xem lịch sử đặt vé.
* Xem chi tiết vé.
* Hủy vé nếu đủ điều kiện.
* Xem danh sách phim yêu thích.
* Thêm phim vào yêu thích.
* Xóa phim khỏi yêu thích.
* Xem thông báo cá nhân.
* Đánh dấu thông báo đã đọc.

4.3. Chức năng phim

* Xem danh sách phim.
* Xem phim đang chiếu.
* Xem phim sắp chiếu.
* Xem chi tiết phim.
* Tìm kiếm phim theo tên.
* Lọc phim theo thể loại.
* Lọc phim theo trạng thái.
* Lọc phim theo ngôn ngữ.
* Lọc phim theo quốc gia.
* Xem trailer phim.
* Xem đánh giá phim.
* Admin thêm phim.
* Admin sửa phim.
* Admin xóa hoặc ẩn phim.
* Admin upload poster phim.
* Admin gán thể loại cho phim.
* Admin cập nhật trạng thái phim.

Trạng thái phim:

* COMING_SOON: Sắp chiếu
* NOW_SHOWING: Đang chiếu
* ENDED: Đã kết thúc
* HIDDEN: Đã ẩn

4.4. Chức năng thể loại phim

* Xem danh sách thể loại.
* Xem chi tiết thể loại.
* Admin thêm thể loại.
* Admin sửa thể loại.
* Admin xóa hoặc ẩn thể loại.

Ví dụ thể loại:

* Hành động
* Kinh dị
* Hài
* Tình cảm
* Hoạt hình
* Viễn tưởng
* Phiêu lưu
* Tâm lý

4.5. Chức năng rạp chiếu

* Xem danh sách rạp.
* Xem rạp theo thành phố.
* Xem chi tiết rạp.
* Xem danh sách phim đang chiếu tại rạp.
* Admin thêm rạp.
* Admin sửa rạp.
* Admin xóa hoặc ẩn rạp.

Thông tin rạp:

* Tên rạp
* Địa chỉ
* Thành phố
* Số điện thoại
* Email
* Mô tả
* Trạng thái

4.6. Chức năng phòng chiếu

* Admin xem danh sách phòng chiếu.
* Admin xem phòng theo rạp.
* Admin thêm phòng chiếu.
* Admin sửa phòng chiếu.
* Admin xóa hoặc ẩn phòng chiếu.
* Admin tạo sơ đồ ghế cho phòng.

Thông tin phòng:

* Tên phòng
* Rạp
* Số hàng ghế
* Số cột ghế
* Loại phòng
* Trạng thái

Loại phòng:

* 2D
* 3D
* IMAX
* VIP

4.7. Chức năng ghế

* Admin tạo ghế tự động theo số hàng và số cột.
* Mã ghế dạng A1, A2, A3, B1, B2...
* Admin thêm ghế thủ công nếu cần.
* Admin sửa loại ghế.
* Admin khóa ghế.
* Admin mở khóa ghế.
* Admin đánh dấu ghế bảo trì.
* User xem sơ đồ ghế theo suất chiếu.
* User biết ghế nào còn trống, ghế nào đã đặt, ghế nào VIP, ghế nào đang bảo trì.

Loại ghế:

* NORMAL: Ghế thường
* VIP: Ghế VIP
* COUPLE: Ghế đôi

Trạng thái ghế:

* ACTIVE: Hoạt động
* MAINTENANCE: Bảo trì
* DISABLED: Đã khóa

4.8. Chức năng suất chiếu

* User xem lịch chiếu theo phim.
* User xem lịch chiếu theo rạp.
* User xem lịch chiếu theo ngày.
* User chọn suất chiếu để đặt vé.
* Admin thêm suất chiếu.
* Admin sửa suất chiếu.
* Admin xóa hoặc hủy suất chiếu.
* Admin lọc suất chiếu theo phim, rạp, ngày, phòng.
* Backend kiểm tra không cho tạo suất chiếu trùng giờ trong cùng một phòng.

Thông tin suất chiếu:

* Phim
* Rạp
* Phòng chiếu
* Ngày giờ bắt đầu
* Ngày giờ kết thúc
* Giá ghế thường
* Giá ghế VIP
* Giá ghế đôi
* Trạng thái

Trạng thái suất chiếu:

* OPEN: Đang mở bán
* CLOSED: Đã đóng
* CANCELLED: Đã hủy
* FINISHED: Đã kết thúc

4.9. Chức năng đặt vé

Luồng đặt vé:

1. User đăng nhập.
2. User chọn phim.
3. User chọn rạp.
4. User chọn ngày.
5. User chọn suất chiếu.
6. Hệ thống hiển thị sơ đồ ghế.
7. User chọn một hoặc nhiều ghế.
8. User chọn đồ ăn, nước uống nếu có.
9. User nhập mã giảm giá nếu có.
10. User xác nhận thanh toán giả lập.
11. Backend kiểm tra lại ghế đã đặt chưa.
12. Backend tạo booking.
13. Backend tạo booking seat.
14. Backend tạo payment.
15. Backend tạo ticket.
16. Frontend hiển thị đặt vé thành công.

Chức năng cụ thể:

* Chọn ghế.
* Bỏ chọn ghế.
* Tính tiền ghế theo loại ghế.
* Tính tiền đồ ăn nước uống.
* Áp dụng mã giảm giá.
* Tính tổng tiền cuối cùng.
* Tạo mã booking.
* Tạo vé.
* Tạo QR Code giả lập.
* Xem vé sau khi đặt thành công.

Trạng thái booking:

* PENDING: Chờ thanh toán
* CONFIRMED: Đã xác nhận
* CANCELLED: Đã hủy
* COMPLETED: Đã hoàn thành
* EXPIRED: Hết hạn

4.10. Chức năng thanh toán giả lập

* Chọn phương thức thanh toán.
* Thanh toán tại quầy.
* MoMo giả lập.
* VNPay giả lập.
* Chuyển khoản giả lập.
* Thẻ ngân hàng giả lập.
* Giả lập thanh toán thành công.
* Giả lập thanh toán thất bại.
* Admin xem danh sách thanh toán.
* Admin lọc thanh toán theo trạng thái.
* Admin hoàn tiền giả lập.

Trạng thái thanh toán:

* PENDING: Chờ thanh toán
* SUCCESS: Thành công
* FAILED: Thất bại
* REFUNDED: Đã hoàn tiền

4.11. Chức năng vé

* Tạo vé sau khi đặt thành công.
* Mỗi vé có mã vé.
* Mỗi vé có QR Code giả lập.
* User xem vé của tôi.
* User xem vé sắp xem.
* User xem vé đã xem.
* User xem vé đã hủy.
* Admin xem danh sách vé.
* Admin xem chi tiết vé.
* Admin đánh dấu vé đã sử dụng nếu cần.

Trạng thái vé:

* ACTIVE: Còn hiệu lực
* USED: Đã sử dụng
* CANCELLED: Đã hủy
* EXPIRED: Hết hạn

4.12. Chức năng đồ ăn, nước uống

* User xem danh sách đồ ăn, nước uống, combo.
* User chọn số lượng.
* User thêm vào đơn đặt vé.
* Hệ thống tính tiền đồ ăn.
* Admin thêm sản phẩm.
* Admin sửa sản phẩm.
* Admin xóa hoặc ẩn sản phẩm.
* Admin upload ảnh sản phẩm.

Loại sản phẩm:

* POPCORN: Bắp rang
* DRINK: Nước uống
* COMBO: Combo
* SNACK: Đồ ăn nhẹ

4.13. Chức năng mã giảm giá

* User nhập mã giảm giá.
* Backend kiểm tra mã có tồn tại không.
* Backend kiểm tra mã còn hạn không.
* Backend kiểm tra mã còn lượt sử dụng không.
* Backend kiểm tra đơn hàng có đủ điều kiện không.
* Tính số tiền được giảm.
* Admin thêm mã giảm giá.
* Admin sửa mã giảm giá.
* Admin xóa mã giảm giá.
* Admin bật / tắt mã giảm giá.
* Admin xem số lượt sử dụng.

Loại giảm giá:

* PERCENT: Giảm theo phần trăm
* FIXED_AMOUNT: Giảm số tiền cố định

4.14. Chức năng đánh giá phim

* User đánh giá phim từ 1 đến 5 sao.
* User viết nội dung đánh giá.
* User sửa đánh giá của mình.
* User xóa đánh giá của mình.
* User xem đánh giá của người khác.
* Admin xem danh sách đánh giá.
* Admin ẩn đánh giá.
* Admin xóa đánh giá.

Điều kiện:

* Chỉ người đã đặt vé phim đó mới được đánh giá.
* Mỗi user chỉ được đánh giá một lần cho một phim.

4.15. Chức năng dashboard admin

Admin dashboard cần có:

* Tổng số người dùng.
* Tổng số phim.
* Tổng số rạp.
* Tổng số phòng chiếu.
* Tổng số suất chiếu.
* Tổng số booking.
* Tổng số vé đã bán.
* Tổng doanh thu.
* Doanh thu hôm nay.
* Doanh thu tháng này.
* Số booking bị hủy.
* Top phim bán chạy.
* Doanh thu theo ngày.
* Doanh thu theo tháng.
* Tỷ lệ booking theo trạng thái.
* Tỷ lệ thanh toán theo phương thức.

==================================================
5. CÁC GIAO DIỆN FRONTEND CẦN TẠO
=================================

5.1. Giao diện người dùng

1. Trang chủ

* Header
* Banner phim nổi bật
* Danh sách phim đang chiếu
* Danh sách phim sắp chiếu
* Danh sách rạp nổi bật
* Khuyến mãi nổi bật
* Footer

2. Trang danh sách phim

* Ô tìm kiếm phim
* Bộ lọc thể loại
* Bộ lọc trạng thái phim
* Bộ lọc ngôn ngữ
* Grid danh sách phim
* Nút xem chi tiết
* Nút đặt vé

3. Trang chi tiết phim

* Poster phim
* Trailer
* Tên phim
* Mô tả
* Thể loại
* Thời lượng
* Đạo diễn
* Diễn viên
* Ngôn ngữ
* Quốc gia
* Độ tuổi
* Ngày khởi chiếu
* Đánh giá trung bình
* Lịch chiếu
* Nút đặt vé

4. Trang danh sách rạp

* Danh sách rạp
* Lọc theo thành phố
* Tìm kiếm rạp
* Xem địa chỉ rạp
* Xem chi tiết rạp

5. Trang chọn suất chiếu

* Thông tin phim
* Chọn rạp
* Chọn ngày
* Danh sách suất chiếu
* Giờ chiếu
* Phòng chiếu
* Giá vé
* Số ghế còn trống

6. Trang chọn ghế

* Thông tin phim, rạp, phòng, giờ chiếu
* Màn hình chiếu
* Sơ đồ ghế
* Ghế thường
* Ghế VIP
* Ghế đôi
* Ghế đã đặt
* Ghế đang chọn
* Ghế bảo trì
* Chú thích trạng thái ghế
* Danh sách ghế đã chọn
* Tổng tiền ghế
* Chọn đồ ăn, nước uống
* Nhập mã giảm giá
* Tổng tiền cuối cùng
* Nút tiếp tục thanh toán

7. Trang thanh toán

* Tóm tắt booking
* Thông tin phim
* Thông tin suất chiếu
* Danh sách ghế
* Danh sách đồ ăn
* Mã giảm giá
* Tổng tiền
* Chọn phương thức thanh toán
* Nút xác nhận thanh toán

8. Trang đặt vé thành công

* Icon thành công
* Mã booking
* Mã vé
* QR Code giả lập
* Tên phim
* Tên rạp
* Phòng chiếu
* Ngày giờ chiếu
* Danh sách ghế
* Tổng tiền
* Nút xem vé của tôi
* Nút về trang chủ

9. Trang vé của tôi

* Tab vé sắp xem
* Tab vé đã xem
* Tab vé đã hủy
* Danh sách vé
* Xem chi tiết vé
* Hủy vé nếu được phép

10. Trang chi tiết vé

* Mã vé
* QR Code
* Thông tin phim
* Thông tin rạp
* Thông tin phòng
* Thời gian chiếu
* Ghế
* Tổng tiền
* Trạng thái vé
* Nút hủy vé nếu được phép

11. Trang đăng nhập

* Email
* Mật khẩu
* Nút đăng nhập
* Link đăng ký
* Hiển thị lỗi tiếng Việt

12. Trang đăng ký

* Họ tên
* Email
* Số điện thoại
* Mật khẩu
* Nhập lại mật khẩu
* Nút đăng ký
* Link đăng nhập
* Hiển thị lỗi tiếng Việt

13. Trang hồ sơ cá nhân

* Avatar
* Họ tên
* Email
* Số điện thoại
* Form cập nhật thông tin
* Đổi mật khẩu

14. Trang phim yêu thích

* Danh sách phim yêu thích
* Xóa khỏi yêu thích
* Xem chi tiết phim

15. Trang thông báo

* Danh sách thông báo
* Đánh dấu đã đọc
* Xóa thông báo

5.2. Giao diện Admin

1. Admin Layout

* Sidebar quản trị
* Header admin
* Avatar admin
* Nút đăng xuất

2. Dashboard Admin

* Card tổng số người dùng
* Card tổng số phim
* Card tổng số booking
* Card tổng doanh thu
* Biểu đồ doanh thu
* Biểu đồ top phim
* Bảng booking gần đây

3. Trang quản lý người dùng

* Bảng danh sách người dùng
* Tìm kiếm
* Lọc theo vai trò
* Lọc theo trạng thái
* Xem chi tiết
* Khóa tài khoản
* Mở khóa tài khoản

4. Trang quản lý phim

* Bảng danh sách phim
* Tìm kiếm phim
* Lọc phim
* Thêm phim
* Sửa phim
* Xóa hoặc ẩn phim
* Upload poster
* Gán thể loại

5. Trang quản lý thể loại

* Danh sách thể loại
* Thêm thể loại
* Sửa thể loại
* Xóa hoặc ẩn thể loại

6. Trang quản lý rạp

* Danh sách rạp
* Tìm kiếm rạp
* Lọc theo thành phố
* Thêm rạp
* Sửa rạp
* Xóa hoặc ẩn rạp
* Xem phòng của rạp

7. Trang quản lý phòng chiếu

* Danh sách phòng
* Thêm phòng
* Sửa phòng
* Xóa hoặc ẩn phòng
* Tạo ghế tự động

8. Trang quản lý ghế

* Sơ đồ ghế
* Đổi loại ghế
* Chuyển ghế sang bảo trì
* Mở lại ghế
* Xóa ghế

9. Trang quản lý suất chiếu

* Danh sách suất chiếu
* Tìm kiếm suất chiếu
* Lọc theo phim
* Lọc theo rạp
* Lọc theo ngày
* Thêm suất chiếu
* Sửa suất chiếu
* Xóa hoặc hủy suất chiếu
* Cảnh báo nếu trùng giờ chiếu

10. Trang quản lý booking

* Danh sách booking
* Tìm kiếm theo mã booking
* Lọc theo trạng thái
* Lọc theo ngày
* Lọc theo phim
* Xem chi tiết booking
* Hủy booking
* Hoàn tiền giả lập

11. Trang quản lý thanh toán

* Danh sách thanh toán
* Lọc theo phương thức
* Lọc theo trạng thái
* Xem chi tiết thanh toán
* Hoàn tiền giả lập

12. Trang quản lý đồ ăn, nước uống

* Danh sách sản phẩm
* Thêm sản phẩm
* Sửa sản phẩm
* Xóa hoặc ẩn sản phẩm
* Upload ảnh sản phẩm

13. Trang quản lý mã giảm giá

* Danh sách mã giảm giá
* Thêm mã giảm giá
* Sửa mã giảm giá
* Xóa mã giảm giá
* Bật / tắt mã giảm giá

14. Trang quản lý đánh giá

* Danh sách đánh giá
* Lọc theo phim
* Lọc theo số sao
* Ẩn đánh giá
* Xóa đánh giá

==================================================
6. THỨ TỰ TRIỂN KHAI
====================

Hãy triển khai dự án theo thứ tự sau:

==================================================
6. THỨ TỰ TRIỂN KHAI
====================

Giai đoạn 1: Setup nền tảng backend

* Setup project Spring Boot.
* Cấu hình MySQL.
* Cấu hình application.yml.
* Tạo cấu trúc package chuẩn.
* Tạo ApiResponse dùng chung.
* Tạo GlobalExceptionHandler.
* Tạo ErrorCode hoặc AppException.
* Cấu hình CORS.
* Cấu hình Swagger.
* Tạo các enum dùng chung.
* Tạo các util cơ bản nếu cần.

Mục tiêu:

* Backend chạy được.
* Kết nối database thành công.
* Có format response và xử lý lỗi thống nhất.

Giai đoạn 2: Authentication và phân quyền

* Tạo User entity.
* Tạo Role entity.
* Tạo UserRepository.
* Tạo RoleRepository.
* Tạo Register API.
* Tạo Login API.
* Tạo JWT service.
* Tạo JWT filter.
* Cấu hình Spring Security.
* Mã hóa mật khẩu bằng BCrypt.
* Lấy thông tin user hiện tại.
* Đổi mật khẩu.
* Đăng xuất ở frontend bằng cách xóa token.
* Kiểm tra tài khoản bị khóa khi đăng nhập.
* Phân quyền USER / ADMIN.

API cần có:

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/me
* PUT /api/auth/change-password

Mục tiêu:

* User đăng ký được.
* User đăng nhập nhận JWT được.
* API admin chỉ ADMIN truy cập được.
* API user yêu cầu đăng nhập mới truy cập được.

Giai đoạn 3: Quản lý người dùng

* User xem thông tin cá nhân.
* User cập nhật thông tin cá nhân.
* Admin xem danh sách người dùng.
* Admin xem chi tiết người dùng.
* Admin khóa tài khoản.
* Admin mở khóa tài khoản.
* Admin xóa hoặc vô hiệu hóa người dùng.
* Tìm kiếm người dùng.
* Lọc người dùng theo trạng thái hoặc vai trò.

API cần có:

* GET /api/users/me
* PUT /api/users/me
* GET /api/admin/users
* GET /api/admin/users/{id}
* PUT /api/admin/users/{id}/lock
* PUT /api/admin/users/{id}/unlock
* DELETE /api/admin/users/{id}

Mục tiêu:

* Hoàn thiện chức năng người dùng cơ bản.
* Chuẩn bị dữ liệu cho dashboard admin.

Giai đoạn 4: Quản lý phim và thể loại phim

* Tạo Movie entity.
* Tạo Genre entity.
* Tạo quan hệ nhiều-nhiều giữa Movie và Genre.
* User xem danh sách phim.
* User xem phim đang chiếu.
* User xem phim sắp chiếu.
* User xem chi tiết phim.
* User tìm kiếm phim theo tên.
* User lọc phim theo thể loại, trạng thái, ngôn ngữ, quốc gia.
* User xem trailer phim.
* Admin thêm phim.
* Admin sửa phim.
* Admin xóa hoặc ẩn phim.
* Admin upload poster phim.
* Admin gán thể loại cho phim.
* Admin cập nhật trạng thái phim.
* Admin thêm, sửa, xóa hoặc ẩn thể loại.

API cần có:

* GET /api/movies
* GET /api/movies/{id}
* GET /api/movies/now-showing
* GET /api/movies/coming-soon
* GET /api/movies/search
* POST /api/admin/movies
* PUT /api/admin/movies/{id}
* DELETE /api/admin/movies/{id}
* GET /api/genres
* GET /api/genres/{id}
* POST /api/admin/genres
* PUT /api/admin/genres/{id}
* DELETE /api/admin/genres/{id}

Mục tiêu:

* Hoàn thiện module phim.
* Hoàn thiện module thể loại.
* Trang chủ và trang danh sách phim có dữ liệu để hiển thị.

Giai đoạn 5: Quản lý rạp, phòng chiếu và ghế

* Tạo Cinema entity.
* Tạo Room entity.
* Tạo Seat entity.
* User xem danh sách rạp.
* User xem rạp theo thành phố.
* User xem chi tiết rạp.
* Admin thêm, sửa, xóa hoặc ẩn rạp.
* Admin thêm, sửa, xóa hoặc ẩn phòng chiếu.
* Admin xem phòng theo rạp.
* Admin tạo ghế tự động theo số hàng và số cột.
* Mã ghế dạng A1, A2, A3, B1, B2...
* Admin sửa loại ghế.
* Admin khóa ghế.
* Admin mở khóa ghế.
* Admin đánh dấu ghế bảo trì.

API cần có:

* GET /api/cinemas
* GET /api/cinemas/{id}
* GET /api/cinemas/by-city
* POST /api/admin/cinemas
* PUT /api/admin/cinemas/{id}
* DELETE /api/admin/cinemas/{id}
* GET /api/admin/rooms
* GET /api/admin/rooms/{id}
* GET /api/admin/cinemas/{cinemaId}/rooms
* POST /api/admin/rooms
* PUT /api/admin/rooms/{id}
* DELETE /api/admin/rooms/{id}
* GET /api/admin/rooms/{roomId}/seats
* POST /api/admin/rooms/{roomId}/generate-seats
* PUT /api/admin/seats/{id}
* PUT /api/admin/seats/{id}/maintenance
* PUT /api/admin/seats/{id}/active

Mục tiêu:

* Có rạp, phòng, ghế để tạo suất chiếu.
* Có sơ đồ ghế để phục vụ đặt vé.

Giai đoạn 6: Quản lý suất chiếu

* Tạo Showtime entity.
* User xem lịch chiếu theo phim.
* User xem lịch chiếu theo rạp.
* User xem lịch chiếu theo ngày.
* User chọn suất chiếu để đặt vé.
* User xem sơ đồ ghế theo suất chiếu.
* Admin thêm suất chiếu.
* Admin sửa suất chiếu.
* Admin xóa hoặc hủy suất chiếu.
* Admin lọc suất chiếu theo phim, rạp, ngày, phòng.
* Backend kiểm tra không cho tạo suất chiếu trùng giờ trong cùng một phòng.
* Backend kiểm tra giờ kết thúc phải sau giờ bắt đầu.
* Backend kiểm tra phim và phòng chiếu phải hợp lệ.

API cần có:

* GET /api/showtimes
* GET /api/showtimes/{id}
* GET /api/movies/{movieId}/showtimes
* GET /api/cinemas/{cinemaId}/showtimes
* GET /api/showtimes/{showtimeId}/seats
* POST /api/admin/showtimes
* PUT /api/admin/showtimes/{id}
* DELETE /api/admin/showtimes/{id}

Mục tiêu:

* Có lịch chiếu hoàn chỉnh.
* User có thể đi đến bước chọn ghế.

Giai đoạn 7: Đồ ăn, nước uống và mã giảm giá

* Tạo Food entity.
* Tạo Coupon entity.
* Tạo CouponUsage entity nếu cần.
* User xem danh sách đồ ăn, nước uống, combo.
* User chọn đồ ăn khi đặt vé.
* Admin thêm đồ ăn.
* Admin sửa đồ ăn.
* Admin xóa hoặc ẩn đồ ăn.
* Admin upload ảnh đồ ăn.
* User nhập mã giảm giá.
* Backend kiểm tra mã có tồn tại không.
* Backend kiểm tra mã còn hạn không.
* Backend kiểm tra mã còn lượt sử dụng không.
* Backend kiểm tra đơn hàng có đủ điều kiện không.
* Admin thêm mã giảm giá.
* Admin sửa mã giảm giá.
* Admin xóa mã giảm giá.
* Admin bật / tắt mã giảm giá.

API cần có:

* GET /api/foods
* GET /api/foods/{id}
* POST /api/admin/foods
* PUT /api/admin/foods/{id}
* DELETE /api/admin/foods/{id}
* POST /api/coupons/apply
* GET /api/admin/coupons
* POST /api/admin/coupons
* PUT /api/admin/coupons/{id}
* DELETE /api/admin/coupons/{id}

Mục tiêu:

* Hoàn thiện các dữ liệu phụ trước khi làm đặt vé.
* Booking có thể tính tiền đồ ăn và mã giảm giá.

Giai đoạn 8: Đặt vé, thanh toán và vé

* Tạo Booking entity.
* Tạo BookingSeat entity.
* Tạo Payment entity.
* Tạo Ticket entity.
* User chọn ghế.
* User bỏ chọn ghế.
* Backend kiểm tra ghế đã đặt chưa.
* Backend kiểm tra ghế có thuộc đúng phòng của suất chiếu không.
* Backend kiểm tra ghế có đang bảo trì không.
* Backend tính tiền ghế theo loại ghế.
* Backend tính tiền đồ ăn nước uống.
* Backend áp dụng mã giảm giá.
* Backend tính tổng tiền cuối cùng.
* Backend tạo booking.
* Backend tạo booking seat.
* Backend tạo payment giả lập.
* Backend tạo ticket.
* Ticket có mã vé.
* Ticket có QR Code giả lập.
* Dùng @Transactional để tránh lỗi đặt trùng ghế.
* User xem vé của tôi.
* User xem chi tiết vé.
* User hủy vé nếu đủ điều kiện.
* Khi hủy vé, booking chuyển sang CANCELLED.
* Khi hủy vé, ticket chuyển sang CANCELLED.
* Khi thanh toán thành công, booking chuyển sang CONFIRMED.
* Admin xem danh sách booking.
* Admin xem chi tiết booking.
* Admin hủy booking.
* Admin hoàn tiền giả lập.
* Admin xem danh sách thanh toán.
* Admin lọc thanh toán theo trạng thái, phương thức.
* Admin xem danh sách vé.
* Admin xem chi tiết vé.
* Admin đánh dấu vé đã sử dụng nếu cần.

API cần có:

* POST /api/bookings
* GET /api/bookings/my
* GET /api/bookings/{id}
* GET /api/bookings/{id}/ticket
* PUT /api/bookings/{id}/cancel
* GET /api/admin/bookings
* GET /api/admin/bookings/{id}
* PUT /api/admin/bookings/{id}/confirm
* PUT /api/admin/bookings/{id}/cancel
* PUT /api/admin/bookings/{id}/refund
* POST /api/payments/create
* POST /api/payments/fake-success
* POST /api/payments/fake-failed
* GET /api/payments/{id}
* GET /api/admin/payments
* GET /api/admin/tickets
* GET /api/admin/tickets/{id}
* PUT /api/admin/tickets/{id}/used

Mục tiêu:

* Hoàn thiện luồng nghiệp vụ quan trọng nhất của project.
* User có thể đặt vé từ đầu đến cuối.
* Admin có thể quản lý booking, payment và ticket.

Giai đoạn 9: Đánh giá phim, phim yêu thích và thông báo

* Tạo Review entity.
* Tạo Favorite entity.
* Tạo Notification entity.
* User đánh giá phim từ 1 đến 5 sao.
* User viết nội dung đánh giá.
* User sửa đánh giá của mình.
* User xóa đánh giá của mình.
* User xem đánh giá của người khác.
* Backend kiểm tra chỉ người đã đặt vé phim đó mới được đánh giá.
* Backend kiểm tra mỗi user chỉ được đánh giá một lần cho một phim.
* Admin xem danh sách đánh giá.
* Admin ẩn đánh giá.
* Admin xóa đánh giá.
* User thêm phim vào yêu thích.
* User xóa phim khỏi yêu thích.
* User xem danh sách phim yêu thích.
* Tạo thông báo khi đặt vé thành công.
* Tạo thông báo khi hủy vé.
* User xem thông báo cá nhân.
* User đánh dấu thông báo đã đọc.
* User xóa thông báo.

API cần có:

* GET /api/movies/{movieId}/reviews
* POST /api/movies/{movieId}/reviews
* PUT /api/reviews/{id}
* DELETE /api/reviews/{id}
* GET /api/admin/reviews
* GET /api/favorites
* POST /api/favorites/{movieId}
* DELETE /api/favorites/{movieId}
* GET /api/notifications/my
* PUT /api/notifications/{id}/read
* DELETE /api/notifications/{id}

Mục tiêu:

* Hoàn thiện các chức năng tương tác của user.
* Tăng độ hoàn chỉnh cho project.

Giai đoạn 10: Dashboard Admin

* Tổng số người dùng.
* Tổng số phim.
* Tổng số rạp.
* Tổng số phòng chiếu.
* Tổng số suất chiếu.
* Tổng số booking.
* Tổng số vé đã bán.
* Tổng doanh thu.
* Doanh thu hôm nay.
* Doanh thu tháng này.
* Số booking bị hủy.
* Top phim bán chạy.
* Doanh thu theo ngày.
* Doanh thu theo tháng.
* Tỷ lệ booking theo trạng thái.
* Tỷ lệ thanh toán theo phương thức.

API cần có:

* GET /api/admin/dashboard/summary
* GET /api/admin/dashboard/revenue-by-day
* GET /api/admin/dashboard/revenue-by-month
* GET /api/admin/dashboard/top-movies
* GET /api/admin/dashboard/booking-status
* GET /api/admin/dashboard/payment-methods

Mục tiêu:

* Admin có dashboard thống kê.
* Dự án nhìn chuyên nghiệp hơn khi đưa vào CV.

Giai đoạn 11: Frontend người dùng

* Setup React Vite.
* Cấu hình Axios.
* Cấu hình React Router.
* Tạo Auth Context.
* Tạo Protected Route.
* Tạo User Layout.
* Làm trang chủ.
* Làm trang danh sách phim.
* Làm trang chi tiết phim.
* Làm trang danh sách rạp.
* Làm trang chọn suất chiếu.
* Làm trang chọn ghế.
* Làm trang thanh toán.
* Làm trang đặt vé thành công.
* Làm trang vé của tôi.
* Làm trang chi tiết vé.
* Làm trang đăng nhập.
* Làm trang đăng ký.
* Làm trang hồ sơ cá nhân.
* Làm trang phim yêu thích.
* Làm trang thông báo.
* Kết nối API backend.
* Hiển thị toast thông báo.
* Hiển thị loading khi gọi API.
* Xử lý lỗi tiếng Việt.

Mục tiêu:

* User có thể sử dụng website từ xem phim đến đặt vé hoàn chỉnh.

Giai đoạn 12: Frontend Admin

* Tạo Admin Layout.
* Tạo Admin Route.
* Tạo Sidebar quản trị.
* Tạo Header admin.
* Làm Dashboard Admin.
* Làm trang quản lý người dùng.
* Làm trang quản lý phim.
* Làm trang quản lý thể loại.
* Làm trang quản lý rạp.
* Làm trang quản lý phòng chiếu.
* Làm trang quản lý ghế.
* Làm trang quản lý suất chiếu.
* Làm trang quản lý booking.
* Làm trang quản lý thanh toán.
* Làm trang quản lý đồ ăn, nước uống.
* Làm trang quản lý mã giảm giá.
* Làm trang quản lý đánh giá.
* Kết nối API admin.
* Thêm modal xác nhận xóa, hủy, khóa tài khoản.
* Thêm form validate tiếng Việt.
* Thêm biểu đồ dashboard bằng Recharts.

Mục tiêu:

* Admin có thể quản lý toàn bộ hệ thống từ giao diện.

Giai đoạn 13: Hoàn thiện, dữ liệu mẫu và deploy

* Hoàn thiện validate backend.
* Hoàn thiện validate frontend.
* Hoàn thiện xử lý lỗi.
* Thêm dữ liệu mẫu.
* Tạo tài khoản admin mẫu.
* Tạo tài khoản user mẫu.
* Thêm ít nhất 8 phim.
* Thêm ít nhất 5 thể loại.
* Thêm ít nhất 3 rạp.
* Mỗi rạp có ít nhất 2 phòng.
* Mỗi phòng có sơ đồ ghế 8 hàng x 10 cột.
* Thêm ít nhất 15 suất chiếu.
* Thêm một số đồ ăn, combo.
* Thêm một số mã giảm giá.
* Viết README.
* Thêm ảnh demo.
* Viết hướng dẫn chạy backend.
* Viết hướng dẫn chạy frontend.
* Viết danh sách API chính.
* Chuẩn bị deploy backend.
* Chuẩn bị deploy frontend.
* Chuẩn bị deploy database.

Mục tiêu:

* Dự án đủ hoàn chỉnh để đưa lên GitHub và ghi vào CV.


==================================================
7. YÊU CẦU KHI TRẢ LỜI VÀ CODE
==============================

* Trước khi code, hãy đọc cấu trúc project hiện tại.
* Không tạo lung tung file không cần thiết.
* Làm từng module một cách rõ ràng.
* Trước khi làm, cần chỉ rõ logic sẽ thực hiện
* Sau mỗi bước, liệt kê file đã tạo hoặc đã sửa.
* Sau mỗi bước, hướng dẫn cách test.
* Ưu tiên code chạy được trước, tối ưu sau.
* Nếu không thể làm hết một lần, hãy chia nhỏ theo giai đoạn.
* Bắt đầu từ backend authentication trước.
* Toàn bộ giao diện frontend phải là tiếng Việt có dấu.
* Tên biến trong code có thể dùng tiếng Anh, nhưng text hiển thị cho người dùng phải là tiếng Việt.
