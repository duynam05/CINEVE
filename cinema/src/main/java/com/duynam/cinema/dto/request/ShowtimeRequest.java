package com.duynam.cinema.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.duynam.cinema.constant.ShowtimeStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
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
public class ShowtimeRequest {
    @NotBlank(message = "MOVIE_ID_REQUIRED")
    String movieId;

    @NotBlank(message = "ROOM_ID_REQUIRED")
    String roomId;

    @NotNull(message = "SHOWTIME_START_TIME_REQUIRED")
    LocalDateTime startTime;

    @NotNull(message = "SHOWTIME_END_TIME_REQUIRED")
    LocalDateTime endTime;

    @NotNull(message = "SHOWTIME_NORMAL_PRICE_REQUIRED")
    @DecimalMin(value = "0.0", inclusive = false, message = "SHOWTIME_PRICE_INVALID")
    BigDecimal normalSeatPrice;

    @NotNull(message = "SHOWTIME_VIP_PRICE_REQUIRED")
    @DecimalMin(value = "0.0", inclusive = false, message = "SHOWTIME_PRICE_INVALID")
    BigDecimal vipSeatPrice;

    @NotNull(message = "SHOWTIME_COUPLE_PRICE_REQUIRED")
    @DecimalMin(value = "0.0", inclusive = false, message = "SHOWTIME_PRICE_INVALID")
    BigDecimal coupleSeatPrice;

    @NotNull(message = "SHOWTIME_STATUS_REQUIRED")
    ShowtimeStatus status;
}
