package com.duynam.cinema.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.request.PaymentRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.PaymentResponse;
import com.duynam.cinema.service.BookingService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    BookingService bookingService;

    @PostMapping("/create")
    ApiResponse<PaymentResponse> createPayment(@RequestBody @Valid PaymentRequest request) {
        return ApiResponse.<PaymentResponse>builder()
                .message("Tạo thanh toán thành công")
                .result(bookingService.createPayment(request))
                .build();
    }

    @PostMapping("/fake-success")
    ApiResponse<PaymentResponse> fakeSuccess(@RequestParam String paymentId) {
        return ApiResponse.<PaymentResponse>builder()
                .message("Giả lập thanh toán thành công")
                .result(bookingService.fakeSuccess(paymentId))
                .build();
    }

    @PostMapping("/fake-failed")
    ApiResponse<PaymentResponse> fakeFailed(@RequestParam String paymentId) {
        return ApiResponse.<PaymentResponse>builder()
                .message("Giả lập thanh toán thất bại")
                .result(bookingService.fakeFailed(paymentId))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<PaymentResponse> getMyPayment(@PathVariable String id) {
        return ApiResponse.<PaymentResponse>builder()
                .result(bookingService.getMyPayment(id))
                .build();
    }
}
