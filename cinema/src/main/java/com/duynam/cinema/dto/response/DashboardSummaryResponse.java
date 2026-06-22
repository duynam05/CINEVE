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
public class DashboardSummaryResponse {
    long totalUsers;
    long totalMovies;
    long totalCinemas;
    long totalRooms;
    long totalShowtimes;
    long totalBookings;
    long totalTicketsSold;
    BigDecimal totalRevenue;
    BigDecimal todayRevenue;
    BigDecimal thisMonthRevenue;
    long cancelledBookings;
}
