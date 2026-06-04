package com.duynam.cinema.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.request.ApplyCouponRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.ApplyCouponResponse;
import com.duynam.cinema.service.CouponService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CouponController {
    CouponService couponService;

    @PostMapping("/apply")
    ApiResponse<ApplyCouponResponse> applyCoupon(@RequestBody @Valid ApplyCouponRequest request) {
        return ApiResponse.<ApplyCouponResponse>builder()
                .message("Áp dụng mã giảm giá thành công")
                .result(couponService.applyCoupon(request))
                .build();
    }
}
