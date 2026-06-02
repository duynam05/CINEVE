package com.duynam.cinema.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.entity.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, String> {
    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);

    Optional<Genre> findByIdAndActiveTrue(String id);

    List<Genre> findAllByActiveTrueOrderByNameAsc();
}
