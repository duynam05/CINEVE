package com.duynam.cinema.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.cinema.constant.BookingStatus;
import com.duynam.cinema.constant.CouponType;
import com.duynam.cinema.constant.PaymentMethod;
import com.duynam.cinema.constant.PaymentStatus;
import com.duynam.cinema.constant.SeatStatus;
import com.duynam.cinema.constant.SeatType;
import com.duynam.cinema.constant.ShowtimeStatus;
import com.duynam.cinema.constant.TicketStatus;
import com.duynam.cinema.constant.UserStatus;
import com.duynam.cinema.dto.request.BookingFoodRequest;
import com.duynam.cinema.dto.request.BookingRequest;
import com.duynam.cinema.dto.request.PaymentRequest;
import com.duynam.cinema.dto.response.BookingResponse;
import com.duynam.cinema.dto.response.PaymentResponse;
import com.duynam.cinema.dto.response.TicketResponse;
import com.duynam.cinema.entity.Booking;
import com.duynam.cinema.entity.BookingFood;
import com.duynam.cinema.entity.BookingSeat;
import com.duynam.cinema.entity.Coupon;
import com.duynam.cinema.entity.Food;
import com.duynam.cinema.entity.Payment;
import com.duynam.cinema.entity.Seat;
import com.duynam.cinema.entity.Showtime;
import com.duynam.cinema.entity.Ticket;
import com.duynam.cinema.entity.User;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.BookingMapper;
import com.duynam.cinema.repository.BookingFoodRepository;
import com.duynam.cinema.repository.BookingRepository;
import com.duynam.cinema.repository.BookingSeatRepository;
import com.duynam.cinema.repository.CouponRepository;
import com.duynam.cinema.repository.FoodRepository;
import com.duynam.cinema.repository.PaymentRepository;
import com.duynam.cinema.repository.SeatRepository;
import com.duynam.cinema.repository.ShowtimeRepository;
import com.duynam.cinema.repository.TicketRepository;
import com.duynam.cinema.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);
    private static final int CANCEL_BEFORE_HOURS = 2;

    BookingRepository bookingRepository;
    BookingSeatRepository bookingSeatRepository;
    BookingFoodRepository bookingFoodRepository;
    PaymentRepository paymentRepository;
    TicketRepository ticketRepository;
    ShowtimeRepository showtimeRepository;
    SeatRepository seatRepository;
    FoodRepository foodRepository;
    CouponRepository couponRepository;
    UserRepository userRepository;
    BookingMapper bookingMapper;

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        User user = getCurrentUser();
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        }

        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        validateShowtimeOpen(showtime);

        List<String> seatIds = normalizeSeatIds(request.getSeatIds());
        List<Seat> seats = seatRepository.findAllByIdInForUpdate(seatIds);
        validateSeats(showtime, seatIds, seats);
        validateSeatsNotBooked(showtime.getId(), seatIds);

        List<BookingFoodItem> foodItems = resolveFoods(request.getFoods());
        BigDecimal seatAmount = calculateSeatAmount(showtime, seats);
        BigDecimal foodAmount = foodItems.stream()
                .map(BookingFoodItem::totalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal orderAmount = normalizeMoney(seatAmount.add(foodAmount));

        Coupon coupon = resolveCoupon(request.getCouponCode(), orderAmount);
        BigDecimal discountAmount = coupon == null ? BigDecimal.ZERO : calculateDiscount(coupon, orderAmount);
        BigDecimal totalAmount = normalizeMoney(orderAmount.subtract(discountAmount).max(BigDecimal.ZERO));
        boolean paymentSuccess = !Boolean.FALSE.equals(request.getPaymentSuccess());

        Booking booking = Booking.builder()
                .code(generateBookingCode())
                .user(user)
                .showtime(showtime)
                .coupon(coupon)
                .seatAmount(seatAmount)
                .foodAmount(foodAmount)
                .discountAmount(discountAmount)
                .totalAmount(totalAmount)
                .status(paymentSuccess ? BookingStatus.CONFIRMED : BookingStatus.EXPIRED)
                .build();
        booking = bookingRepository.save(booking);

        List<BookingSeat> bookingSeats = saveBookingSeats(booking, showtime, seats);
        List<BookingFood> bookingFoods = saveBookingFoods(booking, foodItems);
        Payment payment = createPaymentEntity(
                booking,
                request.getPaymentMethod(),
                paymentSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        Ticket ticket = null;
        if (paymentSuccess) {
            payment.setPaidAt(Instant.now());
            incrementCouponUsage(coupon);
            ticket = ticketRepository.save(createTicketEntity(booking));
        }
        payment = paymentRepository.save(payment);

        return bookingMapper.toBookingResponse(booking, bookingSeats, bookingFoods, payment, ticket);
    }

    public List<BookingResponse> getMyBookings() {
        String email = getCurrentEmail();
        return bookingRepository.findAllByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(this::toBookingResponse)
                .toList();
    }

    public BookingResponse getMyBooking(String id) {
        Booking booking = bookingRepository.findByIdAndUserEmail(id, getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        return toBookingResponse(booking);
    }

    public TicketResponse getMyTicket(String bookingId) {
        Ticket ticket = ticketRepository.findByBookingIdAndBookingUserEmail(bookingId, getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_NOT_FOUND));

        return bookingMapper.toTicketResponse(ticket);
    }

    @Transactional
    public BookingResponse cancelMyBooking(String id) {
        Booking booking = bookingRepository.findByIdAndUserEmail(id, getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        validateCanCancel(booking);

        cancelBookingInternal(booking, "Người dùng hủy vé");
        return toBookingResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> searchAdminBookings(String keyword, BookingStatus status) {
        return bookingRepository.searchAdminBookings(normalizeNullable(keyword), status).stream()
                .map(this::toBookingResponse)
                .toList();
    }

    public BookingResponse getAdminBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        return toBookingResponse(booking);
    }

    @Transactional
    public BookingResponse confirmAdminBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CANCELLED);
        }

        boolean wasPaymentSuccess = payment.getStatus() == PaymentStatus.SUCCESS;
        booking.setStatus(BookingStatus.CONFIRMED);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(Instant.now());
        ticketRepository.findByBookingId(booking.getId())
                .orElseGet(() -> ticketRepository.save(createTicketEntity(booking)));
        if (!wasPaymentSuccess) {
            incrementCouponUsage(booking.getCoupon());
        }

        paymentRepository.save(payment);
        return toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse cancelAdminBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        cancelBookingInternal(booking, "Admin hủy booking");
        return toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse refundAdminBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new AppException(ErrorCode.PAYMENT_NOT_SUCCESS);
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setRefundedAt(Instant.now());
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(Instant.now());
        booking.setCancelReason("Admin hoàn tiền giả lập");
        ticketRepository.findByBookingId(booking.getId()).ifPresent(ticket -> {
            ticket.setStatus(TicketStatus.CANCELLED);
            ticketRepository.save(ticket);
        });

        paymentRepository.save(payment);
        return toBookingResponse(bookingRepository.save(booking));
    }

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findByIdAndUserEmail(request.getBookingId(), getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        if (paymentRepository.findByBookingId(booking.getId()).isPresent()) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_EXISTS);
        }

        Payment payment = paymentRepository.save(createPaymentEntity(booking, request.getPaymentMethod(), PaymentStatus.PENDING));
        return bookingMapper.toPaymentResponse(payment);
    }

    @Transactional
    public PaymentResponse fakeSuccess(String paymentId) {
        Payment payment = paymentRepository.findByIdAndBookingUserEmail(paymentId, getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        if (payment.getStatus() == PaymentStatus.SUCCESS || payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new AppException(ErrorCode.PAYMENT_NOT_PENDING);
        }

        Booking booking = payment.getBooking();
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CANCELLED);
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(Instant.now());
        booking.setStatus(BookingStatus.CONFIRMED);
        ticketRepository.findByBookingId(booking.getId())
                .orElseGet(() -> ticketRepository.save(createTicketEntity(booking)));
        incrementCouponUsage(booking.getCoupon());

        bookingRepository.save(booking);
        return bookingMapper.toPaymentResponse(paymentRepository.save(payment));
    }

    @Transactional
    public PaymentResponse fakeFailed(String paymentId) {
        Payment payment = paymentRepository.findByIdAndBookingUserEmail(paymentId, getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        if (payment.getStatus() == PaymentStatus.SUCCESS || payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new AppException(ErrorCode.PAYMENT_NOT_PENDING);
        }

        payment.setStatus(PaymentStatus.FAILED);
        payment.getBooking().setStatus(BookingStatus.EXPIRED);
        bookingRepository.save(payment.getBooking());
        return bookingMapper.toPaymentResponse(paymentRepository.save(payment));
    }

    public PaymentResponse getMyPayment(String id) {
        Payment payment = paymentRepository.findByIdAndBookingUserEmail(id, getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        return bookingMapper.toPaymentResponse(payment);
    }

    public List<PaymentResponse> searchAdminPayments(PaymentStatus status, PaymentMethod method) {
        return paymentRepository.searchAdminPayments(status, method).stream()
                .map(bookingMapper::toPaymentResponse)
                .toList();
    }

    public PaymentResponse getAdminPayment(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        return bookingMapper.toPaymentResponse(payment);
    }

    public List<TicketResponse> getAdminTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(bookingMapper::toTicketResponse)
                .toList();
    }

    public TicketResponse getAdminTicket(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_NOT_FOUND));

        return bookingMapper.toTicketResponse(ticket);
    }

    @Transactional
    public TicketResponse markTicketUsed(String id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TICKET_NOT_FOUND));
        if (ticket.getStatus() != TicketStatus.ACTIVE) {
            throw new AppException(ErrorCode.TICKET_NOT_ACTIVE);
        }

        ticket.setStatus(TicketStatus.USED);
        ticket.setUsedAt(Instant.now());
        return bookingMapper.toTicketResponse(ticketRepository.save(ticket));
    }

    private List<BookingSeat> saveBookingSeats(Booking booking, Showtime showtime, List<Seat> seats) {
        List<BookingSeat> bookingSeats = seats.stream()
                .map(seat -> BookingSeat.builder()
                        .booking(booking)
                        .showtime(showtime)
                        .seat(seat)
                        .price(resolveSeatPrice(showtime, seat))
                        .build())
                .toList();

        return bookingSeatRepository.saveAll(bookingSeats);
    }

    private List<BookingFood> saveBookingFoods(Booking booking, List<BookingFoodItem> foodItems) {
        List<BookingFood> bookingFoods = foodItems.stream()
                .map(item -> BookingFood.builder()
                        .booking(booking)
                        .food(item.food())
                        .quantity(item.quantity())
                        .unitPrice(item.unitPrice())
                        .totalPrice(item.totalPrice())
                        .build())
                .toList();

        return bookingFoodRepository.saveAll(bookingFoods);
    }

    private BookingResponse toBookingResponse(Booking booking) {
        return bookingMapper.toBookingResponse(
                booking,
                bookingSeatRepository.findAllByBookingId(booking.getId()),
                bookingFoodRepository.findAllByBookingId(booking.getId()),
                paymentRepository.findByBookingId(booking.getId()).orElse(null),
                ticketRepository.findByBookingId(booking.getId()).orElse(null));
    }

    private void cancelBookingInternal(Booking booking, String reason) {
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CANCELLED);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(Instant.now());
        booking.setCancelReason(reason);

        ticketRepository.findByBookingId(booking.getId()).ifPresent(ticket -> {
            ticket.setStatus(TicketStatus.CANCELLED);
            ticketRepository.save(ticket);
        });
        paymentRepository.findByBookingId(booking.getId()).ifPresent(payment -> {
            if (payment.getStatus() == PaymentStatus.SUCCESS) {
                payment.setStatus(PaymentStatus.REFUNDED);
                payment.setRefundedAt(Instant.now());
                paymentRepository.save(payment);
            }
        });
    }

    private void validateCanCancel(Booking booking) {
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_CANCELLED);
        }
        if (booking.getShowtime().getStartTime().isBefore(LocalDateTime.now().plusHours(CANCEL_BEFORE_HOURS))) {
            throw new AppException(ErrorCode.BOOKING_CANCEL_NOT_ALLOWED);
        }
    }

    private void validateShowtimeOpen(Showtime showtime) {
        if (showtime.getStatus() != ShowtimeStatus.OPEN || !showtime.getStartTime().isAfter(LocalDateTime.now())) {
            throw new AppException(ErrorCode.SHOWTIME_NOT_OPEN);
        }
    }

    private List<String> normalizeSeatIds(List<String> seatIds) {
        List<String> normalized = seatIds.stream()
                .map(String::trim)
                .toList();
        if (new HashSet<>(normalized).size() != normalized.size()) {
            throw new AppException(ErrorCode.BOOKING_SEAT_DUPLICATED);
        }

        return normalized;
    }

    private void validateSeats(Showtime showtime, List<String> seatIds, List<Seat> seats) {
        if (seats.size() != seatIds.size()) {
            throw new AppException(ErrorCode.SEAT_NOT_FOUND);
        }

        for (Seat seat : seats) {
            if (!seat.getRoom().getId().equals(showtime.getRoom().getId())) {
                throw new AppException(ErrorCode.SEAT_NOT_IN_SHOWTIME_ROOM);
            }
            if (seat.getStatus() != SeatStatus.ACTIVE) {
                throw new AppException(ErrorCode.SEAT_NOT_AVAILABLE);
            }
        }
    }

    private void validateSeatsNotBooked(String showtimeId, List<String> seatIds) {
        if (!bookingSeatRepository.findActiveBookedSeats(showtimeId, seatIds).isEmpty()) {
            throw new AppException(ErrorCode.SEAT_ALREADY_BOOKED);
        }
    }

    private List<BookingFoodItem> resolveFoods(List<BookingFoodRequest> foodRequests) {
        if (foodRequests == null || foodRequests.isEmpty()) {
            return List.of();
        }

        Map<String, BookingFoodRequest> mergedRequests = foodRequests.stream()
                .collect(Collectors.toMap(
                        request -> request.getFoodId().trim(),
                        Function.identity(),
                        (left, right) -> BookingFoodRequest.builder()
                                .foodId(left.getFoodId())
                                .quantity(left.getQuantity() + right.getQuantity())
                                .build()));

        List<Food> foods = foodRepository.findAllById(mergedRequests.keySet());
        if (foods.size() != mergedRequests.size()) {
            throw new AppException(ErrorCode.FOOD_NOT_FOUND);
        }

        List<BookingFoodItem> items = new ArrayList<>();
        for (Food food : foods) {
            if (!Boolean.TRUE.equals(food.getActive())) {
                throw new AppException(ErrorCode.FOOD_NOT_FOUND);
            }
            int quantity = mergedRequests.get(food.getId()).getQuantity();
            BigDecimal unitPrice = normalizeMoney(food.getPrice());
            items.add(new BookingFoodItem(food, quantity, unitPrice, normalizeMoney(unitPrice.multiply(BigDecimal.valueOf(quantity)))));
        }

        return items;
    }

    private Coupon resolveCoupon(String couponCode, BigDecimal orderAmount) {
        String normalizedCode = normalizeNullable(couponCode);
        if (normalizedCode == null) {
            return null;
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(normalizedCode.toUpperCase(Locale.ROOT))
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
        validateCouponCanApply(coupon, orderAmount);
        return coupon;
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

    private BigDecimal calculateSeatAmount(Showtime showtime, List<Seat> seats) {
        return normalizeMoney(seats.stream()
                .map(seat -> resolveSeatPrice(showtime, seat))
                .reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    private BigDecimal resolveSeatPrice(Showtime showtime, Seat seat) {
        if (seat.getType() == SeatType.VIP) {
            return normalizeMoney(showtime.getVipSeatPrice());
        }
        if (seat.getType() == SeatType.COUPLE) {
            return normalizeMoney(showtime.getCoupleSeatPrice());
        }

        return normalizeMoney(showtime.getNormalSeatPrice());
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
        BigDecimal discountAmount = coupon.getType() == CouponType.PERCENT
                ? orderAmount.multiply(coupon.getDiscountValue()).divide(ONE_HUNDRED, 2, RoundingMode.HALF_UP)
                : coupon.getDiscountValue();

        if (coupon.getMaxDiscountAmount() != null) {
            discountAmount = discountAmount.min(coupon.getMaxDiscountAmount());
        }

        return normalizeMoney(discountAmount.min(orderAmount));
    }

    private void incrementCouponUsage(Coupon coupon) {
        if (coupon == null) {
            return;
        }

        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
    }

    private Payment createPaymentEntity(Booking booking, PaymentMethod method, PaymentStatus status) {
        return Payment.builder()
                .transactionCode(generateTransactionCode())
                .booking(booking)
                .method(method)
                .status(status)
                .amount(booking.getTotalAmount())
                .build();
    }

    private Ticket createTicketEntity(Booking booking) {
        String ticketCode = generateTicketCode();
        return Ticket.builder()
                .code(ticketCode)
                .booking(booking)
                .qrCode("QR-CINEVE:" + ticketCode + ":" + booking.getCode())
                .status(TicketStatus.ACTIVE)
                .build();
    }

    private String generateBookingCode() {
        String code;
        do {
            code = "BK" + System.currentTimeMillis() + randomDigits(4);
        } while (bookingRepository.existsByCode(code));

        return code;
    }

    private String generateTransactionCode() {
        String code;
        do {
            code = "PAY" + System.currentTimeMillis() + randomDigits(4);
        } while (paymentRepository.existsByTransactionCode(code));

        return code;
    }

    private String generateTicketCode() {
        String code;
        do {
            code = "TK" + System.currentTimeMillis() + randomDigits(4);
        } while (ticketRepository.existsByCode(code));

        return code;
    }

    private String randomDigits(int length) {
        int bound = (int) Math.pow(10, length);
        return String.format("%0" + length + "d", SECURE_RANDOM.nextInt(bound));
    }

    private User getCurrentUser() {
        String email = getCurrentEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private String getCurrentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private BigDecimal normalizeMoney(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private record BookingFoodItem(Food food, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {}
}
