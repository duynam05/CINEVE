package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.constant.FoodType;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.FoodResponse;
import com.duynam.cinema.service.FoodService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FoodController {
    FoodService foodService;

    @GetMapping
    ApiResponse<List<FoodResponse>> getFoods(@RequestParam(required = false) FoodType type) {
        return ApiResponse.<List<FoodResponse>>builder()
                .result(foodService.getPublicFoods(type))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<FoodResponse> getFood(@PathVariable String id) {
        return ApiResponse.<FoodResponse>builder()
                .result(foodService.getPublicFood(id))
                .build();
    }
}
