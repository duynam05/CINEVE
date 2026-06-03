package com.duynam.cinema.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.cinema.constant.SeatStatus;
import com.duynam.cinema.constant.SeatType;
import com.duynam.cinema.dto.request.SeatRequest;
import com.duynam.cinema.dto.response.SeatResponse;
import com.duynam.cinema.entity.Room;
import com.duynam.cinema.entity.Seat;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.SeatMapper;
import com.duynam.cinema.repository.RoomRepository;
import com.duynam.cinema.repository.SeatRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeatService {
    SeatRepository seatRepository;
    RoomRepository roomRepository;
    SeatMapper seatMapper;

    public List<SeatResponse> getSeatsByRoom(String roomId) {
        ensureRoomExists(roomId);

        return seatRepository.findAllByRoomIdOrderByRowNameAscColumnNumberAsc(roomId).stream()
                .map(seatMapper::toSeatResponse)
                .toList();
    }

    @Transactional
    public SeatResponse createSeat(SeatRequest request) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        String rowName = request.getRowName().trim().toUpperCase();
        String code = buildSeatCode(rowName, request.getColumnNumber());

        validateSeatPosition(room, rowName, request.getColumnNumber());
        if (seatRepository.existsByRoomIdAndCodeIgnoreCase(room.getId(), code)) {
            throw new AppException(ErrorCode.SEAT_EXISTED);
        }

        Seat seat = Seat.builder()
                .room(room)
                .code(code)
                .rowName(rowName)
                .columnNumber(request.getColumnNumber())
                .type(request.getType())
                .status(request.getStatus())
                .build();

        return seatMapper.toSeatResponse(seatRepository.save(seat));
    }

    @Transactional
    public SeatResponse updateSeat(String id, SeatRequest request) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        String rowName = request.getRowName().trim().toUpperCase();
        String code = buildSeatCode(rowName, request.getColumnNumber());

        validateSeatPosition(room, rowName, request.getColumnNumber());
        boolean roomChanged = !seat.getRoom().getId().equals(room.getId());
        boolean codeChanged = !seat.getCode().equalsIgnoreCase(code);
        if ((roomChanged || codeChanged) && seatRepository.existsByRoomIdAndCodeIgnoreCase(room.getId(), code)) {
            throw new AppException(ErrorCode.SEAT_EXISTED);
        }

        seat.setRoom(room);
        seat.setCode(code);
        seat.setRowName(rowName);
        seat.setColumnNumber(request.getColumnNumber());
        seat.setType(request.getType());
        seat.setStatus(request.getStatus());

        return seatMapper.toSeatResponse(seatRepository.save(seat));
    }

    @Transactional
    public SeatResponse updateSeatStatus(String id, SeatStatus status) {
        if (status == null) {
            throw new AppException(ErrorCode.SEAT_STATUS_REQUIRED);
        }

        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));

        seat.setStatus(status);
        return seatMapper.toSeatResponse(seatRepository.save(seat));
    }

    @Transactional
    public void hideSeat(String id) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_FOUND));

        seat.setStatus(SeatStatus.DISABLED);
        seatRepository.save(seat);
    }

    @Transactional
    public List<SeatResponse> generateSeats(String roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        seatRepository.deleteAllByRoomId(room.getId());

        List<Seat> seats = new ArrayList<>();
        for (int rowIndex = 0; rowIndex < room.getRowCount(); rowIndex++) {
            String rowName = toRowName(rowIndex);
            for (int columnNumber = 1; columnNumber <= room.getColumnCount(); columnNumber++) {
                seats.add(Seat.builder()
                        .room(room)
                        .code(buildSeatCode(rowName, columnNumber))
                        .rowName(rowName)
                        .columnNumber(columnNumber)
                        .type(resolveAutoSeatType(room, rowIndex))
                        .status(SeatStatus.ACTIVE)
                        .build());
            }
        }

        return seatRepository.saveAll(seats).stream()
                .map(seatMapper::toSeatResponse)
                .toList();
    }

    private void ensureRoomExists(String roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }
    }

    private void validateSeatPosition(Room room, String rowName, Integer columnNumber) {
        int rowIndex = rowNameToIndex(rowName);
        if (rowIndex >= room.getRowCount() || columnNumber > room.getColumnCount()) {
            throw new AppException(ErrorCode.SEAT_POSITION_INVALID);
        }
    }

    private SeatType resolveAutoSeatType(Room room, int rowIndex) {
        if (room.getType() == com.duynam.cinema.constant.RoomType.VIP) {
            return SeatType.VIP;
        }

        int lastRowIndex = room.getRowCount() - 1;
        if (rowIndex == lastRowIndex && room.getColumnCount() >= 2) {
            return SeatType.COUPLE;
        }

        return rowIndex >= room.getRowCount() / 2 ? SeatType.VIP : SeatType.NORMAL;
    }

    private String buildSeatCode(String rowName, Integer columnNumber) {
        return rowName + columnNumber;
    }

    private String toRowName(int rowIndex) {
        return String.valueOf((char) ('A' + rowIndex));
    }

    private int rowNameToIndex(String rowName) {
        if (rowName.length() != 1) {
            throw new AppException(ErrorCode.SEAT_ROW_INVALID);
        }

        return rowName.charAt(0) - 'A';
    }
}
