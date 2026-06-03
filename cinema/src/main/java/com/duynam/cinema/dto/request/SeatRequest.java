package com.duynam.cinema.dto.request;

import com.duynam.cinema.constant.SeatStatus;
import com.duynam.cinema.constant.SeatType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
public class SeatRequest {
    @NotBlank(message = "ROOM_ID_REQUIRED")
    String roomId;

    @NotBlank(message = "SEAT_ROW_REQUIRED")
    @Pattern(regexp = "^[A-Z]{1,2}$", message = "SEAT_ROW_INVALID")
    String rowName;

    @NotNull(message = "SEAT_COLUMN_REQUIRED")
    @Min(value = 1, message = "SEAT_COLUMN_INVALID")
    @Max(value = 50, message = "SEAT_COLUMN_INVALID")
    Integer columnNumber;

    @NotNull(message = "SEAT_TYPE_REQUIRED")
    SeatType type;

    @NotNull(message = "SEAT_STATUS_REQUIRED")
    SeatStatus status;
}
