package com.duynam.cinema.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class GenreRequest {
    @NotBlank(message = "GENRE_NAME_REQUIRED")
    @Size(min = 2, max = 100, message = "GENRE_NAME_INVALID")
    String name;

    @Size(max = 500, message = "INVALID_KEY")
    String description;
}
