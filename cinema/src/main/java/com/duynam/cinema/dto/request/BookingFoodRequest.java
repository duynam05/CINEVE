package com.duynam.cinema.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class BookingFoodRequest {
    @NotBlank(message = "FOOD_ID_REQUIRED")
    String foodId;

    @NotNull(message = "FOOD_QUANTITY_REQUIRED")
    @Min(value = 1, message = "FOOD_QUANTITY_INVALID")
    Integer quantity;
}
