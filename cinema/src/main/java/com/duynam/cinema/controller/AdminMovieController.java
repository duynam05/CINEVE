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
import org.springframework.web.multipart.MultipartFile;

import com.duynam.cinema.constant.MovieStatus;
import com.duynam.cinema.dto.request.MovieRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.MovieResponse;
import com.duynam.cinema.service.MovieService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/movies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminMovieController {
    MovieService movieService;

    @GetMapping
    ApiResponse<List<MovieResponse>> getMovies() {
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieService.getAdminMovies())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<MovieResponse> getMovie(@PathVariable String id) {
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.getAdminMovie(id))
                .build();
    }

    @PostMapping
    ApiResponse<MovieResponse> createMovie(@RequestBody @Valid MovieRequest request) {
        return ApiResponse.<MovieResponse>builder()
                .message("Thêm phim thành công")
                .result(movieService.createMovie(request))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<MovieResponse> updateMovie(@PathVariable String id, @RequestBody @Valid MovieRequest request) {
        return ApiResponse.<MovieResponse>builder()
                .message("Cập nhật phim thành công")
                .result(movieService.updateMovie(id, request))
                .build();
    }

    @PatchMapping("/{id}/status")
    ApiResponse<MovieResponse> updateMovieStatus(@PathVariable String id, @RequestParam MovieStatus status) {
        return ApiResponse.<MovieResponse>builder()
                .message("Cập nhật trạng thái phim thành công")
                .result(movieService.updateMovieStatus(id, status))
                .build();
    }

    @PostMapping("/{id}/poster")
    ApiResponse<MovieResponse> uploadPoster(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ApiResponse.<MovieResponse>builder()
                .message("Upload poster phim thành công")
                .result(movieService.uploadPoster(id, file))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> hideMovie(@PathVariable String id) {
        movieService.hideMovie(id);

        return ApiResponse.<Void>builder()
                .message("Ẩn phim thành công")
                .build();
    }
}
