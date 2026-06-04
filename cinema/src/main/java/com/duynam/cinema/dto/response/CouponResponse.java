package com.duynam.cinema.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

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
public class CouponResponse {
    String id;
    String code;
    String name;
    String description;
    CouponType type;
    BigDecimal discountValue;
    BigDecimal minOrderAmount;
    BigDecimal maxDiscountAmount;
    LocalDateTime startTime;
    LocalDateTime endTime;
    Integer usageLimit;
    Integer usedCount;
    Boolean active;
    Instant createdAt;
    Instant updatedAt;
}
