package com.duynam.cinema.mapper;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.response.ReviewResponse;
import com.duynam.cinema.entity.Review;

@Component
public class ReviewMapper {
    public ReviewResponse toReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .movieId(review.getMovie().getId())
                .movieTitle(review.getMovie().getTitle())
                .userId(review.getUser().getId())
                .userFullName(review.getUser().getFullName())
                .rating(review.getRating())
                .content(review.getContent())
                .visible(review.getVisible())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
