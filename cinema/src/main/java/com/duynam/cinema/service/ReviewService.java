package com.duynam.cinema.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.cinema.constant.BookingStatus;
import com.duynam.cinema.dto.request.ReviewRequest;
import com.duynam.cinema.dto.response.ReviewResponse;
import com.duynam.cinema.entity.Movie;
import com.duynam.cinema.entity.Review;
import com.duynam.cinema.entity.User;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.ReviewMapper;
import com.duynam.cinema.repository.BookingRepository;
import com.duynam.cinema.repository.MovieRepository;
import com.duynam.cinema.repository.ReviewRepository;
import com.duynam.cinema.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewService {
    private static final List<BookingStatus> REVIEWABLE_BOOKING_STATUSES =
            List.of(BookingStatus.CONFIRMED, BookingStatus.COMPLETED);

    ReviewRepository reviewRepository;
    MovieRepository movieRepository;
    UserRepository userRepository;
    BookingRepository bookingRepository;
    ReviewMapper reviewMapper;

    public List<ReviewResponse> getPublicMovieReviews(String movieId) {
        ensureMovieExists(movieId);
        return reviewRepository.findAllByMovieIdAndVisibleTrueOrderByCreatedAtDesc(movieId).stream()
                .map(reviewMapper::toReviewResponse)
                .toList();
    }

    @Transactional
    public ReviewResponse createReview(String movieId, ReviewRequest request) {
        User user = getCurrentUser();
        Movie movie = ensureMovieExists(movieId);
        validateUserCanReview(user.getEmail(), movieId);
        if (reviewRepository.existsByUserEmailAndMovieId(user.getEmail(), movieId)) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        Review review = Review.builder()
                .user(user)
                .movie(movie)
                .rating(request.getRating())
                .content(normalizeNullable(request.getContent()))
                .visible(true)
                .build();

        return reviewMapper.toReviewResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse updateMyReview(String id, ReviewRequest request) {
        Review review = reviewRepository.findByIdAndUserEmail(id, getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

        review.setRating(request.getRating());
        review.setContent(normalizeNullable(request.getContent()));
        review.setVisible(true);
        return reviewMapper.toReviewResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteMyReview(String id) {
        Review review = reviewRepository.findByIdAndUserEmail(id, getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
        reviewRepository.delete(review);
    }

    public List<ReviewResponse> searchAdminReviews(String movieId, Integer rating) {
        return reviewRepository.searchAdminReviews(normalizeNullable(movieId), rating).stream()
                .map(reviewMapper::toReviewResponse)
                .toList();
    }

    @Transactional
    public ReviewResponse hideAdminReview(String id) {
        Review review = getReview(id);
        review.setVisible(false);
        return reviewMapper.toReviewResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse showAdminReview(String id) {
        Review review = getReview(id);
        review.setVisible(true);
        return reviewMapper.toReviewResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteAdminReview(String id) {
        reviewRepository.delete(getReview(id));
    }

    private Review getReview(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
    }

    private void validateUserCanReview(String email, String movieId) {
        boolean canReview = bookingRepository.existsByUserEmailAndShowtimeMovieIdAndStatusIn(
                email,
                movieId,
                REVIEWABLE_BOOKING_STATUSES);
        if (!canReview) {
            throw new AppException(ErrorCode.REVIEW_BOOKING_REQUIRED);
        }
    }

    private Movie ensureMovieExists(String movieId) {
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
    }

    private User getCurrentUser() {
        return userRepository.findByEmail(getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private String getCurrentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
