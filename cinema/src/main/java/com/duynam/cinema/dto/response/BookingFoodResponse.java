package com.duynam.cinema.dto.response;

import java.math.BigDecimal;

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
public class BookingFoodResponse {
    String id;
    String foodId;
    String name;
    FoodType type;
    Integer quantity;
    BigDecimal unitPrice;
    BigDecimal totalPrice;
}
