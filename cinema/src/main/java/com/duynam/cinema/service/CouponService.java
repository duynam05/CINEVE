package com.duynam.cinema.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.cinema.constant.CouponType;
import com.duynam.cinema.dto.request.ApplyCouponRequest;
import com.duynam.cinema.dto.request.CouponRequest;
import com.duynam.cinema.dto.response.ApplyCouponResponse;
import com.duynam.cinema.dto.response.CouponResponse;
import com.duynam.cinema.entity.Coupon;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.CouponMapper;
import com.duynam.cinema.repository.CouponRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CouponService {
    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);

    CouponRepository couponRepository;
    CouponMapper couponMapper;

    public List<CouponResponse> getAdminCoupons() {
        return couponRepository.findAll().stream()
                .map(couponMapper::toCouponResponse)
                .toList();
    }

    public CouponResponse getAdminCoupon(String id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));

        return couponMapper.toCouponResponse(coupon);
    }

    @Transactional
    public CouponResponse createCoupon(CouponRequest request) {
        validateCouponRequest(request);
        String code = normalizeCode(request.getCode());
        if (couponRepository.existsByCodeIgnoreCase(code)) {
            throw new AppException(ErrorCode.COUPON_EXISTED);
        }

        Coupon coupon = Coupon.builder()
                .code(code)
                .name(request.getName().trim())
                .description(normalizeNullable(request.getDescription()))
                .type(request.getType())
                .discountValue(normalizeMoney(request.getDiscountValue()))
                .minOrderAmount(normalizeMoney(request.getMinOrderAmount()))
                .maxDiscountAmount(normalizeMoney(request.getMaxDiscountAmount()))
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .active(request.getActive())
                .build();

        return couponMapper.toCouponResponse(couponRepository.save(coupon));
    }

    @Transactional
    public CouponResponse updateCoupon(String id, CouponRequest request) {
        validateCouponRequest(request);
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));

        String code = normalizeCode(request.getCode());
        if (!coupon.getCode().equalsIgnoreCase(code) && couponRepository.existsByCodeIgnoreCase(code)) {
            throw new AppException(ErrorCode.COUPON_EXISTED);
        }
        if (request.getUsageLimit() < coupon.getUsedCount()) {
            throw new AppException(ErrorCode.COUPON_USAGE_LIMIT_LESS_THAN_USED);
        }

        coupon.setCode(code);
        coupon.setName(request.getName().trim());
        coupon.setDescription(normalizeNullable(request.getDescription()));
        coupon.setType(request.getType());
        coupon.setDiscountValue(normalizeMoney(request.getDiscountValue()));
        coupon.setMinOrderAmount(normalizeMoney(request.getMinOrderAmount()));
        coupon.setMaxDiscountAmount(normalizeMoney(request.getMaxDiscountAmount()));
        coupon.setStartTime(request.getStartTime());
        coupon.setEndTime(request.getEndTime());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setActive(request.getActive());

        return couponMapper.toCouponResponse(couponRepository.save(coupon));
    }

    @Transactional
    public void hideCoupon(String id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));

        coupon.setActive(false);
        couponRepository.save(coupon);
    }

    public ApplyCouponResponse applyCoupon(ApplyCouponRequest request) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(normalizeCode(request.getCode()))
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));

        BigDecimal orderAmount = normalizeMoney(request.getOrderAmount());
        validateCouponCanApply(coupon, orderAmount);
        BigDecimal discountAmount = calculateDiscount(coupon, orderAmount);

        return ApplyCouponResponse.builder()
                .couponId(coupon.getId())
                .code(coupon.getCode())
                .type(coupon.getType())
                .orderAmount(orderAmount)
                .discountAmount(discountAmount)
                .finalAmount(orderAmount.subtract(discountAmount).max(BigDecimal.ZERO))
                .build();
    }

    private void validateCouponRequest(CouponRequest request) {
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new AppException(ErrorCode.COUPON_TIME_INVALID);
        }

        if (request.getType() == CouponType.PERCENT && request.getDiscountValue().compareTo(ONE_HUNDRED) > 0) {
            throw new AppException(ErrorCode.COUPON_PERCENT_INVALID);
        }
    }

    private void validateCouponCanApply(Coupon coupon, BigDecimal orderAmount) {
        if (!Boolean.TRUE.equals(coupon.getActive())) {
            throw new AppException(ErrorCode.COUPON_INACTIVE);
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getStartTime()) || now.isAfter(coupon.getEndTime())) {
            throw new AppException(ErrorCode.COUPON_EXPIRED);
        }

        if (coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new AppException(ErrorCode.COUPON_USAGE_LIMIT_REACHED);
        }

        if (orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new AppException(ErrorCode.COUPON_ORDER_AMOUNT_NOT_ENOUGH);
        }
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
        BigDecimal discountAmount = coupon.getType() == CouponType.PERCENT
                ? orderAmount.multiply(coupon.getDiscountValue()).divide(ONE_HUNDRED, 2, RoundingMode.HALF_UP)
                : coupon.getDiscountValue();

        if (coupon.getMaxDiscountAmount() != null) {
            discountAmount = discountAmount.min(coupon.getMaxDiscountAmount());
        }

        return discountAmount.min(orderAmount).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal normalizeMoney(BigDecimal value) {
        if (value == null) {
            return null;
        }

        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
