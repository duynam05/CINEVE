package com.duynam.cinema.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.request.AuthenticationRequest;
import com.duynam.cinema.dto.request.ChangePasswordRequest;
import com.duynam.cinema.dto.request.ForgotPasswordRequest;
import com.duynam.cinema.dto.request.LogoutRequest;
import com.duynam.cinema.dto.request.RefreshTokenRequest;
import com.duynam.cinema.dto.request.RegisterRequest;
import com.duynam.cinema.dto.request.ResendEmailVerificationRequest;
import com.duynam.cinema.dto.request.ResetPasswordRequest;
import com.duynam.cinema.dto.request.VerifyEmailRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.AuthenticationResponse;
import com.duynam.cinema.dto.response.EmailVerificationResponse;
import com.duynam.cinema.dto.response.ForgotPasswordResponse;
import com.duynam.cinema.dto.response.RegisterResponse;
import com.duynam.cinema.dto.response.UserResponse;
import com.duynam.cinema.service.AuthenticationService;
import com.duynam.cinema.service.UserService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    UserService userService;

    @PostMapping("/register")
    ApiResponse<RegisterResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ApiResponse.<RegisterResponse>builder()
                .message("Đăng ký tài khoản thành công, vui lòng xác thực email")
                .result(userService.register(request))
                .build();
    }

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login(@RequestBody @Valid AuthenticationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .message("Đăng nhập thành công")
                .result(authenticationService.authenticate(request))
                .build();
    }

    @PostMapping("/refresh-token")
    ApiResponse<AuthenticationResponse> refreshToken(@RequestBody @Valid RefreshTokenRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .message("Làm mới token thành công")
                .result(authenticationService.refreshToken(request))
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @RequestBody(required = false) LogoutRequest request
    ) {
        authenticationService.logout(authorizationHeader, request);

        return ApiResponse.<Void>builder()
                .message("Đăng xuất thành công")
                .build();
    }

    @PostMapping("/verify-email")
    ApiResponse<UserResponse> verifyEmail(@RequestBody @Valid VerifyEmailRequest request) {
        return ApiResponse.<UserResponse>builder()
                .message("Xác thực email thành công")
                .result(userService.verifyEmail(request))
                .build();
    }

    @PostMapping("/resend-verification")
    ApiResponse<EmailVerificationResponse> resendVerification(@RequestBody @Valid ResendEmailVerificationRequest request) {
        return ApiResponse.<EmailVerificationResponse>builder()
                .message("Đã tạo lại mã xác thực email")
                .result(userService.resendEmailVerification(request))
                .build();
    }

    @PostMapping("/forgot-password")
    ApiResponse<ForgotPasswordResponse> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        return ApiResponse.<ForgotPasswordResponse>builder()
                .message("Đã tạo reset token")
                .result(userService.forgotPassword(request))
                .build();
    }

    @PostMapping("/reset-password")
    ApiResponse<Void> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        userService.resetPassword(request);

        return ApiResponse.<Void>builder()
                .message("Đặt lại mật khẩu thành công")
                .build();
    }

    @GetMapping("/me")
    ApiResponse<UserResponse> getMyInfo() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @PutMapping("/change-password")
    ApiResponse<Void> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(request);

        return ApiResponse.<Void>builder()
                .message("Đổi mật khẩu thành công")
                .build();
    }
}
