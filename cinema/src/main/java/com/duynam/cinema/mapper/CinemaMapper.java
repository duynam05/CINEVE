package com.duynam.cinema.mapper;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.response.CinemaResponse;
import com.duynam.cinema.entity.Cinema;

@Component
public class CinemaMapper {
    public CinemaResponse toCinemaResponse(Cinema cinema) {
        return CinemaResponse.builder()
                .id(cinema.getId())
                .name(cinema.getName())
                .slug(cinema.getSlug())
                .address(cinema.getAddress())
                .city(cinema.getCity())
                .phone(cinema.getPhone())
                .email(cinema.getEmail())
                .description(cinema.getDescription())
                .status(cinema.getStatus())
                .createdAt(cinema.getCreatedAt())
                .updatedAt(cinema.getUpdatedAt())
                .build();
    }
}
