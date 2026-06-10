package com.duynam.cinema.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.entity.Seat;

@Repository
public interface SeatRepository extends JpaRepository<Seat, String> {
    boolean existsByRoomIdAndCodeIgnoreCase(String roomId, String code);

    Optional<Seat> findByIdAndRoomId(String id, String roomId);

    List<Seat> findAllByRoomIdOrderByRowNameAscColumnNumberAsc(String roomId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Seat s where s.id in :ids")
    List<Seat> findAllByIdInForUpdate(@Param("ids") List<String> ids);

    void deleteAllByRoomId(String roomId);
}
