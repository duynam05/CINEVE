package com.duynam.cinema.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.ShowtimeResponse;
import com.duynam.cinema.dto.response.ShowtimeSeatMapResponse;
import com.duynam.cinema.service.ShowtimeService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimeController {
    ShowtimeService showtimeService;

    @GetMapping
    ApiResponse<List<ShowtimeResponse>> searchShowtimes(
            @RequestParam(required = false) String movieId,
            @RequestParam(required = false) String cinemaId,
            @RequestParam(required = false) String roomId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ApiResponse.<List<ShowtimeResponse>>builder()
                .result(showtimeService.searchPublicShowtimes(movieId, cinemaId, roomId, date))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<ShowtimeResponse> getShowtime(@PathVariable String id) {
        return ApiResponse.<ShowtimeResponse>builder()
                .result(showtimeService.getPublicShowtime(id))
                .build();
    }

    @GetMapping("/{id}/seats")
    ApiResponse<ShowtimeSeatMapResponse> getShowtimeSeats(@PathVariable String id) {
        return ApiResponse.<ShowtimeSeatMapResponse>builder()
                .result(showtimeService.getShowtimeSeats(id))
                .build();
    }
}
