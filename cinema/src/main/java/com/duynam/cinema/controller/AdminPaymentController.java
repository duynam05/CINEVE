package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.constant.PaymentMethod;
import com.duynam.cinema.constant.PaymentStatus;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.PaymentResponse;
import com.duynam.cinema.service.BookingService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminPaymentController {
    BookingService bookingService;

    @GetMapping
    ApiResponse<List<PaymentResponse>> searchPayments(
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) PaymentMethod method
    ) {
        return ApiResponse.<List<PaymentResponse>>builder()
                .result(bookingService.searchAdminPayments(status, method))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<PaymentResponse> getPayment(@PathVariable String id) {
        return ApiResponse.<PaymentResponse>builder()
                .result(bookingService.getAdminPayment(id))
                .build();
    }
}
