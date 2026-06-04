package com.duynam.cinema.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.constant.FoodType;
import com.duynam.cinema.entity.Food;

@Repository
public interface FoodRepository extends JpaRepository<Food, String> {
    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);

    Optional<Food> findByIdAndActiveTrue(String id);

    List<Food> findAllByActiveTrueOrderByNameAsc();

    List<Food> findAllByTypeAndActiveTrueOrderByNameAsc(FoodType type);
}
