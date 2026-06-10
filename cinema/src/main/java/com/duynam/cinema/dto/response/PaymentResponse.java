package com.duynam.cinema.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

import com.duynam.cinema.constant.PaymentMethod;
import com.duynam.cinema.constant.PaymentStatus;
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
public class PaymentResponse {
    String id;
    String bookingId;
    String bookingCode;
    String transactionCode;
    PaymentMethod method;
    PaymentStatus status;
    BigDecimal amount;
    Instant paidAt;
    Instant refundedAt;
    Instant createdAt;
    Instant updatedAt;
}
