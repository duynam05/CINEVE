package com.duynam.cinema.repository;

import java.util.List;
import java.util.Optional;
import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.constant.BookingStatus;
import com.duynam.cinema.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    boolean existsByCode(String code);

    List<Booking> findAllByUserEmailOrderByCreatedAtDesc(String email);

    Optional<Booking> findByIdAndUserEmail(String id, String email);

    boolean existsByUserEmailAndShowtimeMovieIdAndStatusIn(
            String email,
            String movieId,
            Collection<BookingStatus> statuses);

    @Query("""
            select b from Booking b
            where (:status is null or b.status = :status)
              and (:keyword is null or lower(b.code) like lower(concat('%', :keyword, '%'))
                   or lower(b.user.email) like lower(concat('%', :keyword, '%'))
                   or lower(b.user.fullName) like lower(concat('%', :keyword, '%')))
            order by b.createdAt desc
            """)
    List<Booking> searchAdminBookings(
            @Param("keyword") String keyword,
            @Param("status") BookingStatus status);
}
