package com.duynam.cinema.dto.request;

import com.duynam.cinema.constant.PaymentMethod;
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
public class PaymentRequest {
    @NotBlank(message = "BOOKING_ID_REQUIRED")
    String bookingId;

    @NotNull(message = "PAYMENT_METHOD_REQUIRED")
    PaymentMethod paymentMethod;
}
