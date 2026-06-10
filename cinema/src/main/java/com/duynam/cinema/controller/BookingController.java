package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.request.BookingRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.BookingResponse;
import com.duynam.cinema.dto.response.TicketResponse;
import com.duynam.cinema.service.BookingService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {
    BookingService bookingService;

    @PostMapping
    ApiResponse<BookingResponse> createBooking(@RequestBody @Valid BookingRequest request) {
        return ApiResponse.<BookingResponse>builder()
                .message("Đặt vé thành công")
                .result(bookingService.createBooking(request))
                .build();
    }

    @GetMapping("/my")
    ApiResponse<List<BookingResponse>> getMyBookings() {
        return ApiResponse.<List<BookingResponse>>builder()
                .result(bookingService.getMyBookings())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<BookingResponse> getMyBooking(@PathVariable String id) {
        return ApiResponse.<BookingResponse>builder()
                .result(bookingService.getMyBooking(id))
                .build();
    }

    @GetMapping("/{id}/ticket")
    ApiResponse<TicketResponse> getMyTicket(@PathVariable String id) {
        return ApiResponse.<TicketResponse>builder()
                .result(bookingService.getMyTicket(id))
                .build();
    }

    @PutMapping("/{id}/cancel")
    ApiResponse<BookingResponse> cancelMyBooking(@PathVariable String id) {
        return ApiResponse.<BookingResponse>builder()
                .message("Hủy vé thành công")
                .result(bookingService.cancelMyBooking(id))
                .build();
    }
}
