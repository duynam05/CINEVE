package com.duynam.cinema.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.duynam.cinema.constant.BookingStatus;
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
public class BookingResponse {
    String id;
    String code;
    String userId;
    String userEmail;
    String userFullName;
    ShowtimeResponse showtime;
    List<BookingSeatResponse> seats;
    List<BookingFoodResponse> foods;
    String couponId;
    String couponCode;
    BigDecimal seatAmount;
    BigDecimal foodAmount;
    BigDecimal discountAmount;
    BigDecimal totalAmount;
    BookingStatus status;
    PaymentResponse payment;
    TicketResponse ticket;
    Instant cancelledAt;
    String cancelReason;
    Instant createdAt;
    Instant updatedAt;
}
