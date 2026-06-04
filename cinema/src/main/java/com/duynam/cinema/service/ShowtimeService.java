package com.duynam.cinema.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.cinema.constant.CinemaStatus;
import com.duynam.cinema.constant.MovieStatus;
import com.duynam.cinema.constant.RoomStatus;
import com.duynam.cinema.constant.SeatStatus;
import com.duynam.cinema.constant.ShowtimeSeatStatus;
import com.duynam.cinema.constant.ShowtimeStatus;
import com.duynam.cinema.dto.request.ShowtimeRequest;
import com.duynam.cinema.dto.response.ShowtimeResponse;
import com.duynam.cinema.dto.response.ShowtimeSeatMapResponse;
import com.duynam.cinema.dto.response.ShowtimeSeatResponse;
import com.duynam.cinema.entity.Movie;
import com.duynam.cinema.entity.Room;
import com.duynam.cinema.entity.Seat;
import com.duynam.cinema.entity.Showtime;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.ShowtimeMapper;
import com.duynam.cinema.repository.MovieRepository;
import com.duynam.cinema.repository.RoomRepository;
import com.duynam.cinema.repository.SeatRepository;
import com.duynam.cinema.repository.ShowtimeRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimeService {
    ShowtimeRepository showtimeRepository;
    MovieRepository movieRepository;
    RoomRepository roomRepository;
    SeatRepository seatRepository;
    ShowtimeMapper showtimeMapper;

    public List<ShowtimeResponse> searchPublicShowtimes(
            String movieId,
            String cinemaId,
            String roomId,
            LocalDate date
    ) {
        LocalDateTime fromTime = date == null ? null : date.atStartOfDay();
        LocalDateTime toTime = date == null ? null : date.plusDays(1).atStartOfDay();

        return showtimeRepository.searchPublicShowtimes(
                        normalizeId(movieId),
                        normalizeId(cinemaId),
                        normalizeId(roomId),
                        fromTime,
                        toTime,
                        ShowtimeStatus.CANCELLED)
                .stream()
                .map(showtimeMapper::toShowtimeResponse)
                .toList();
    }

    public ShowtimeResponse getPublicShowtime(String id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        if (showtime.getStatus() == ShowtimeStatus.CANCELLED) {
            throw new AppException(ErrorCode.SHOWTIME_NOT_FOUND);
        }

        return showtimeMapper.toShowtimeResponse(showtime);
    }

    public List<ShowtimeResponse> getPublicShowtimesByMovie(String movieId, LocalDate date) {
        ensureMovieVisible(movieId);
        return searchPublicShowtimes(movieId, null, null, date);
    }

    public List<ShowtimeResponse> getPublicShowtimesByCinema(String cinemaId, LocalDate date) {
        return searchPublicShowtimes(null, cinemaId, null, date);
    }

    public ShowtimeSeatMapResponse getShowtimeSeats(String showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        if (showtime.getStatus() == ShowtimeStatus.CANCELLED) {
            throw new AppException(ErrorCode.SHOWTIME_NOT_FOUND);
        }

        Room room = showtime.getRoom();
        List<ShowtimeSeatResponse> seats = seatRepository.findAllByRoomIdOrderByRowNameAscColumnNumberAsc(room.getId())
                .stream()
                .map(this::toShowtimeSeatResponse)
                .toList();

        return ShowtimeSeatMapResponse.builder()
                .showtimeId(showtime.getId())
                .showtimeStatus(showtime.getStatus())
                .movieId(showtime.getMovie().getId())
                .movieTitle(showtime.getMovie().getTitle())
                .cinemaId(room.getCinema().getId())
                .cinemaName(room.getCinema().getName())
                .roomId(room.getId())
                .roomName(room.getName())
                .rowCount(room.getRowCount())
                .columnCount(room.getColumnCount())
                .seats(seats)
                .build();
    }

    public List<ShowtimeResponse> searchAdminShowtimes(
            String movieId,
            String cinemaId,
            String roomId,
            LocalDate date
    ) {
        LocalDateTime fromTime = date == null ? null : date.atStartOfDay();
        LocalDateTime toTime = date == null ? null : date.plusDays(1).atStartOfDay();

        return showtimeRepository.searchAdminShowtimes(
                        normalizeId(movieId),
                        normalizeId(cinemaId),
                        normalizeId(roomId),
                        fromTime,
                        toTime)
                .stream()
                .map(showtimeMapper::toShowtimeResponse)
                .toList();
    }

    public ShowtimeResponse getAdminShowtime(String id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));

        return showtimeMapper.toShowtimeResponse(showtime);
    }

    @Transactional
    public ShowtimeResponse createShowtime(ShowtimeRequest request) {
        validateShowtimeTime(request.getStartTime(), request.getEndTime());

        Movie movie = movieRepository.findByIdAndStatusNot(request.getMovieId(), MovieStatus.HIDDEN)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        validateRoomAvailable(room);
        validateNoOverlap(room.getId(), request.getStartTime(), request.getEndTime(), null, request.getStatus());

        Showtime showtime = Showtime.builder()
                .movie(movie)
                .room(room)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .normalSeatPrice(request.getNormalSeatPrice())
                .vipSeatPrice(request.getVipSeatPrice())
                .coupleSeatPrice(request.getCoupleSeatPrice())
                .status(request.getStatus())
                .build();

        return showtimeMapper.toShowtimeResponse(showtimeRepository.save(showtime));
    }

    @Transactional
    public ShowtimeResponse updateShowtime(String id, ShowtimeRequest request) {
        validateShowtimeTime(request.getStartTime(), request.getEndTime());

        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));
        Movie movie = movieRepository.findByIdAndStatusNot(request.getMovieId(), MovieStatus.HIDDEN)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        validateRoomAvailable(room);
        validateNoOverlap(room.getId(), request.getStartTime(), request.getEndTime(), showtime.getId(), request.getStatus());

        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStartTime(request.getStartTime());
        showtime.setEndTime(request.getEndTime());
        showtime.setNormalSeatPrice(request.getNormalSeatPrice());
        showtime.setVipSeatPrice(request.getVipSeatPrice());
        showtime.setCoupleSeatPrice(request.getCoupleSeatPrice());
        showtime.setStatus(request.getStatus());

        return showtimeMapper.toShowtimeResponse(showtimeRepository.save(showtime));
    }

    @Transactional
    public void cancelShowtime(String id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_FOUND));

        showtime.setStatus(ShowtimeStatus.CANCELLED);
        showtimeRepository.save(showtime);
    }

    private void validateShowtimeTime(LocalDateTime startTime, LocalDateTime endTime) {
        if (!endTime.isAfter(startTime)) {
            throw new AppException(ErrorCode.SHOWTIME_TIME_INVALID);
        }
    }

    private void validateRoomAvailable(Room room) {
        if (room.getStatus() != RoomStatus.ACTIVE || room.getCinema().getStatus() != CinemaStatus.ACTIVE) {
            throw new AppException(ErrorCode.ROOM_NOT_FOUND);
        }
    }

    private void validateNoOverlap(
            String roomId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            String excludeId,
            ShowtimeStatus newStatus
    ) {
        if (newStatus == ShowtimeStatus.CANCELLED) {
            return;
        }

        if (showtimeRepository.existsOverlappingShowtime(roomId, startTime, endTime, excludeId)) {
            throw new AppException(ErrorCode.SHOWTIME_OVERLAPPED);
        }
    }

    private void ensureMovieVisible(String movieId) {
        movieRepository.findByIdAndStatusNot(movieId, MovieStatus.HIDDEN)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
    }

    private ShowtimeSeatResponse toShowtimeSeatResponse(Seat seat) {
        return ShowtimeSeatResponse.builder()
                .id(seat.getId())
                .code(seat.getCode())
                .rowName(seat.getRowName())
                .columnNumber(seat.getColumnNumber())
                .type(seat.getType())
                .seatStatus(seat.getStatus())
                .showtimeSeatStatus(resolveShowtimeSeatStatus(seat))
                .build();
    }

    private ShowtimeSeatStatus resolveShowtimeSeatStatus(Seat seat) {
        if (seat.getStatus() == SeatStatus.MAINTENANCE) {
            return ShowtimeSeatStatus.MAINTENANCE;
        }
        if (seat.getStatus() == SeatStatus.DISABLED) {
            return ShowtimeSeatStatus.DISABLED;
        }

        return ShowtimeSeatStatus.AVAILABLE;
    }

    private String normalizeId(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
