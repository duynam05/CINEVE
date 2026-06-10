package com.duynam.cinema.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.response.BookingFoodResponse;
import com.duynam.cinema.dto.response.BookingResponse;
import com.duynam.cinema.dto.response.BookingSeatResponse;
import com.duynam.cinema.dto.response.PaymentResponse;
import com.duynam.cinema.dto.response.TicketResponse;
import com.duynam.cinema.entity.Booking;
import com.duynam.cinema.entity.BookingFood;
import com.duynam.cinema.entity.BookingSeat;
import com.duynam.cinema.entity.Payment;
import com.duynam.cinema.entity.Ticket;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingMapper {
    ShowtimeMapper showtimeMapper;

    public BookingResponse toBookingResponse(
            Booking booking,
            List<BookingSeat> seats,
            List<BookingFood> foods,
            Payment payment,
            Ticket ticket
    ) {
        return BookingResponse.builder()
                .id(booking.getId())
                .code(booking.getCode())
                .userId(booking.getUser().getId())
                .userEmail(booking.getUser().getEmail())
                .userFullName(booking.getUser().getFullName())
                .showtime(showtimeMapper.toShowtimeResponse(booking.getShowtime()))
                .seats(seats.stream().map(this::toBookingSeatResponse).toList())
                .foods(foods.stream().map(this::toBookingFoodResponse).toList())
                .couponId(booking.getCoupon() == null ? null : booking.getCoupon().getId())
                .couponCode(booking.getCoupon() == null ? null : booking.getCoupon().getCode())
                .seatAmount(booking.getSeatAmount())
                .foodAmount(booking.getFoodAmount())
                .discountAmount(booking.getDiscountAmount())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .payment(payment == null ? null : toPaymentResponse(payment))
                .ticket(ticket == null ? null : toTicketResponse(ticket))
                .cancelledAt(booking.getCancelledAt())
                .cancelReason(booking.getCancelReason())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }

    public BookingSeatResponse toBookingSeatResponse(BookingSeat bookingSeat) {
        return BookingSeatResponse.builder()
                .id(bookingSeat.getId())
                .seatId(bookingSeat.getSeat().getId())
                .code(bookingSeat.getSeat().getCode())
                .rowName(bookingSeat.getSeat().getRowName())
                .columnNumber(bookingSeat.getSeat().getColumnNumber())
                .type(bookingSeat.getSeat().getType())
                .price(bookingSeat.getPrice())
                .build();
    }

    public BookingFoodResponse toBookingFoodResponse(BookingFood bookingFood) {
        return BookingFoodResponse.builder()
                .id(bookingFood.getId())
                .foodId(bookingFood.getFood().getId())
                .name(bookingFood.getFood().getName())
                .type(bookingFood.getFood().getType())
                .quantity(bookingFood.getQuantity())
                .unitPrice(bookingFood.getUnitPrice())
                .totalPrice(bookingFood.getTotalPrice())
                .build();
    }

    public PaymentResponse toPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .bookingCode(payment.getBooking().getCode())
                .transactionCode(payment.getTransactionCode())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .amount(payment.getAmount())
                .paidAt(payment.getPaidAt())
                .refundedAt(payment.getRefundedAt())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }

    public TicketResponse toTicketResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .code(ticket.getCode())
                .bookingId(ticket.getBooking().getId())
                .bookingCode(ticket.getBooking().getCode())
                .qrCode(ticket.getQrCode())
                .status(ticket.getStatus())
                .usedAt(ticket.getUsedAt())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
