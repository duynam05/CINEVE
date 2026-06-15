package com.duynam.cinema.mapper;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.response.FavoriteResponse;
import com.duynam.cinema.entity.Favorite;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteMapper {
    MovieMapper movieMapper;

    public FavoriteResponse toFavoriteResponse(Favorite favorite) {
        return FavoriteResponse.builder()
                .id(favorite.getId())
                .movie(movieMapper.toMovieResponse(favorite.getMovie()))
                .createdAt(favorite.getCreatedAt())
                .build();
    }
}
