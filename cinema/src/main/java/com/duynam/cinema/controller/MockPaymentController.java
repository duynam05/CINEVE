package com.duynam.cinema.controller;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.PaymentResponse;
import com.duynam.cinema.service.BookingService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Profile({"dev", "test"})
public class MockPaymentController {
    BookingService bookingService;

    @PostMapping("/fake-success")
    ApiResponse<PaymentResponse> fakeSuccess(@RequestParam String paymentId) {
        return ApiResponse.<PaymentResponse>builder()
                .message("Giả lập thanh toán thành công (Dev/Test only)")
                .result(bookingService.fakeSuccess(paymentId))
                .build();
    }

    @PostMapping("/fake-failed")
    ApiResponse<PaymentResponse> fakeFailed(@RequestParam String paymentId) {
        return ApiResponse.<PaymentResponse>builder()
                .message("Giả lập thanh toán thất bại (Dev/Test only)")
                .result(bookingService.fakeFailed(paymentId))
                .build();
    }
}
