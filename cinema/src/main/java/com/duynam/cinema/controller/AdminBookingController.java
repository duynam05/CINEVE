package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.constant.BookingStatus;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.BookingResponse;
import com.duynam.cinema.service.BookingService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminBookingController {
    BookingService bookingService;

    @GetMapping
    ApiResponse<List<BookingResponse>> searchBookings(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BookingStatus status
    ) {
        return ApiResponse.<List<BookingResponse>>builder()
                .result(bookingService.searchAdminBookings(keyword, status))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<BookingResponse> getBooking(@PathVariable String id) {
        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.getAdminBooking(id))
                .build();
    }

    @PutMapping("/{id}/confirm")
    ApiResponse<BookingResponse> confirmBooking(@PathVariable String id) {
        return ApiResponse.<BookingResponse>builder()
                .message("Xác nhận booking thành công")
                .result(bookingService.confirmAdminBooking(id))
                .build();
    }

    @PutMapping("/{id}/cancel")
    ApiResponse<BookingResponse> cancelBooking(@PathVariable String id) {
        return ApiResponse.<BookingResponse>builder()
                .message("Hủy booking thành công")
                .result(bookingService.cancelAdminBooking(id))
                .build();
    }

    @PutMapping("/{id}/refund")
    ApiResponse<BookingResponse> refundBooking(@PathVariable String id) {
        return ApiResponse.<BookingResponse>builder()
                .message("Hoàn tiền giả lập thành công")
                .result(bookingService.refundAdminBooking(id))
                .build();
    }
}
