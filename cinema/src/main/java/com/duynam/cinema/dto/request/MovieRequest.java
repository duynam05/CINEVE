package com.duynam.cinema.dto.request;

import java.time.LocalDate;
import java.util.Set;

import com.duynam.cinema.constant.MovieStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class MovieRequest {
    @NotBlank(message = "MOVIE_TITLE_REQUIRED")
    @Size(min = 2, max = 180, message = "MOVIE_TITLE_INVALID")
    String title;

    String description;

    @NotNull(message = "MOVIE_DURATION_REQUIRED")
    @Min(value = 1, message = "MOVIE_DURATION_INVALID")
    Integer durationMinutes;

    @Size(max = 150, message = "INVALID_KEY")
    String director;

    @Size(max = 1000, message = "INVALID_KEY")
    String actors;

    @Size(max = 80, message = "INVALID_KEY")
    String language;

    @Size(max = 80, message = "INVALID_KEY")
    String country;

    @Size(max = 20, message = "INVALID_KEY")
    String ageRating;

    LocalDate releaseDate;

    @Size(max = 500, message = "INVALID_KEY")
    String posterUrl;

    @Size(max = 500, message = "INVALID_KEY")
    String trailerUrl;

    @NotNull(message = "MOVIE_STATUS_REQUIRED")
    MovieStatus status;

    Set<String> genreIds;
}
