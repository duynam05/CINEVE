package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.NotificationResponse;
import com.duynam.cinema.service.NotificationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    NotificationService notificationService;

    @GetMapping("/my")
    ApiResponse<List<NotificationResponse>> getMyNotifications() {
        return ApiResponse.<List<NotificationResponse>>builder()
                .result(notificationService.getMyNotifications())
                .build();
    }

    @PutMapping("/{id}/read")
    ApiResponse<NotificationResponse> markAsRead(@PathVariable String id) {
        return ApiResponse.<NotificationResponse>builder()
                .message("Đánh dấu thông báo đã đọc thành công")
                .result(notificationService.markAsRead(id))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteMyNotification(@PathVariable String id) {
        notificationService.deleteMyNotification(id);

        return ApiResponse.<Void>builder()
                .message("Xóa thông báo thành công")
                .build();
    }
}
