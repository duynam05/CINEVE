package com.duynam.cinema.dto.response;

import com.duynam.cinema.constant.PaymentMethod;

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
public class PaymentMethodDashboardResponse {
    PaymentMethod method;
    long count;
}
