package com.duynam.cinema.dto.response;

import java.time.Instant;

import com.duynam.cinema.constant.SeatStatus;
import com.duynam.cinema.constant.SeatType;
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
public class SeatResponse {
    String id;
    String roomId;
    String roomName;
    String code;
    String rowName;
    Integer columnNumber;
    SeatType type;
    SeatStatus status;
    Instant createdAt;
    Instant updatedAt;
}
