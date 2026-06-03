package com.duynam.cinema.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.duynam.cinema.constant.RoomStatus;
import com.duynam.cinema.dto.request.RoomRequest;
import com.duynam.cinema.dto.response.ApiResponse;
import com.duynam.cinema.dto.response.RoomResponse;
import com.duynam.cinema.dto.response.SeatResponse;
import com.duynam.cinema.service.RoomService;
import com.duynam.cinema.service.SeatService;

import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminRoomController {
    RoomService roomService;
    SeatService seatService;

    @GetMapping
    ApiResponse<List<RoomResponse>> getRooms(@RequestParam(required = false) String cinemaId) {
        return ApiResponse.<List<RoomResponse>>builder()
                .result(roomService.getRooms(cinemaId))
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<RoomResponse> getRoom(@PathVariable String id) {
        return ApiResponse.<RoomResponse>builder()
                .result(roomService.getRoom(id))
                .build();
    }

    @PostMapping
    ApiResponse<RoomResponse> createRoom(@RequestBody @Valid RoomRequest request) {
        return ApiResponse.<RoomResponse>builder()
                .message("Thêm phòng chiếu thành công")
                .result(roomService.createRoom(request))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<RoomResponse> updateRoom(@PathVariable String id, @RequestBody @Valid RoomRequest request) {
        return ApiResponse.<RoomResponse>builder()
                .message("Cập nhật phòng chiếu thành công")
                .result(roomService.updateRoom(id, request))
                .build();
    }

    @PatchMapping("/{id}/status")
    ApiResponse<RoomResponse> updateRoomStatus(@PathVariable String id, @RequestParam RoomStatus status) {
        return ApiResponse.<RoomResponse>builder()
                .message("Cập nhật trạng thái phòng chiếu thành công")
                .result(roomService.updateRoomStatus(id, status))
                .build();
    }

    @PostMapping("/{id}/seats/generate")
    ApiResponse<List<SeatResponse>> generateSeats(@PathVariable String id) {
        return ApiResponse.<List<SeatResponse>>builder()
                .message("Tạo ghế tự động thành công")
                .result(seatService.generateSeats(id))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> hideRoom(@PathVariable String id) {
        roomService.hideRoom(id);

        return ApiResponse.<Void>builder()
                .message("Ẩn phòng chiếu thành công")
                .build();
    }
}
