package com.duynam.cinema.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.entity.Favorite;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, String> {
    boolean existsByUserEmailAndMovieId(String email, String movieId);

    Optional<Favorite> findByUserEmailAndMovieId(String email, String movieId);

    List<Favorite> findAllByUserEmailOrderByCreatedAtDesc(String email);
}
