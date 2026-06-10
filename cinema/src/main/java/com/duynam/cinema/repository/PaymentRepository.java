package com.duynam.cinema.repository;

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
}
