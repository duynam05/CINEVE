package com.duynam.cinema.repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.constant.PaymentMethod;
import com.duynam.cinema.constant.PaymentStatus;
import com.duynam.cinema.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    boolean existsByTransactionCode(String transactionCode);

    Optional<Payment> findByBookingId(String bookingId);

    Optional<Payment> findByIdAndBookingUserEmail(String id, String email);

    @Query("""
            select p from Payment p
            where (:status is null or p.status = :status)
              and (:method is null or p.method = :method)
            order by p.createdAt desc
            """)
    List<Payment> searchAdminPayments(
            @Param("status") PaymentStatus status,
            @Param("method") PaymentMethod method);

    @Query("""
            select coalesce(sum(p.amount), 0)
            from Payment p
            where p.status = com.duynam.cinema.constant.PaymentStatus.SUCCESS
            """)
    BigDecimal sumSuccessRevenue();

    @Query("""
            select coalesce(sum(p.amount), 0)
            from Payment p
            where p.status = com.duynam.cinema.constant.PaymentStatus.SUCCESS
              and p.paidAt >= :fromTime
              and p.paidAt < :toTime
            """)
    BigDecimal sumSuccessRevenueBetween(
            @Param("fromTime") Instant fromTime,
            @Param("toTime") Instant toTime);

    @Query("""
            select function('date', p.paidAt), coalesce(sum(p.amount), 0)
            from Payment p
            where p.status = com.duynam.cinema.constant.PaymentStatus.SUCCESS
              and p.paidAt >= :fromTime
              and p.paidAt < :toTime
            group by function('date', p.paidAt)
            order by function('date', p.paidAt) asc
            """)
    List<Object[]> sumSuccessRevenueByDay(
            @Param("fromTime") Instant fromTime,
            @Param("toTime") Instant toTime);

    @Query("""
            select year(p.paidAt), month(p.paidAt), coalesce(sum(p.amount), 0)
            from Payment p
            where p.status = com.duynam.cinema.constant.PaymentStatus.SUCCESS
              and p.paidAt >= :fromTime
              and p.paidAt < :toTime
            group by year(p.paidAt), month(p.paidAt)
            order by year(p.paidAt) asc, month(p.paidAt) asc
            """)
    List<Object[]> sumSuccessRevenueByMonth(
            @Param("fromTime") Instant fromTime,
            @Param("toTime") Instant toTime);

    @Query("""
            select p.method, count(p)
            from Payment p
            group by p.method
            order by p.method asc
            """)
    List<Object[]> countPaymentsByMethod();
}
