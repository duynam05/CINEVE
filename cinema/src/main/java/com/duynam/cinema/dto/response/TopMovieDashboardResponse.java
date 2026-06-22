package com.duynam.cinema.dto.response;

import java.math.BigDecimal;

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
public class TopMovieDashboardResponse {
    String movieId;
    String movieTitle;
    long ticketsSold;
    BigDecimal seatRevenue;
}
