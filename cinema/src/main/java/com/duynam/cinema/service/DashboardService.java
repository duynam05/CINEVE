package com.duynam.cinema.service;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;

import org.springframework.stereotype.Service;

import com.duynam.cinema.constant.BookingStatus;
import com.duynam.cinema.constant.PaymentMethod;
import com.duynam.cinema.constant.TicketStatus;
import com.duynam.cinema.dto.response.BookingStatusDashboardResponse;
import com.duynam.cinema.dto.response.DashboardSummaryResponse;
import com.duynam.cinema.dto.response.PaymentMethodDashboardResponse;
import com.duynam.cinema.dto.response.RevenueByDayResponse;
import com.duynam.cinema.dto.response.RevenueByMonthResponse;
import com.duynam.cinema.dto.response.TopMovieDashboardResponse;
import com.duynam.cinema.repository.BookingRepository;
import com.duynam.cinema.repository.BookingSeatRepository;
import com.duynam.cinema.repository.CinemaRepository;
import com.duynam.cinema.repository.MovieRepository;
import com.duynam.cinema.repository.PaymentRepository;
import com.duynam.cinema.repository.RoomRepository;
import com.duynam.cinema.repository.ShowtimeRepository;
import com.duynam.cinema.repository.TicketRepository;
import com.duynam.cinema.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardService {
    private static final int DEFAULT_REVENUE_DAYS = 30;
    private static final int DEFAULT_REVENUE_MONTHS = 12;
    private static final int DEFAULT_TOP_MOVIE_LIMIT = 5;

    UserRepository userRepository;
    MovieRepository movieRepository;
    CinemaRepository cinemaRepository;
    RoomRepository roomRepository;
    ShowtimeRepository showtimeRepository;
    BookingRepository bookingRepository;
    BookingSeatRepository bookingSeatRepository;
    PaymentRepository paymentRepository;
    TicketRepository ticketRepository;

    public DashboardSummaryResponse getSummary() {
        LocalDate today = LocalDate.now();
        YearMonth thisMonth = YearMonth.from(today);

        return DashboardSummaryResponse.builder()
                .totalUsers(userRepository.count())
                .totalMovies(movieRepository.count())
                .totalCinemas(cinemaRepository.count())
                .totalRooms(roomRepository.count())
                .totalShowtimes(showtimeRepository.count())
                .totalBookings(bookingRepository.count())
                .totalTicketsSold(ticketRepository.countByStatusIn(List.of(TicketStatus.ACTIVE, TicketStatus.USED)))
                .totalRevenue(nullToZero(paymentRepository.sumSuccessRevenue()))
                .todayRevenue(nullToZero(paymentRepository.sumSuccessRevenueBetween(startOfDay(today), startOfDay(today.plusDays(1)))))
                .thisMonthRevenue(nullToZero(paymentRepository.sumSuccessRevenueBetween(
                        startOfDay(thisMonth.atDay(1)),
                        startOfDay(thisMonth.plusMonths(1).atDay(1)))))
                .cancelledBookings(bookingRepository.countByStatus(BookingStatus.CANCELLED))
                .build();
    }

    public List<RevenueByDayResponse> getRevenueByDay(LocalDate fromDate, LocalDate toDate) {
        LocalDate toExclusive = toDate == null ? LocalDate.now().plusDays(1) : toDate.plusDays(1);
        LocalDate from = fromDate == null ? toExclusive.minusDays(DEFAULT_REVENUE_DAYS) : fromDate;

        return paymentRepository.sumSuccessRevenueByDay(startOfDay(from), startOfDay(toExclusive)).stream()
                .map(row -> RevenueByDayResponse.builder()
                        .date(toLocalDate(row[0]))
                        .revenue(nullToZero((BigDecimal) row[1]))
                        .build())
                .toList();
    }

    public List<RevenueByMonthResponse> getRevenueByMonth(LocalDate fromDate, LocalDate toDate) {
        YearMonth currentMonth = YearMonth.now();
        LocalDate toExclusive = toDate == null
                ? currentMonth.plusMonths(1).atDay(1)
                : YearMonth.from(toDate).plusMonths(1).atDay(1);
        LocalDate from = fromDate == null
                ? YearMonth.from(toExclusive.minusDays(1)).minusMonths(DEFAULT_REVENUE_MONTHS - 1).atDay(1)
                : YearMonth.from(fromDate).atDay(1);

        return paymentRepository.sumSuccessRevenueByMonth(startOfDay(from), startOfDay(toExclusive)).stream()
                .map(row -> RevenueByMonthResponse.builder()
                        .year(toInt(row[0]))
                        .month(toInt(row[1]))
                        .revenue(nullToZero((BigDecimal) row[2]))
                        .build())
                .toList();
    }

    public List<TopMovieDashboardResponse> getTopMovies(Integer limit) {
        int resolvedLimit = limit == null || limit <= 0 ? DEFAULT_TOP_MOVIE_LIMIT : limit;

        return bookingSeatRepository.findTopMoviesByTicketsSold().stream()
                .limit(resolvedLimit)
                .map(row -> TopMovieDashboardResponse.builder()
                        .movieId((String) row[0])
                        .movieTitle((String) row[1])
                        .ticketsSold(((Number) row[2]).longValue())
                        .seatRevenue(nullToZero((BigDecimal) row[3]))
                        .build())
                .toList();
    }

    public List<BookingStatusDashboardResponse> getBookingStatusStats() {
        return bookingRepository.countBookingsByStatus().stream()
                .map(row -> BookingStatusDashboardResponse.builder()
                        .status((BookingStatus) row[0])
                        .count(((Number) row[1]).longValue())
                        .build())
                .toList();
    }

    public List<PaymentMethodDashboardResponse> getPaymentMethodStats() {
        return paymentRepository.countPaymentsByMethod().stream()
                .map(row -> PaymentMethodDashboardResponse.builder()
                        .method((PaymentMethod) row[0])
                        .count(((Number) row[1]).longValue())
                        .build())
                .toList();
    }

    private Instant startOfDay(LocalDate date) {
        return date.atStartOfDay(ZoneId.systemDefault()).toInstant();
    }

    private BigDecimal nullToZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate localDate) {
            return localDate;
        }
        if (value instanceof Date date) {
            return date.toLocalDate();
        }
        if (value instanceof java.util.Date date) {
            return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }

        return LocalDate.parse(value.toString());
    }

    private int toInt(Object value) {
        return ((Number) value).intValue();
    }
}
