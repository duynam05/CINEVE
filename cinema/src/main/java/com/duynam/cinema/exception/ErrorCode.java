package com.duynam.cinema.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Dữ liệu không hợp lệ", HttpStatus.BAD_REQUEST),
    EMAIL_REQUIRED(1002, "Email không được để trống", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID(1003, "Email không đúng định dạng", HttpStatus.BAD_REQUEST),
    PASSWORD_REQUIRED(1004, "Mật khẩu không được để trống", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1005, "Mật khẩu phải có ít nhất 6 ký tự", HttpStatus.BAD_REQUEST),
    FULL_NAME_REQUIRED(1006, "Họ tên không được để trống", HttpStatus.BAD_REQUEST),
    FULL_NAME_INVALID(1007, "Họ tên phải từ 2 đến 120 ký tự", HttpStatus.BAD_REQUEST),
    PHONE_INVALID(1008, "Số điện thoại phải có 10 đến 11 chữ số", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1009, "Email đã được sử dụng", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1010, "Người dùng không tồn tại", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1011, "Bạn cần đăng nhập để tiếp tục", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1012, "Bạn không có quyền thực hiện thao tác này", HttpStatus.FORBIDDEN),
    ACCOUNT_DISABLED(1013, "Tài khoản đã bị khóa", HttpStatus.FORBIDDEN),
    CURRENT_PASSWORD_REQUIRED(1014, "Mật khẩu hiện tại không được để trống", HttpStatus.BAD_REQUEST),
    NEW_PASSWORD_REQUIRED(1015, "Mật khẩu mới không được để trống", HttpStatus.BAD_REQUEST),
    INVALID_CURRENT_PASSWORD(1016, "Mật khẩu hiện tại không đúng", HttpStatus.BAD_REQUEST),
    BOOTSTRAP_CONFIG_MISSING(1017, "Thiếu cấu hình tài khoản Admin mặc định", HttpStatus.INTERNAL_SERVER_ERROR),
    TOKEN_CREATION_FAILED(1018, "Không thể tạo token đăng nhập", HttpStatus.INTERNAL_SERVER_ERROR),
    ACCOUNT_NOT_VERIFIED(1019, "Tài khoản chưa xác thực email", HttpStatus.FORBIDDEN),
    OTP_REQUIRED(1020, "Mã xác thực không được để trống", HttpStatus.BAD_REQUEST),
    OTP_INVALID_OR_EXPIRED(1021, "Mã xác thực không đúng hoặc đã hết hạn", HttpStatus.BAD_REQUEST),
    ACCOUNT_ALREADY_VERIFIED(1022, "Tài khoản đã được xác thực", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_REQUIRED(1023, "Refresh token không được để trống", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_INVALID_OR_EXPIRED(1024, "Refresh token không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED),
    RESET_TOKEN_REQUIRED(1025, "Reset token không được để trống", HttpStatus.BAD_REQUEST),
    RESET_TOKEN_INVALID_OR_EXPIRED(1026, "Reset token không hợp lệ hoặc đã hết hạn", HttpStatus.BAD_REQUEST),
    GENRE_NAME_REQUIRED(2001, "Tên thể loại không được để trống", HttpStatus.BAD_REQUEST),
    GENRE_NAME_INVALID(2002, "Tên thể loại phải từ 2 đến 100 ký tự", HttpStatus.BAD_REQUEST),
    GENRE_EXISTED(2003, "Thể loại đã tồn tại", HttpStatus.BAD_REQUEST),
    GENRE_NOT_FOUND(2004, "Thể loại không tồn tại", HttpStatus.NOT_FOUND),
    MOVIE_TITLE_REQUIRED(2005, "Tên phim không được để trống", HttpStatus.BAD_REQUEST),
    MOVIE_TITLE_INVALID(2006, "Tên phim phải từ 2 đến 180 ký tự", HttpStatus.BAD_REQUEST),
    MOVIE_EXISTED(2007, "Phim đã tồn tại", HttpStatus.BAD_REQUEST),
    MOVIE_NOT_FOUND(2008, "Phim không tồn tại", HttpStatus.NOT_FOUND),
    MOVIE_DURATION_REQUIRED(2009, "Thời lượng phim không được để trống", HttpStatus.BAD_REQUEST),
    MOVIE_DURATION_INVALID(2010, "Thời lượng phim phải lớn hơn 0", HttpStatus.BAD_REQUEST),
    MOVIE_STATUS_REQUIRED(2011, "Trạng thái phim không được để trống", HttpStatus.BAD_REQUEST),
    MOVIE_TRAILER_NOT_FOUND(2012, "Phim chưa có trailer", HttpStatus.NOT_FOUND),
    POSTER_FILE_REQUIRED(2013, "File poster không được để trống", HttpStatus.BAD_REQUEST),
    POSTER_FILE_INVALID(2014, "File poster phải là ảnh", HttpStatus.BAD_REQUEST),
    POSTER_UPLOAD_FAILED(2015, "Không thể upload poster", HttpStatus.INTERNAL_SERVER_ERROR),
    CINEMA_NAME_REQUIRED(3001, "Tên rạp không được để trống", HttpStatus.BAD_REQUEST),
    CINEMA_NAME_INVALID(3002, "Tên rạp phải từ 2 đến 150 ký tự", HttpStatus.BAD_REQUEST),
    CINEMA_ADDRESS_REQUIRED(3003, "Địa chỉ rạp không được để trống", HttpStatus.BAD_REQUEST),
    CINEMA_CITY_REQUIRED(3004, "Thành phố không được để trống", HttpStatus.BAD_REQUEST),
    CINEMA_STATUS_REQUIRED(3005, "Trạng thái rạp không được để trống", HttpStatus.BAD_REQUEST),
    CINEMA_EXISTED(3006, "Rạp đã tồn tại", HttpStatus.BAD_REQUEST),
    CINEMA_NOT_FOUND(3007, "Rạp không tồn tại", HttpStatus.NOT_FOUND),
    CINEMA_ID_REQUIRED(3008, "Mã rạp không được để trống", HttpStatus.BAD_REQUEST),
    ROOM_NAME_REQUIRED(3009, "Tên phòng chiếu không được để trống", HttpStatus.BAD_REQUEST),
    ROOM_NAME_INVALID(3010, "Tên phòng chiếu không hợp lệ", HttpStatus.BAD_REQUEST),
    ROOM_ROW_COUNT_REQUIRED(3011, "Số hàng ghế không được để trống", HttpStatus.BAD_REQUEST),
    ROOM_COLUMN_COUNT_REQUIRED(3012, "Số cột ghế không được để trống", HttpStatus.BAD_REQUEST),
    ROOM_SIZE_INVALID(3013, "Kích thước phòng chiếu không hợp lệ", HttpStatus.BAD_REQUEST),
    ROOM_TYPE_REQUIRED(3014, "Loại phòng chiếu không được để trống", HttpStatus.BAD_REQUEST),
    ROOM_STATUS_REQUIRED(3015, "Trạng thái phòng chiếu không được để trống", HttpStatus.BAD_REQUEST),
    ROOM_EXISTED(3016, "Phòng chiếu đã tồn tại trong rạp này", HttpStatus.BAD_REQUEST),
    ROOM_NOT_FOUND(3017, "Phòng chiếu không tồn tại", HttpStatus.NOT_FOUND),
    ROOM_ID_REQUIRED(3018, "Mã phòng chiếu không được để trống", HttpStatus.BAD_REQUEST),
    SEAT_ROW_REQUIRED(3019, "Hàng ghế không được để trống", HttpStatus.BAD_REQUEST),
    SEAT_ROW_INVALID(3020, "Hàng ghế không hợp lệ", HttpStatus.BAD_REQUEST),
    SEAT_COLUMN_REQUIRED(3021, "Số ghế không được để trống", HttpStatus.BAD_REQUEST),
    SEAT_COLUMN_INVALID(3022, "Số ghế không hợp lệ", HttpStatus.BAD_REQUEST),
    SEAT_TYPE_REQUIRED(3023, "Loại ghế không được để trống", HttpStatus.BAD_REQUEST),
    SEAT_STATUS_REQUIRED(3024, "Trạng thái ghế không được để trống", HttpStatus.BAD_REQUEST),
    SEAT_EXISTED(3025, "Ghế đã tồn tại trong phòng này", HttpStatus.BAD_REQUEST),
    SEAT_NOT_FOUND(3026, "Ghế không tồn tại", HttpStatus.NOT_FOUND),
    SEAT_POSITION_INVALID(3027, "Vị trí ghế vượt quá sơ đồ phòng", HttpStatus.BAD_REQUEST),
    MOVIE_ID_REQUIRED(4001, "Mã phim không được để trống", HttpStatus.BAD_REQUEST),
    SHOWTIME_START_TIME_REQUIRED(4002, "Thời gian bắt đầu không được để trống", HttpStatus.BAD_REQUEST),
    SHOWTIME_END_TIME_REQUIRED(4003, "Thời gian kết thúc không được để trống", HttpStatus.BAD_REQUEST),
    SHOWTIME_TIME_INVALID(4004, "Thời gian kết thúc phải sau thời gian bắt đầu", HttpStatus.BAD_REQUEST),
    SHOWTIME_NORMAL_PRICE_REQUIRED(4005, "Giá ghế thường không được để trống", HttpStatus.BAD_REQUEST),
    SHOWTIME_VIP_PRICE_REQUIRED(4006, "Giá ghế VIP không được để trống", HttpStatus.BAD_REQUEST),
    SHOWTIME_COUPLE_PRICE_REQUIRED(4007, "Giá ghế đôi không được để trống", HttpStatus.BAD_REQUEST),
    SHOWTIME_PRICE_INVALID(4008, "Giá vé phải lớn hơn 0", HttpStatus.BAD_REQUEST),
    SHOWTIME_STATUS_REQUIRED(4009, "Trạng thái suất chiếu không được để trống", HttpStatus.BAD_REQUEST),
    SHOWTIME_NOT_FOUND(4010, "Suất chiếu không tồn tại", HttpStatus.NOT_FOUND),
    SHOWTIME_OVERLAPPED(4011, "Phòng chiếu đã có suất chiếu trùng thời gian", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
