package com.duynam.cinema.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

import com.duynam.cinema.constant.MovieStatus;
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
public class MovieResponse {
    String id;
    String title;
    String slug;
    String description;
    Integer durationMinutes;
    String director;
    String actors;
    String language;
    String country;
    String ageRating;
    LocalDate releaseDate;
    String posterUrl;
    String trailerUrl;
    MovieStatus status;
    Set<GenreResponse> genres;
    Instant createdAt;
    Instant updatedAt;
}
