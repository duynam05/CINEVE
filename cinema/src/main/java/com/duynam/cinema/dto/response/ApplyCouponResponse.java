package com.duynam.cinema.dto.response;

import java.math.BigDecimal;

import com.duynam.cinema.constant.CouponType;
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
public class ApplyCouponResponse {
    String couponId;
    String code;
    CouponType type;
    BigDecimal orderAmount;
    BigDecimal discountAmount;
    BigDecimal finalAmount;
}
