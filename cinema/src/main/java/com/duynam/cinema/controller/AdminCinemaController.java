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

import com.duynam.cinema.constant.CinemaStatus;
import com.duynam.cinema.dto.request.CinemaRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.CinemaResponse;
import com.duynam.cinema.service.CinemaService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/cinemas")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminCinemaController {
    CinemaService cinemaService;

    @GetMapping
    ApiResponse<List<CinemaResponse>> getCinemas() {
        return ApiResponse.<List<CinemaResponse>>builder()
                .result(cinemaService.getAdminCinemas())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<CinemaResponse> getCinema(@PathVariable String id) {
        return ApiResponse.<CinemaResponse>builder()
                .result(cinemaService.getAdminCinema(id))
                .build();
    }

    @PostMapping
    ApiResponse<CinemaResponse> createCinema(@RequestBody @Valid CinemaRequest request) {
        return ApiResponse.<CinemaResponse>builder()
                .message("Thêm rạp thành công")
                .result(cinemaService.createCinema(request))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<CinemaResponse> updateCinema(@PathVariable String id, @RequestBody @Valid CinemaRequest request) {
        return ApiResponse.<CinemaResponse>builder()
                .message("Cập nhật rạp thành công")
                .result(cinemaService.updateCinema(id, request))
                .build();
    }

    @PatchMapping("/{id}/status")
    ApiResponse<CinemaResponse> updateCinemaStatus(@PathVariable String id, @RequestParam CinemaStatus status) {
        return ApiResponse.<CinemaResponse>builder()
                .message("Cập nhật trạng thái rạp thành công")
                .result(cinemaService.updateCinemaStatus(id, status))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> hideCinema(@PathVariable String id) {
        cinemaService.hideCinema(id);

        return ApiResponse.<Void>builder()
                .message("Ẩn rạp thành công")
                .build();
    }
}
