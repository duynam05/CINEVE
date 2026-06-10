package com.duynam.cinema.dto.response;

import java.math.BigDecimal;

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
public class BookingSeatResponse {
    String id;
    String seatId;
    String code;
    String rowName;
    Integer columnNumber;
    SeatType type;
    BigDecimal price;
}
