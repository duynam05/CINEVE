package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.GenreResponse;
import com.duynam.cinema.service.GenreService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenreController {
    GenreService genreService;

    @GetMapping
    ApiResponse<List<GenreResponse>> getGenres() {
        return ApiResponse.<List<GenreResponse>>builder()
                .result(genreService.getPublicGenres())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<GenreResponse> getGenre(@PathVariable String id) {
        return ApiResponse.<GenreResponse>builder()
                .result(genreService.getPublicGenre(id))
                .build();
    }
}
