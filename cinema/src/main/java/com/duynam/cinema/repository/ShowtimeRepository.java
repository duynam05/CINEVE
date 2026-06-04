package com.duynam.cinema.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.constant.ShowtimeStatus;
import com.duynam.cinema.entity.Showtime;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, String> {
    List<Showtime> findAllByStatusNotOrderByStartTimeAsc(ShowtimeStatus status);

    List<Showtime> findAllByMovieIdAndStatusNotOrderByStartTimeAsc(String movieId, ShowtimeStatus status);

    List<Showtime> findAllByRoomCinemaIdAndStatusNotOrderByStartTimeAsc(String cinemaId, ShowtimeStatus status);

    @Query("""
            select s from Showtime s
            where (:movieId is null or s.movie.id = :movieId)
              and (:cinemaId is null or s.room.cinema.id = :cinemaId)
              and (:roomId is null or s.room.id = :roomId)
              and (:fromTime is null or s.startTime >= :fromTime)
              and (:toTime is null or s.startTime < :toTime)
            order by s.startTime asc
            """)
    List<Showtime> searchAdminShowtimes(
            @Param("movieId") String movieId,
            @Param("cinemaId") String cinemaId,
            @Param("roomId") String roomId,
            @Param("fromTime") LocalDateTime fromTime,
            @Param("toTime") LocalDateTime toTime);

    @Query("""
            select s from Showtime s
            where s.status <> :status
              and (:movieId is null or s.movie.id = :movieId)
              and (:cinemaId is null or s.room.cinema.id = :cinemaId)
              and (:roomId is null or s.room.id = :roomId)
              and (:fromTime is null or s.startTime >= :fromTime)
              and (:toTime is null or s.startTime < :toTime)
            order by s.startTime asc
            """)
    List<Showtime> searchPublicShowtimes(
            @Param("movieId") String movieId,
            @Param("cinemaId") String cinemaId,
            @Param("roomId") String roomId,
            @Param("fromTime") LocalDateTime fromTime,
            @Param("toTime") LocalDateTime toTime,
            @Param("status") ShowtimeStatus status);

    @Query("""
            select count(s) > 0 from Showtime s
            where s.room.id = :roomId
              and s.status <> com.duynam.cinema.constant.ShowtimeStatus.CANCELLED
              and (:excludeId is null or s.id <> :excludeId)
              and s.startTime < :endTime
              and s.endTime > :startTime
            """)
    boolean existsOverlappingShowtime(
            @Param("roomId") String roomId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("excludeId") String excludeId);
}
