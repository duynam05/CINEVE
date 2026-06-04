package com.duynam.cinema.dto.request;

import java.math.BigDecimal;

import com.duynam.cinema.constant.FoodType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FoodRequest {
    @NotBlank(message = "FOOD_NAME_REQUIRED")
    @Size(min = 2, max = 150, message = "FOOD_NAME_INVALID")
    String name;

    @Size(max = 500, message = "FOOD_DESCRIPTION_INVALID")
    String description;

    @NotNull(message = "FOOD_TYPE_REQUIRED")
    FoodType type;

    @NotNull(message = "FOOD_PRICE_REQUIRED")
    @DecimalMin(value = "0.0", inclusive = false, message = "FOOD_PRICE_INVALID")
    BigDecimal price;

    @Size(max = 500, message = "FOOD_IMAGE_URL_INVALID")
    String imageUrl;

    @NotNull(message = "FOOD_ACTIVE_REQUIRED")
    Boolean active;
}
