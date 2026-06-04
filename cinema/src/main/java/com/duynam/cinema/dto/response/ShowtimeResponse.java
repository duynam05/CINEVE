package com.duynam.cinema.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

import com.duynam.cinema.constant.MovieStatus;
import com.duynam.cinema.constant.RoomType;
import com.duynam.cinema.constant.ShowtimeStatus;
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
public class ShowtimeResponse {
    String id;
    String movieId;
    String movieTitle;
    MovieStatus movieStatus;
    String cinemaId;
    String cinemaName;
    String roomId;
    String roomName;
    RoomType roomType;
    LocalDateTime startTime;
    LocalDateTime endTime;
    BigDecimal normalSeatPrice;
    BigDecimal vipSeatPrice;
    BigDecimal coupleSeatPrice;
    ShowtimeStatus status;
    Instant createdAt;
    Instant updatedAt;
}
