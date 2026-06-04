package com.duynam.cinema.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

import com.duynam.cinema.constant.FoodType;
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
public class FoodResponse {
    String id;
    String name;
    String slug;
    String description;
    FoodType type;
    BigDecimal price;
    String imageUrl;
    Boolean active;
    Instant createdAt;
    Instant updatedAt;
}
