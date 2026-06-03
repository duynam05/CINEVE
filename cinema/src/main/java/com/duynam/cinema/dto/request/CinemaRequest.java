package com.duynam.cinema.dto.request;

import com.duynam.cinema.constant.CinemaStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
public class CinemaRequest {
    @NotBlank(message = "CINEMA_NAME_REQUIRED")
    @Size(min = 2, max = 150, message = "CINEMA_NAME_INVALID")
    String name;

    @NotBlank(message = "CINEMA_ADDRESS_REQUIRED")
    @Size(max = 300, message = "INVALID_KEY")
    String address;

    @NotBlank(message = "CINEMA_CITY_REQUIRED")
    @Size(max = 100, message = "INVALID_KEY")
    String city;

    @Pattern(regexp = "^(|\\d{10,11})$", message = "PHONE_INVALID")
    String phone;

    @Email(message = "EMAIL_INVALID")
    @Size(max = 120, message = "INVALID_KEY")
    String email;

    @Size(max = 500, message = "INVALID_KEY")
    String description;

    @NotNull(message = "CINEMA_STATUS_REQUIRED")
    CinemaStatus status;
}
