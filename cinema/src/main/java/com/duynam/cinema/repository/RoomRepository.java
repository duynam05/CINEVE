package com.duynam.cinema.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.entity.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    boolean existsByCinemaIdAndNameIgnoreCase(String cinemaId, String name);

    List<Room> findAllByCinemaIdOrderByNameAsc(String cinemaId);
}
