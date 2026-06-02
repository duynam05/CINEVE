package com.duynam.cinema.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.response.GenreResponse;
import com.duynam.cinema.dto.response.MovieResponse;
import com.duynam.cinema.entity.Genre;
import com.duynam.cinema.entity.Movie;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieMapper {
    GenreMapper genreMapper;

    public MovieResponse toMovieResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .slug(movie.getSlug())
                .description(movie.getDescription())
                .durationMinutes(movie.getDurationMinutes())
                .director(movie.getDirector())
                .actors(movie.getActors())
                .language(movie.getLanguage())
                .country(movie.getCountry())
                .ageRating(movie.getAgeRating())
                .releaseDate(movie.getReleaseDate())
                .posterUrl(movie.getPosterUrl())
                .trailerUrl(movie.getTrailerUrl())
                .status(movie.getStatus())
                .genres(toGenreResponses(movie.getGenres()))
                .createdAt(movie.getCreatedAt())
                .updatedAt(movie.getUpdatedAt())
                .build();
    }

    private Set<GenreResponse> toGenreResponses(Set<Genre> genres) {
        if (genres == null) {
            return Set.of();
        }

        return genres.stream()
                .filter(genre -> Boolean.TRUE.equals(genre.getActive()))
                .map(genreMapper::toGenreResponse)
                .collect(Collectors.toSet());
    }
}
