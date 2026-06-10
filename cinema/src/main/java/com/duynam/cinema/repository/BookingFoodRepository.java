package com.duynam.cinema.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.entity.BookingFood;

@Repository
public interface BookingFoodRepository extends JpaRepository<BookingFood, String> {
    List<BookingFood> findAllByBookingId(String bookingId);
}
