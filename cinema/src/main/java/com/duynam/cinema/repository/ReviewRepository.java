package com.duynam.cinema.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    boolean existsByUserEmailAndMovieId(String email, String movieId);

    Optional<Review> findByIdAndUserEmail(String id, String email);

    List<Review> findAllByMovieIdAndVisibleTrueOrderByCreatedAtDesc(String movieId);

    @Query("""
            select r from Review r
            where (:movieId is null or r.movie.id = :movieId)
              and (:rating is null or r.rating = :rating)
            order by r.createdAt desc
            """)
    List<Review> searchAdminReviews(@Param("movieId") String movieId, @Param("rating") Integer rating);
}
