package com.duynam.cinema.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.entity.BookingSeat;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, String> {
    List<BookingSeat> findAllByBookingId(String bookingId);

    @Query("""
            select bs from BookingSeat bs
            where bs.showtime.id = :showtimeId
              and bs.booking.status in (
                    com.duynam.cinema.constant.BookingStatus.PENDING,
                    com.duynam.cinema.constant.BookingStatus.CONFIRMED,
                    com.duynam.cinema.constant.BookingStatus.COMPLETED
              )
              and bs.seat.id in :seatIds
            """)
    List<BookingSeat> findActiveBookedSeats(
            @Param("showtimeId") String showtimeId,
            @Param("seatIds") Collection<String> seatIds);

    @Query("""
            select bs.seat.id from BookingSeat bs
            where bs.showtime.id = :showtimeId
              and bs.booking.status in (
                    com.duynam.cinema.constant.BookingStatus.PENDING,
                    com.duynam.cinema.constant.BookingStatus.CONFIRMED,
                    com.duynam.cinema.constant.BookingStatus.COMPLETED
              )
            """)
    List<String> findActiveBookedSeatIdsByShowtimeId(@Param("showtimeId") String showtimeId);

    @Query("""
            select bs.showtime.movie.id, bs.showtime.movie.title, count(bs), coalesce(sum(bs.price), 0)
            from BookingSeat bs
            where bs.booking.status in (
                    com.duynam.cinema.constant.BookingStatus.CONFIRMED,
                    com.duynam.cinema.constant.BookingStatus.COMPLETED
              )
            group by bs.showtime.movie.id, bs.showtime.movie.title
            order by count(bs) desc, coalesce(sum(bs.price), 0) desc
            """)
    List<Object[]> findTopMoviesByTicketsSold();
}
