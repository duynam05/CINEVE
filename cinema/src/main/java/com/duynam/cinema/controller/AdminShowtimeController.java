package com.duynam.cinema.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.request.ShowtimeRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.ShowtimeResponse;
import com.duynam.cinema.service.ShowtimeService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/showtimes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminShowtimeController {
    ShowtimeService showtimeService;

    @GetMapping
    ApiResponse<List<ShowtimeResponse>> searchShowtimes(
            @RequestParam(required = false) String movieId,
            @RequestParam(required = false) String cinemaId,
            @RequestParam(required = false) String roomId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ApiResponse.<List<ShowtimeResponse>>builder()
                .result(showtimeService.searchAdminShowtimes(movieId, cinemaId, roomId, date))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<ShowtimeResponse> getShowtime(@PathVariable String id) {
        return ApiResponse.<ShowtimeResponse>builder()
                .result(showtimeService.getAdminShowtime(id))
                .build();
    }

    @PostMapping
    ApiResponse<ShowtimeResponse> createShowtime(@RequestBody @Valid ShowtimeRequest request) {
        return ApiResponse.<ShowtimeResponse>builder()
                .message("Thêm suất chiếu thành công")
                .result(showtimeService.createShowtime(request))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<ShowtimeResponse> updateShowtime(
            @PathVariable String id,
            @RequestBody @Valid ShowtimeRequest request
    ) {
        return ApiResponse.<ShowtimeResponse>builder()
                .message("Cập nhật suất chiếu thành công")
                .result(showtimeService.updateShowtime(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> cancelShowtime(@PathVariable String id) {
        showtimeService.cancelShowtime(id);

        return ApiResponse.<Void>builder()
                .message("Hủy suất chiếu thành công")
                .build();
    }
}
