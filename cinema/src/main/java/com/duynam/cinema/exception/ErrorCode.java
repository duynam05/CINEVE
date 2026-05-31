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
    RESET_TOKEN_INVALID_OR_EXPIRED(1026, "Reset token không hợp lệ hoặc đã hết hạn", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
