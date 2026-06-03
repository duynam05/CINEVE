package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.constant.UserStatus;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.UserResponse;
import com.duynam.cinema.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminUserController {
    UserService userService;

    @GetMapping
    ApiResponse<List<UserResponse>> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String role
    ) {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAdminUsers(keyword, status, role))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<UserResponse> getUser(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getAdminUser(id))
                .build();
    }

    @PutMapping("/{id}/lock")
    ApiResponse<UserResponse> lockUser(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .message("Khóa tài khoản thành công")
                .result(userService.lockUser(id))
                .build();
    }

    @PutMapping("/{id}/unlock")
    ApiResponse<UserResponse> unlockUser(@PathVariable String id) {
        return ApiResponse.<UserResponse>builder()
                .message("Mở khóa tài khoản thành công")
                .result(userService.unlockUser(id))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> disableUser(@PathVariable String id) {
        userService.disableUser(id);

        return ApiResponse.<Void>builder()
                .message("Vô hiệu hóa tài khoản thành công")
                .build();
    }
}
