package com.duynam.cinema.dto.response;

import java.util.List;

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
public class ShowtimeSeatMapResponse {
    String showtimeId;
    ShowtimeStatus showtimeStatus;
    String movieId;
    String movieTitle;
    String cinemaId;
    String cinemaName;
    String roomId;
    String roomName;
    Integer rowCount;
    Integer columnCount;
    List<ShowtimeSeatResponse> seats;
}
