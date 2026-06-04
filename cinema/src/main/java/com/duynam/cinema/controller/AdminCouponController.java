package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.dto.request.CouponRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.CouponResponse;
import com.duynam.cinema.service.CouponService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminCouponController {
    CouponService couponService;

    @GetMapping
    ApiResponse<List<CouponResponse>> getCoupons() {
        return ApiResponse.<List<CouponResponse>>builder()
                .result(couponService.getAdminCoupons())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<CouponResponse> getCoupon(@PathVariable String id) {
        return ApiResponse.<CouponResponse>builder()
                .result(couponService.getAdminCoupon(id))
                .build();
    }

    @PostMapping
    ApiResponse<CouponResponse> createCoupon(@RequestBody @Valid CouponRequest request) {
        return ApiResponse.<CouponResponse>builder()
                .message("Thêm mã giảm giá thành công")
                .result(couponService.createCoupon(request))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<CouponResponse> updateCoupon(@PathVariable String id, @RequestBody @Valid CouponRequest request) {
        return ApiResponse.<CouponResponse>builder()
                .message("Cập nhật mã giảm giá thành công")
                .result(couponService.updateCoupon(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> hideCoupon(@PathVariable String id) {
        couponService.hideCoupon(id);

        return ApiResponse.<Void>builder()
                .message("Tắt mã giảm giá thành công")
                .build();
    }
}
