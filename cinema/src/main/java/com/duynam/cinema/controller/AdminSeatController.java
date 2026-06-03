package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.constant.SeatStatus;
import com.duynam.cinema.dto.request.SeatRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.SeatResponse;
import com.duynam.cinema.service.SeatService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/seats")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminSeatController {
    SeatService seatService;

    @GetMapping
    ApiResponse<List<SeatResponse>> getSeats(@RequestParam String roomId) {
        return ApiResponse.<List<SeatResponse>>builder()
                .result(seatService.getSeatsByRoom(roomId))
                .build();
    }

    @PostMapping
    ApiResponse<SeatResponse> createSeat(@RequestBody @Valid SeatRequest request) {
        return ApiResponse.<SeatResponse>builder()
                .message("Thêm ghế thành công")
                .result(seatService.createSeat(request))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<SeatResponse> updateSeat(@PathVariable String id, @RequestBody @Valid SeatRequest request) {
        return ApiResponse.<SeatResponse>builder()
                .message("Cập nhật ghế thành công")
                .result(seatService.updateSeat(id, request))
                .build();
    }

    @PatchMapping("/{id}/status")
    ApiResponse<SeatResponse> updateSeatStatus(@PathVariable String id, @RequestParam SeatStatus status) {
        return ApiResponse.<SeatResponse>builder()
                .message("Cập nhật trạng thái ghế thành công")
                .result(seatService.updateSeatStatus(id, status))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> hideSeat(@PathVariable String id) {
        seatService.hideSeat(id);

        return ApiResponse.<Void>builder()
                .message("Ẩn ghế thành công")
                .build();
    }
}
