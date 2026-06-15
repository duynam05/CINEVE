package com.duynam.cinema.dto.response;

import java.time.Instant;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    String id;
    String movieId;
    String movieTitle;
    String userId;
    String userFullName;
    Integer rating;
    String content;
    Boolean visible;
    Instant createdAt;
    Instant updatedAt;
}
