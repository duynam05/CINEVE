package com.duynam.cinema.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.duynam.cinema.constant.CouponType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
public class CouponRequest {
    @NotBlank(message = "COUPON_CODE_REQUIRED")
    @Size(min = 3, max = 50, message = "COUPON_CODE_INVALID")
    String code;

    @NotBlank(message = "COUPON_NAME_REQUIRED")
    @Size(min = 2, max = 150, message = "COUPON_NAME_INVALID")
    String name;

    @Size(max = 500, message = "COUPON_DESCRIPTION_INVALID")
    String description;

    @NotNull(message = "COUPON_TYPE_REQUIRED")
    CouponType type;

    @NotNull(message = "COUPON_DISCOUNT_VALUE_REQUIRED")
    @DecimalMin(value = "0.0", inclusive = false, message = "COUPON_DISCOUNT_VALUE_INVALID")
    BigDecimal discountValue;

    @NotNull(message = "COUPON_MIN_ORDER_AMOUNT_REQUIRED")
    @DecimalMin(value = "0.0", message = "COUPON_MIN_ORDER_AMOUNT_INVALID")
    BigDecimal minOrderAmount;

    @DecimalMin(value = "0.0", inclusive = false, message = "COUPON_MAX_DISCOUNT_AMOUNT_INVALID")
    BigDecimal maxDiscountAmount;

    @NotNull(message = "COUPON_START_TIME_REQUIRED")
    LocalDateTime startTime;

    @NotNull(message = "COUPON_END_TIME_REQUIRED")
    LocalDateTime endTime;

    @NotNull(message = "COUPON_USAGE_LIMIT_REQUIRED")
    @Min(value = 1, message = "COUPON_USAGE_LIMIT_INVALID")
    Integer usageLimit;

    @NotNull(message = "COUPON_ACTIVE_REQUIRED")
    Boolean active;
}
