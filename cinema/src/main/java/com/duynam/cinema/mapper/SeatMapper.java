package com.duynam.cinema.mapper;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.response.SeatResponse;
import com.duynam.cinema.entity.Seat;

@Component
public class SeatMapper {
    public SeatResponse toSeatResponse(Seat seat) {
        return SeatResponse.builder()
                .id(seat.getId())
                .roomId(seat.getRoom().getId())
                .roomName(seat.getRoom().getName())
                .code(seat.getCode())
                .rowName(seat.getRowName())
                .columnNumber(seat.getColumnNumber())
                .type(seat.getType())
                .status(seat.getStatus())
                .createdAt(seat.getCreatedAt())
                .updatedAt(seat.getUpdatedAt())
                .build();
    }
}
