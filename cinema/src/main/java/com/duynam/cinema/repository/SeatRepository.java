package com.duynam.cinema.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.entity.Seat;

@Repository
public interface SeatRepository extends JpaRepository<Seat, String> {
    boolean existsByRoomIdAndCodeIgnoreCase(String roomId, String code);

    Optional<Seat> findByIdAndRoomId(String id, String roomId);

    List<Seat> findAllByRoomIdOrderByRowNameAscColumnNumberAsc(String roomId);

    void deleteAllByRoomId(String roomId);
}
