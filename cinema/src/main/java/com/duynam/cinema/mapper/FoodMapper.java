package com.duynam.cinema.mapper;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.response.FoodResponse;
import com.duynam.cinema.entity.Food;

@Component
public class FoodMapper {
    public FoodResponse toFoodResponse(Food food) {
        return FoodResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .slug(food.getSlug())
                .description(food.getDescription())
                .type(food.getType())
                .price(food.getPrice())
                .imageUrl(food.getImageUrl())
                .active(food.getActive())
                .createdAt(food.getCreatedAt())
                .updatedAt(food.getUpdatedAt())
                .build();
    }
}
