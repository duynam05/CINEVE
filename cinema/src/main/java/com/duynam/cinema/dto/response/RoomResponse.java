package com.duynam.cinema.dto.response;

import java.time.Instant;

import com.duynam.cinema.constant.RoomStatus;
import com.duynam.cinema.constant.RoomType;
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
public class RoomResponse {
    String id;
    String cinemaId;
    String cinemaName;
    String name;
    Integer rowCount;
    Integer columnCount;
    RoomType type;
    RoomStatus status;
    Instant createdAt;
    Instant updatedAt;
}
