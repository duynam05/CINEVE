package com.duynam.cinema.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.constant.MovieStatus;
import com.duynam.cinema.entity.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {
    boolean existsByTitleIgnoreCase(String title);

    boolean existsBySlug(String slug);

    Optional<Movie> findByIdAndStatusNot(String id, MovieStatus status);

    List<Movie> findAllByStatusNotOrderByReleaseDateDescCreatedAtDesc(MovieStatus status);

    List<Movie> findAllByStatusOrderByReleaseDateDescCreatedAtDesc(MovieStatus status);

    @Query("""
            select distinct movie
            from Movie movie
            left join movie.genres genre
            where movie.status <> com.duynam.cinema.constant.MovieStatus.HIDDEN
              and (:keyword is null or lower(movie.title) like lower(concat('%', :keyword, '%')))
              and (:genreId is null or genre.id = :genreId)
              and (:status is null or movie.status = :status)
              and (:language is null or lower(movie.language) = lower(:language))
              and (:country is null or lower(movie.country) = lower(:country))
            order by movie.releaseDate desc, movie.createdAt desc
            """)
    List<Movie> searchPublicMovies(
            @Param("keyword") String keyword,
            @Param("genreId") String genreId,
            @Param("status") MovieStatus status,
            @Param("language") String language,
            @Param("country") String country
    );
}
