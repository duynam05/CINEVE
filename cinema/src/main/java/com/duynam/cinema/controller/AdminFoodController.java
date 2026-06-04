package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.duynam.cinema.dto.request.FoodRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.FoodResponse;
import com.duynam.cinema.service.FoodService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/foods")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminFoodController {
    FoodService foodService;

    @GetMapping
    ApiResponse<List<FoodResponse>> getFoods() {
        return ApiResponse.<List<FoodResponse>>builder()
                .result(foodService.getAdminFoods())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<FoodResponse> getFood(@PathVariable String id) {
        return ApiResponse.<FoodResponse>builder()
                .result(foodService.getAdminFood(id))
                .build();
    }

    @PostMapping
    ApiResponse<FoodResponse> createFood(@RequestBody @Valid FoodRequest request) {
        return ApiResponse.<FoodResponse>builder()
                .message("Thêm đồ ăn, nước uống thành công")
                .result(foodService.createFood(request))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<FoodResponse> updateFood(@PathVariable String id, @RequestBody @Valid FoodRequest request) {
        return ApiResponse.<FoodResponse>builder()
                .message("Cập nhật đồ ăn, nước uống thành công")
                .result(foodService.updateFood(id, request))
                .build();
    }

    @PostMapping("/{id}/image")
    ApiResponse<FoodResponse> uploadImage(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return ApiResponse.<FoodResponse>builder()
                .message("Upload ảnh đồ ăn, nước uống thành công")
                .result(foodService.uploadImage(id, file))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> hideFood(@PathVariable String id) {
        foodService.hideFood(id);

        return ApiResponse.<Void>builder()
                .message("Ẩn đồ ăn, nước uống thành công")
                .build();
    }
}
