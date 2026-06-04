package com.duynam.cinema.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
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
public class ApplyCouponRequest {
    @NotBlank(message = "COUPON_CODE_REQUIRED")
    String code;

    @NotNull(message = "ORDER_AMOUNT_REQUIRED")
    @DecimalMin(value = "0.0", inclusive = false, message = "ORDER_AMOUNT_INVALID")
    BigDecimal orderAmount;
}
