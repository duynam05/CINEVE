package com.duynam.cinema.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.cinema.constant.CinemaStatus;
import com.duynam.cinema.constant.RoomStatus;
import com.duynam.cinema.dto.request.RoomRequest;
import com.duynam.cinema.dto.response.RoomResponse;
import com.duynam.cinema.entity.Cinema;
import com.duynam.cinema.entity.Room;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.RoomMapper;
import com.duynam.cinema.repository.CinemaRepository;
import com.duynam.cinema.repository.RoomRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomService {
    RoomRepository roomRepository;
    CinemaRepository cinemaRepository;
    RoomMapper roomMapper;

    public List<RoomResponse> getRooms(String cinemaId) {
        if (cinemaId == null || cinemaId.isBlank()) {
            return roomRepository.findAll().stream()
                    .map(roomMapper::toRoomResponse)
                    .toList();
        }

        return roomRepository.findAllByCinemaIdOrderByNameAsc(cinemaId.trim()).stream()
                .map(roomMapper::toRoomResponse)
                .toList();
    }

    public RoomResponse getRoom(String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        return roomMapper.toRoomResponse(room);
    }

    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        Cinema cinema = cinemaRepository.findByIdAndStatus(request.getCinemaId(), CinemaStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_FOUND));

        String name = request.getName().trim();
        if (roomRepository.existsByCinemaIdAndNameIgnoreCase(cinema.getId(), name)) {
            throw new AppException(ErrorCode.ROOM_EXISTED);
        }

        Room room = Room.builder()
                .cinema(cinema)
                .name(name)
                .rowCount(request.getRowCount())
                .columnCount(request.getColumnCount())
                .type(request.getType())
                .status(request.getStatus())
                .build();

        return roomMapper.toRoomResponse(roomRepository.save(room));
    }

    @Transactional
    public RoomResponse updateRoom(String id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        Cinema cinema = cinemaRepository.findByIdAndStatus(request.getCinemaId(), CinemaStatus.ACTIVE)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_FOUND));

        String name = request.getName().trim();
        boolean cinemaChanged = !room.getCinema().getId().equals(cinema.getId());
        boolean nameChanged = !room.getName().equalsIgnoreCase(name);
        if ((cinemaChanged || nameChanged) && roomRepository.existsByCinemaIdAndNameIgnoreCase(cinema.getId(), name)) {
            throw new AppException(ErrorCode.ROOM_EXISTED);
        }

        room.setCinema(cinema);
        room.setName(name);
        room.setRowCount(request.getRowCount());
        room.setColumnCount(request.getColumnCount());
        room.setType(request.getType());
        room.setStatus(request.getStatus());

        return roomMapper.toRoomResponse(roomRepository.save(room));
    }

    @Transactional
    public RoomResponse updateRoomStatus(String id, RoomStatus status) {
        if (status == null) {
            throw new AppException(ErrorCode.ROOM_STATUS_REQUIRED);
        }

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        room.setStatus(status);
        return roomMapper.toRoomResponse(roomRepository.save(room));
    }

    @Transactional
    public void hideRoom(String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        room.setStatus(RoomStatus.DISABLED);
        roomRepository.save(room);
    }
}
