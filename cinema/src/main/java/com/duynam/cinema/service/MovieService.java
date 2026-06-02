package com.duynam.cinema.service;

import java.text.Normalizer;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.duynam.cinema.constant.MovieStatus;
import com.duynam.cinema.dto.request.MovieRequest;
import com.duynam.cinema.dto.response.MovieResponse;
import com.duynam.cinema.dto.response.MovieTrailerResponse;
import com.duynam.cinema.entity.Genre;
import com.duynam.cinema.entity.Movie;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.MovieMapper;
import com.duynam.cinema.repository.GenreRepository;
import com.duynam.cinema.repository.MovieRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieService {
    private static final Pattern DIACRITICS_PATTERN = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    private static final Pattern NON_SLUG_PATTERN = Pattern.compile("[^a-z0-9]+");
    private static final Path POSTER_UPLOAD_DIR = Path.of("uploads", "posters");

    MovieRepository movieRepository;
    GenreRepository genreRepository;
    MovieMapper movieMapper;

    public List<MovieResponse> searchPublicMovies(
            String keyword,
            String genreId,
            MovieStatus status,
            String language,
            String country
    ) {
        return movieRepository.searchPublicMovies(
                        normalizeSearchValue(keyword),
                        normalizeSearchValue(genreId),
                        status,
                        normalizeSearchValue(language),
                        normalizeSearchValue(country))
                .stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }

    public List<MovieResponse> getNowShowingMovies() {
        return movieRepository.findAllByStatusOrderByReleaseDateDescCreatedAtDesc(MovieStatus.NOW_SHOWING).stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }

    public List<MovieResponse> getComingSoonMovies() {
        return movieRepository.findAllByStatusOrderByReleaseDateDescCreatedAtDesc(MovieStatus.COMING_SOON).stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }

    public MovieResponse getPublicMovie(String id) {
        Movie movie = movieRepository.findByIdAndStatusNot(id, MovieStatus.HIDDEN)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        return movieMapper.toMovieResponse(movie);
    }

    public MovieTrailerResponse getMovieTrailer(String id) {
        Movie movie = movieRepository.findByIdAndStatusNot(id, MovieStatus.HIDDEN)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        if (movie.getTrailerUrl() == null || movie.getTrailerUrl().isBlank()) {
            throw new AppException(ErrorCode.MOVIE_TRAILER_NOT_FOUND);
        }

        return MovieTrailerResponse.builder()
                .movieId(movie.getId())
                .title(movie.getTitle())
                .trailerUrl(movie.getTrailerUrl())
                .build();
    }

    public List<MovieResponse> getAdminMovies() {
        return movieRepository.findAll().stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }

    public MovieResponse getAdminMovie(String id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        return movieMapper.toMovieResponse(movie);
    }

    @Transactional
    public MovieResponse createMovie(MovieRequest request) {
        String title = request.getTitle().trim();
        if (movieRepository.existsByTitleIgnoreCase(title)) {
            throw new AppException(ErrorCode.MOVIE_EXISTED);
        }

        Movie movie = Movie.builder()
                .title(title)
                .slug(generateUniqueSlug(title, null))
                .description(normalizeNullable(request.getDescription()))
                .durationMinutes(request.getDurationMinutes())
                .director(normalizeNullable(request.getDirector()))
                .actors(normalizeNullable(request.getActors()))
                .language(normalizeNullable(request.getLanguage()))
                .country(normalizeNullable(request.getCountry()))
                .ageRating(normalizeNullable(request.getAgeRating()))
                .releaseDate(request.getReleaseDate())
                .posterUrl(normalizeNullable(request.getPosterUrl()))
                .trailerUrl(normalizeNullable(request.getTrailerUrl()))
                .status(request.getStatus())
                .genres(resolveGenres(request.getGenreIds()))
                .build();

        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    @Transactional
    public MovieResponse updateMovie(String id, MovieRequest request) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        String title = request.getTitle().trim();
        if (!movie.getTitle().equalsIgnoreCase(title) && movieRepository.existsByTitleIgnoreCase(title)) {
            throw new AppException(ErrorCode.MOVIE_EXISTED);
        }

        movie.setTitle(title);
        movie.setSlug(generateUniqueSlug(title, movie.getSlug()));
        movie.setDescription(normalizeNullable(request.getDescription()));
        movie.setDurationMinutes(request.getDurationMinutes());
        movie.setDirector(normalizeNullable(request.getDirector()));
        movie.setActors(normalizeNullable(request.getActors()));
        movie.setLanguage(normalizeNullable(request.getLanguage()));
        movie.setCountry(normalizeNullable(request.getCountry()));
        movie.setAgeRating(normalizeNullable(request.getAgeRating()));
        movie.setReleaseDate(request.getReleaseDate());
        movie.setPosterUrl(normalizeNullable(request.getPosterUrl()));
        movie.setTrailerUrl(normalizeNullable(request.getTrailerUrl()));
        movie.setStatus(request.getStatus());
        movie.setGenres(resolveGenres(request.getGenreIds()));

        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    @Transactional
    public MovieResponse updateMovieStatus(String id, MovieStatus status) {
        if (status == null) {
            throw new AppException(ErrorCode.MOVIE_STATUS_REQUIRED);
        }

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        movie.setStatus(status);
        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    @Transactional
    public MovieResponse uploadPoster(String id, MultipartFile file) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.POSTER_FILE_REQUIRED);
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new AppException(ErrorCode.POSTER_FILE_INVALID);
        }

        String extension = getFileExtension(Objects.requireNonNullElse(file.getOriginalFilename(), ""));
        String fileName = UUID.randomUUID() + extension;
        Path targetPath = POSTER_UPLOAD_DIR.resolve(fileName).toAbsolutePath().normalize();

        try {
            Files.createDirectories(targetPath.getParent());
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new AppException(ErrorCode.POSTER_UPLOAD_FAILED);
        }

        movie.setPosterUrl("/uploads/posters/" + fileName);
        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    @Transactional
    public void hideMovie(String id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        movie.setStatus(MovieStatus.HIDDEN);
        movieRepository.save(movie);
    }

    private Set<Genre> resolveGenres(Set<String> genreIds) {
        if (genreIds == null || genreIds.isEmpty()) {
            return Set.of();
        }

        Set<Genre> genres = new HashSet<>();
        for (String genreId : genreIds) {
            Genre genre = genreRepository.findByIdAndActiveTrue(genreId)
                    .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));
            genres.add(genre);
        }

        return genres;
    }

    private String generateUniqueSlug(String value, String currentSlug) {
        String baseSlug = toSlug(value);
        String slug = baseSlug;
        int index = 2;

        while (!slug.equals(currentSlug) && movieRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + index;
            index++;
        }

        return slug;
    }

    private String toSlug(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replace("đ", "d")
                .replace("Đ", "D");
        String withoutDiacritics = DIACRITICS_PATTERN.matcher(normalized).replaceAll("");
        String slug = NON_SLUG_PATTERN.matcher(withoutDiacritics.toLowerCase(Locale.ROOT)).replaceAll("-");
        slug = slug.replaceAll("^-|-$", "");

        return slug.isBlank() ? "phim" : slug;
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String normalizeSearchValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String getFileExtension(String originalFilename) {
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == originalFilename.length() - 1) {
            return ".jpg";
        }

        return originalFilename.substring(dotIndex).toLowerCase(Locale.ROOT);
    }
}
