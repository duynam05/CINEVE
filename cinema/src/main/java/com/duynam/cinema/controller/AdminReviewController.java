package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.ReviewResponse;
import com.duynam.cinema.service.ReviewService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminReviewController {
    ReviewService reviewService;

    @GetMapping
    ApiResponse<List<ReviewResponse>> searchReviews(
            @RequestParam(required = false) String movieId,
            @RequestParam(required = false) Integer rating
    ) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .result(reviewService.searchAdminReviews(movieId, rating))
                .build();
    }

    @PatchMapping("/{id}/hide")
    ApiResponse<ReviewResponse> hideReview(@PathVariable String id) {
        return ApiResponse.<ReviewResponse>builder()
                .message("Ẩn đánh giá thành công")
                .result(reviewService.hideAdminReview(id))
                .build();
    }

    @PatchMapping("/{id}/show")
    ApiResponse<ReviewResponse> showReview(@PathVariable String id) {
        return ApiResponse.<ReviewResponse>builder()
                .message("Hiển thị đánh giá thành công")
                .result(reviewService.showAdminReview(id))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteAdminReview(id);

        return ApiResponse.<Void>builder()
                .message("Xóa đánh giá thành công")
                .build();
    }
}
