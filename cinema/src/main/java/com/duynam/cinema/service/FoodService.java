package com.duynam.cinema.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.duynam.cinema.constant.FoodType;
import com.duynam.cinema.dto.request.FoodRequest;
import com.duynam.cinema.dto.response.FoodResponse;
import com.duynam.cinema.entity.Food;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.FoodMapper;
import com.duynam.cinema.repository.FoodRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FoodService {
    private static final Pattern DIACRITICS_PATTERN = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    private static final Pattern NON_SLUG_PATTERN = Pattern.compile("[^a-z0-9]+");
    private static final Path FOOD_UPLOAD_DIR = Path.of("uploads", "foods");

    FoodRepository foodRepository;
    FoodMapper foodMapper;

    public List<FoodResponse> getPublicFoods(FoodType type) {
        List<Food> foods = type == null
                ? foodRepository.findAllByActiveTrueOrderByNameAsc()
                : foodRepository.findAllByTypeAndActiveTrueOrderByNameAsc(type);

        return foods.stream()
                .map(foodMapper::toFoodResponse)
                .toList();
    }

    public FoodResponse getPublicFood(String id) {
        Food food = foodRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));

        return foodMapper.toFoodResponse(food);
    }

    public List<FoodResponse> getAdminFoods() {
        return foodRepository.findAll().stream()
                .map(foodMapper::toFoodResponse)
                .toList();
    }

    public FoodResponse getAdminFood(String id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));

        return foodMapper.toFoodResponse(food);
    }

    @Transactional
    public FoodResponse createFood(FoodRequest request) {
        String name = request.getName().trim();
        if (foodRepository.existsByNameIgnoreCase(name)) {
            throw new AppException(ErrorCode.FOOD_EXISTED);
        }

        Food food = Food.builder()
                .name(name)
                .slug(generateUniqueSlug(name, null))
                .description(normalizeNullable(request.getDescription()))
                .type(request.getType())
                .price(normalizeMoney(request.getPrice()))
                .imageUrl(normalizeNullable(request.getImageUrl()))
                .active(request.getActive())
                .build();

        return foodMapper.toFoodResponse(foodRepository.save(food));
    }

    @Transactional
    public FoodResponse updateFood(String id, FoodRequest request) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));

        String name = request.getName().trim();
        if (!food.getName().equalsIgnoreCase(name) && foodRepository.existsByNameIgnoreCase(name)) {
            throw new AppException(ErrorCode.FOOD_EXISTED);
        }

        food.setName(name);
        food.setSlug(generateUniqueSlug(name, food.getSlug()));
        food.setDescription(normalizeNullable(request.getDescription()));
        food.setType(request.getType());
        food.setPrice(normalizeMoney(request.getPrice()));
        food.setImageUrl(normalizeNullable(request.getImageUrl()));
        food.setActive(request.getActive());

        return foodMapper.toFoodResponse(foodRepository.save(food));
    }

    @Transactional
    public FoodResponse uploadImage(String id, MultipartFile file) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));

        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.FOOD_IMAGE_FILE_REQUIRED);
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new AppException(ErrorCode.FOOD_IMAGE_FILE_INVALID);
        }

        String extension = getFileExtension(Objects.requireNonNullElse(file.getOriginalFilename(), ""));
        String fileName = UUID.randomUUID() + extension;
        Path targetPath = FOOD_UPLOAD_DIR.resolve(fileName).toAbsolutePath().normalize();

        try {
            Files.createDirectories(targetPath.getParent());
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new AppException(ErrorCode.FOOD_IMAGE_UPLOAD_FAILED);
        }

        food.setImageUrl("/uploads/foods/" + fileName);
        return foodMapper.toFoodResponse(foodRepository.save(food));
    }

    @Transactional
    public void hideFood(String id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));

        food.setActive(false);
        foodRepository.save(food);
    }

    private String generateUniqueSlug(String value, String currentSlug) {
        String baseSlug = toSlug(value);
        String slug = baseSlug;
        int index = 2;

        while (!slug.equals(currentSlug) && foodRepository.existsBySlug(slug)) {
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

        return slug.isBlank() ? "do-an" : slug;
    }

    private BigDecimal normalizeMoney(BigDecimal value) {
        return value.stripTrailingZeros();
    }

    private String normalizeNullable(String value) {
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
