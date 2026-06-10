package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.TicketResponse;
import com.duynam.cinema.service.BookingService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/tickets")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminTicketController {
    BookingService bookingService;

    @GetMapping
    ApiResponse<List<TicketResponse>> getTickets() {
        return ApiResponse.<List<TicketResponse>>builder()
                .result(bookingService.getAdminTickets())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<TicketResponse> getTicket(@PathVariable String id) {
        return ApiResponse.<TicketResponse>builder()
                .result(bookingService.getAdminTicket(id))
                .build();
    }

    @PutMapping("/{id}/used")
    ApiResponse<TicketResponse> markTicketUsed(@PathVariable String id) {
        return ApiResponse.<TicketResponse>builder()
                .message("Đánh dấu vé đã sử dụng thành công")
                .result(bookingService.markTicketUsed(id))
                .build();
    }
}
