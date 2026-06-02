package com.duynam.cinema.service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.cinema.dto.request.GenreRequest;
import com.duynam.cinema.dto.response.GenreResponse;
import com.duynam.cinema.entity.Genre;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.GenreMapper;
import com.duynam.cinema.repository.GenreRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenreService {
    private static final Pattern DIACRITICS_PATTERN = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    private static final Pattern NON_SLUG_PATTERN = Pattern.compile("[^a-z0-9]+");

    GenreRepository genreRepository;
    GenreMapper genreMapper;

    public List<GenreResponse> getPublicGenres() {
        return genreRepository.findAllByActiveTrueOrderByNameAsc().stream()
                .map(genreMapper::toGenreResponse)
                .toList();
    }

    public GenreResponse getPublicGenre(String id) {
        Genre genre = genreRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));

        return genreMapper.toGenreResponse(genre);
    }

    public List<GenreResponse> getAdminGenres() {
        return genreRepository.findAll().stream()
                .map(genreMapper::toGenreResponse)
                .toList();
    }

    @Transactional
    public GenreResponse createGenre(GenreRequest request) {
        String name = request.getName().trim();
        if (genreRepository.existsByNameIgnoreCase(name)) {
            throw new AppException(ErrorCode.GENRE_EXISTED);
        }

        Genre genre = Genre.builder()
                .name(name)
                .slug(generateUniqueSlug(name, null))
                .description(normalizeNullable(request.getDescription()))
                .active(true)
                .build();

        return genreMapper.toGenreResponse(genreRepository.save(genre));
    }

    @Transactional
    public GenreResponse updateGenre(String id, GenreRequest request) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));

        String name = request.getName().trim();
        if (!genre.getName().equalsIgnoreCase(name) && genreRepository.existsByNameIgnoreCase(name)) {
            throw new AppException(ErrorCode.GENRE_EXISTED);
        }

        genre.setName(name);
        genre.setSlug(generateUniqueSlug(name, genre.getSlug()));
        genre.setDescription(normalizeNullable(request.getDescription()));
        genre.setActive(true);

        return genreMapper.toGenreResponse(genreRepository.save(genre));
    }

    @Transactional
    public void hideGenre(String id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND));

        genre.setActive(false);
        genreRepository.save(genre);
    }

    private String generateUniqueSlug(String value, String currentSlug) {
        String baseSlug = toSlug(value);
        String slug = baseSlug;
        int index = 2;

        while (!slug.equals(currentSlug) && genreRepository.existsBySlug(slug)) {
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

        return slug.isBlank() ? "the-loai" : slug;
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
