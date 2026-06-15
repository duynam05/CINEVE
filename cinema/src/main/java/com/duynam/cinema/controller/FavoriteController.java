package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.FavoriteResponse;
import com.duynam.cinema.service.FavoriteService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteController {
    FavoriteService favoriteService;

    @GetMapping
    ApiResponse<List<FavoriteResponse>> getMyFavorites() {
        return ApiResponse.<List<FavoriteResponse>>builder()
                .result(favoriteService.getMyFavorites())
                .build();
    }

    @PostMapping("/{movieId}")
    ApiResponse<FavoriteResponse> addFavorite(@PathVariable String movieId) {
        return ApiResponse.<FavoriteResponse>builder()
                .message("Thêm phim yêu thích thành công")
                .result(favoriteService.addFavorite(movieId))
                .build();
    }

    @DeleteMapping("/{movieId}")
    ApiResponse<Void> removeFavorite(@PathVariable String movieId) {
        favoriteService.removeFavorite(movieId);

        return ApiResponse.<Void>builder()
                .message("Xóa phim khỏi danh sách yêu thích thành công")
                .build();
    }
}
