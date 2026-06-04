package com.duynam.cinema.dto.response;

import com.duynam.cinema.constant.SeatStatus;
import com.duynam.cinema.constant.SeatType;
import com.duynam.cinema.constant.ShowtimeSeatStatus;
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
public class ShowtimeSeatResponse {
    String id;
    String code;
    String rowName;
    Integer columnNumber;
    SeatType type;
    SeatStatus seatStatus;
    ShowtimeSeatStatus showtimeSeatStatus;
}
