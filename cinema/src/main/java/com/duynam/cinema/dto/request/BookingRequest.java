package com.duynam.cinema.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class BookingRequest {
    @NotBlank(message = "SHOWTIME_ID_REQUIRED")
    String showtimeId;

    @NotEmpty(message = "BOOKING_SEATS_REQUIRED")
    List<@NotBlank(message = "SEAT_ID_REQUIRED") String> seatIds;

    @Valid
    List<BookingFoodRequest> foods;

    String couponCode;
}
