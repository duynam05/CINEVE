package com.duynam.cinema.mapper;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.response.GenreResponse;
import com.duynam.cinema.entity.Genre;

@Component
public class GenreMapper {
    public GenreResponse toGenreResponse(Genre genre) {
        return GenreResponse.builder()
                .id(genre.getId())
                .name(genre.getName())
                .slug(genre.getSlug())
                .description(genre.getDescription())
                .active(genre.getActive())
                .createdAt(genre.getCreatedAt())
                .updatedAt(genre.getUpdatedAt())
                .build();
    }
}
