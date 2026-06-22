package com.duynam.cinema.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.BookingStatusDashboardResponse;
import com.duynam.cinema.dto.response.DashboardSummaryResponse;
import com.duynam.cinema.dto.response.PaymentMethodDashboardResponse;
import com.duynam.cinema.dto.response.RevenueByDayResponse;
import com.duynam.cinema.dto.response.RevenueByMonthResponse;
import com.duynam.cinema.dto.response.TopMovieDashboardResponse;
import com.duynam.cinema.service.DashboardService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminDashboardController {
    DashboardService dashboardService;

    @GetMapping("/summary")
    ApiResponse<DashboardSummaryResponse> getSummary() {
        return ApiResponse.<DashboardSummaryResponse>builder()
                .result(dashboardService.getSummary())
                .build();
    }

    @GetMapping("/revenue-by-day")
    ApiResponse<List<RevenueByDayResponse>> getRevenueByDay(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ApiResponse.<List<RevenueByDayResponse>>builder()
                .result(dashboardService.getRevenueByDay(fromDate, toDate))
                .build();
    }

    @GetMapping("/revenue-by-month")
    ApiResponse<List<RevenueByMonthResponse>> getRevenueByMonth(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return ApiResponse.<List<RevenueByMonthResponse>>builder()
                .result(dashboardService.getRevenueByMonth(fromDate, toDate))
                .build();
    }

    @GetMapping("/top-movies")
    ApiResponse<List<TopMovieDashboardResponse>> getTopMovies(
            @RequestParam(required = false) Integer limit
    ) {
        return ApiResponse.<List<TopMovieDashboardResponse>>builder()
                .result(dashboardService.getTopMovies(limit))
                .build();
    }

    @GetMapping("/booking-status")
    ApiResponse<List<BookingStatusDashboardResponse>> getBookingStatusStats() {
        return ApiResponse.<List<BookingStatusDashboardResponse>>builder()
                .result(dashboardService.getBookingStatusStats())
                .build();
    }

    @GetMapping("/payment-methods")
    ApiResponse<List<PaymentMethodDashboardResponse>> getPaymentMethodStats() {
        return ApiResponse.<List<PaymentMethodDashboardResponse>>builder()
                .result(dashboardService.getPaymentMethodStats())
                .build();
    }
}
