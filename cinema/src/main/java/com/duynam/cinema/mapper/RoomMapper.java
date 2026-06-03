package com.duynam.cinema.mapper;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.response.RoomResponse;
import com.duynam.cinema.entity.Room;

@Component
public class RoomMapper {
    public RoomResponse toRoomResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .cinemaId(room.getCinema().getId())
                .cinemaName(room.getCinema().getName())
                .name(room.getName())
                .rowCount(room.getRowCount())
                .columnCount(room.getColumnCount())
                .type(room.getType())
                .status(room.getStatus())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
    }
}
