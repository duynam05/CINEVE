package com.duynam.cinema.service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.cinema.constant.CinemaStatus;
import com.duynam.cinema.dto.request.CinemaRequest;
import com.duynam.cinema.dto.response.CinemaResponse;
import com.duynam.cinema.entity.Cinema;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.CinemaMapper;
import com.duynam.cinema.repository.CinemaRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CinemaService {
    private static final Pattern DIACRITICS_PATTERN = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    private static final Pattern NON_SLUG_PATTERN = Pattern.compile("[^a-z0-9]+");

    CinemaRepository cinemaRepository;
    CinemaMapper cinemaMapper;

    public List<CinemaResponse> getPublicCinemas(String city) {
        if (city == null || city.isBlank()) {
            return cinemaRepository.findAllByStatusOrderByCityAscNameAsc(CinemaStatus.ACTIVE).stream()
                    .map(cinemaMapper::toCinemaResponse)
                    .toList();
        }

        return cinemaRepository.findAllByCityIgnoreCaseAndStatusOrderByNameAsc(
                        city.trim(), CinemaStatus.ACTIVE)
                .stream()
                .map(cinemaMapper::toCinemaResponse)
                .toList();
    }

    public CinemaResponse getPublicCinema(String id) {
        Cinema cinema = cinemaRepository.findByIdAndStatus(id, CinemaStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_FOUND));

        return cinemaMapper.toCinemaResponse(cinema);
    }

    public List<CinemaResponse> getAdminCinemas() {
        return cinemaRepository.findAll().stream()
                .map(cinemaMapper::toCinemaResponse)
                .toList();
    }

    public CinemaResponse getAdminCinema(String id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_FOUND));

        return cinemaMapper.toCinemaResponse(cinema);
    }

    @Transactional
    public CinemaResponse createCinema(CinemaRequest request) {
        String name = request.getName().trim();
        if (cinemaRepository.existsByNameIgnoreCase(name)) {
            throw new AppException(ErrorCode.CINEMA_EXISTED);
        }

        Cinema cinema = Cinema.builder()
                .name(name)
                .slug(generateUniqueSlug(name, null))
                .address(request.getAddress().trim())
                .city(request.getCity().trim())
                .phone(normalizeNullable(request.getPhone()))
                .email(normalizeNullable(request.getEmail()))
                .description(normalizeNullable(request.getDescription()))
                .status(request.getStatus())
                .build();

        return cinemaMapper.toCinemaResponse(cinemaRepository.save(cinema));
    }

    @Transactional
    public CinemaResponse updateCinema(String id, CinemaRequest request) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_FOUND));

        String name = request.getName().trim();
        if (!cinema.getName().equalsIgnoreCase(name) && cinemaRepository.existsByNameIgnoreCase(name)) {
            throw new AppException(ErrorCode.CINEMA_EXISTED);
        }

        cinema.setName(name);
        cinema.setSlug(generateUniqueSlug(name, cinema.getSlug()));
        cinema.setAddress(request.getAddress().trim());
        cinema.setCity(request.getCity().trim());
        cinema.setPhone(normalizeNullable(request.getPhone()));
        cinema.setEmail(normalizeNullable(request.getEmail()));
        cinema.setDescription(normalizeNullable(request.getDescription()));
        cinema.setStatus(request.getStatus());

        return cinemaMapper.toCinemaResponse(cinemaRepository.save(cinema));
    }

    @Transactional
    public CinemaResponse updateCinemaStatus(String id, CinemaStatus status) {
        if (status == null) {
            throw new AppException(ErrorCode.CINEMA_STATUS_REQUIRED);
        }

        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_FOUND));

        cinema.setStatus(status);
        return cinemaMapper.toCinemaResponse(cinemaRepository.save(cinema));
    }

    @Transactional
    public void hideCinema(String id) {
        Cinema cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_FOUND));

        cinema.setStatus(CinemaStatus.HIDDEN);
        cinemaRepository.save(cinema);
    }

    private String generateUniqueSlug(String value, String currentSlug) {
        String baseSlug = toSlug(value);
        String slug = baseSlug;
        int index = 2;

        while (!slug.equals(currentSlug) && cinemaRepository.existsBySlug(slug)) {
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

        return slug.isBlank() ? "rap" : slug;
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
