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

import com.duynam.cinema.dto.request.ReviewRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.ReviewResponse;
import com.duynam.cinema.service.ReviewService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {
    ReviewService reviewService;

    @GetMapping("/api/movies/{movieId}/reviews")
    ApiResponse<List<ReviewResponse>> getMovieReviews(@PathVariable String movieId) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.getPublicMovieReviews(movieId))
                .build();
    }

    @PostMapping("/api/movies/{movieId}/reviews")
    ApiResponse<ReviewResponse> createReview(
            @PathVariable String movieId,
            @RequestBody @Valid ReviewRequest request
    ) {
        return ApiResponse.<ReviewResponse>builder()
                .message("Đánh giá phim thành công")
                .result(reviewService.createReview(movieId, request))
                .build();
    }

    @PutMapping("/api/reviews/{id}")
    ApiResponse<ReviewResponse> updateMyReview(@PathVariable String id, @RequestBody @Valid ReviewRequest request) {
        return ApiResponse.<ReviewResponse>builder()
                .message("Cập nhật đánh giá thành công")
                .result(reviewService.updateMyReview(id, request))
                .build();
    }

    @DeleteMapping("/api/reviews/{id}")
    ApiResponse<Void> deleteMyReview(@PathVariable String id) {
        reviewService.deleteMyReview(id);

        return ApiResponse.<Void>builder()
                .message("Xóa đánh giá thành công")
                .build();
    }
}
