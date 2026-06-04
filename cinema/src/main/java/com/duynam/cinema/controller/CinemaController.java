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
import com.duynam.cinema.dto.response.CinemaResponse;
import com.duynam.cinema.dto.response.ShowtimeResponse;
import com.duynam.cinema.service.CinemaService;
import com.duynam.cinema.service.ShowtimeService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/cinemas")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CinemaController {
    CinemaService cinemaService;
    ShowtimeService showtimeService;

    @GetMapping
    ApiResponse<List<CinemaResponse>> getCinemas(@RequestParam(required = false) String city) {
        return ApiResponse.<List<CinemaResponse>>builder()
                .result(cinemaService.getPublicCinemas(city))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<CinemaResponse> getCinema(@PathVariable String id) {
        return ApiResponse.<CinemaResponse>builder()
                .result(cinemaService.getPublicCinema(id))
                .build();
    }

    @GetMapping("/{id}/showtimes")
    ApiResponse<List<ShowtimeResponse>> getCinemaShowtimes(
            @PathVariable String id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ApiResponse.<List<ShowtimeResponse>>builder()
                .result(showtimeService.getPublicShowtimesByCinema(id, date))
                .build();
    }
}
