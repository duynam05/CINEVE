package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.request.GenreRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.GenreResponse;
import com.duynam.cinema.service.GenreService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/genres")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminGenreController {
    GenreService genreService;

    @GetMapping
    ApiResponse<List<GenreResponse>> getGenres() {
        return ApiResponse.<List<GenreResponse>>builder()
                .result(genreService.getAdminGenres())
                .build();
    }

    @PostMapping
    ApiResponse<GenreResponse> createGenre(@RequestBody @Valid GenreRequest request) {
        return ApiResponse.<GenreResponse>builder()
                .message("Thêm thể loại thành công")
                .result(genreService.createGenre(request))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<GenreResponse> updateGenre(@PathVariable String id, @RequestBody @Valid GenreRequest request) {
        return ApiResponse.<GenreResponse>builder()
                .message("Cập nhật thể loại thành công")
                .result(genreService.updateGenre(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> hideGenre(@PathVariable String id) {
        genreService.hideGenre(id);

        return ApiResponse.<Void>builder()
                .message("Ẩn thể loại thành công")
                .build();
    }
}
