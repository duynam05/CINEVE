package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.constant.MovieStatus;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.MovieResponse;
import com.duynam.cinema.dto.response.MovieTrailerResponse;
import com.duynam.cinema.service.MovieService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieController {
    MovieService movieService;

    @GetMapping
    ApiResponse<List<MovieResponse>> searchMovies(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String genreId,
            @RequestParam(required = false) MovieStatus status,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String country
    ) {
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieService.searchPublicMovies(keyword, genreId, status, language, country))
                .build();
    }

    @GetMapping("/now-showing")
    ApiResponse<List<MovieResponse>> getNowShowingMovies() {
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieService.getNowShowingMovies())
                .build();
    }

    @GetMapping("/coming-soon")
    ApiResponse<List<MovieResponse>> getComingSoonMovies() {
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieService.getComingSoonMovies())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<MovieResponse> getMovie(@PathVariable String id) {
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.getPublicMovie(id))
                .build();
    }

    @GetMapping("/{id}/trailer")
    ApiResponse<MovieTrailerResponse> getMovieTrailer(@PathVariable String id) {
        return ApiResponse.<MovieTrailerResponse>builder()
                .result(movieService.getMovieTrailer(id))
                .build();
    }
}
