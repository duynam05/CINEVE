package com.duynam.cinema.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.entity.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, String> {
    boolean existsByCode(String code);

    Optional<Ticket> findByBookingId(String bookingId);

    Optional<Ticket> findByBookingIdAndBookingUserEmail(String bookingId, String email);

    List<Ticket> findAllByOrderByCreatedAtDesc();
}
