package com.duynam.cinema.dto.request;

import com.duynam.cinema.constant.RoomStatus;
import com.duynam.cinema.constant.RoomType;
import jakarta.validation.constraints.Max;
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
public class RoomRequest {
    @NotBlank(message = "CINEMA_ID_REQUIRED")
    String cinemaId;

    @NotBlank(message = "ROOM_NAME_REQUIRED")
    @Size(min = 1, max = 100, message = "ROOM_NAME_INVALID")
    String name;

    @NotNull(message = "ROOM_ROW_COUNT_REQUIRED")
    @Min(value = 1, message = "ROOM_SIZE_INVALID")
    @Max(value = 26, message = "ROOM_SIZE_INVALID")
    Integer rowCount;

    @NotNull(message = "ROOM_COLUMN_COUNT_REQUIRED")
    @Min(value = 1, message = "ROOM_SIZE_INVALID")
    @Max(value = 50, message = "ROOM_SIZE_INVALID")
    Integer columnCount;

    @NotNull(message = "ROOM_TYPE_REQUIRED")
    RoomType type;

    @NotNull(message = "ROOM_STATUS_REQUIRED")
    RoomStatus status;
}
