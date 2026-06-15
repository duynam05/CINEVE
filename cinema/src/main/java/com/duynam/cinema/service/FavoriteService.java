package com.duynam.cinema.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.cinema.dto.response.FavoriteResponse;
import com.duynam.cinema.entity.Favorite;
import com.duynam.cinema.entity.Movie;
import com.duynam.cinema.entity.User;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.FavoriteMapper;
import com.duynam.cinema.repository.FavoriteRepository;
import com.duynam.cinema.repository.MovieRepository;
import com.duynam.cinema.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteService {
    FavoriteRepository favoriteRepository;
    MovieRepository movieRepository;
    UserRepository userRepository;
    FavoriteMapper favoriteMapper;

    public List<FavoriteResponse> getMyFavorites() {
        return favoriteRepository.findAllByUserEmailOrderByCreatedAtDesc(getCurrentEmail()).stream()
                .map(favoriteMapper::toFavoriteResponse)
                .toList();
    }

    @Transactional
    public FavoriteResponse addFavorite(String movieId) {
        User user = getCurrentUser();
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        if (favoriteRepository.existsByUserEmailAndMovieId(user.getEmail(), movieId)) {
            throw new AppException(ErrorCode.FAVORITE_ALREADY_EXISTS);
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .movie(movie)
                .build();

        return favoriteMapper.toFavoriteResponse(favoriteRepository.save(favorite));
    }

    @Transactional
    public void removeFavorite(String movieId) {
        Favorite favorite = favoriteRepository.findByUserEmailAndMovieId(getCurrentEmail(), movieId)
                .orElseThrow(() -> new AppException(ErrorCode.FAVORITE_NOT_FOUND));
        favoriteRepository.delete(favorite);
    }

    private User getCurrentUser() {
        return userRepository.findByEmail(getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private String getCurrentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
