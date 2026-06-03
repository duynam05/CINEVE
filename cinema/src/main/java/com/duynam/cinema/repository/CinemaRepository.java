package com.duynam.cinema.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.constant.CinemaStatus;
import com.duynam.cinema.entity.Cinema;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, String> {
    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);

    List<Cinema> findAllByStatusOrderByCityAscNameAsc(CinemaStatus status);

    List<Cinema> findAllByCityIgnoreCaseAndStatusOrderByNameAsc(String city, CinemaStatus status);

    Optional<Cinema> findByIdAndStatus(String id, CinemaStatus status);
}
