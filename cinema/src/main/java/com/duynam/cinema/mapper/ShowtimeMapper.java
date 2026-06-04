package com.duynam.cinema.mapper;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.response.ShowtimeResponse;
import com.duynam.cinema.entity.Showtime;

@Component
public class ShowtimeMapper {
    public ShowtimeResponse toShowtimeResponse(Showtime showtime) {
        return ShowtimeResponse.builder()
                .id(showtime.getId())
                .movieId(showtime.getMovie().getId())
                .movieTitle(showtime.getMovie().getTitle())
                .movieStatus(showtime.getMovie().getStatus())
                .cinemaId(showtime.getRoom().getCinema().getId())
                .cinemaName(showtime.getRoom().getCinema().getName())
                .roomId(showtime.getRoom().getId())
                .roomName(showtime.getRoom().getName())
                .roomType(showtime.getRoom().getType())
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .normalSeatPrice(showtime.getNormalSeatPrice())
                .vipSeatPrice(showtime.getVipSeatPrice())
                .coupleSeatPrice(showtime.getCoupleSeatPrice())
                .status(showtime.getStatus())
                .createdAt(showtime.getCreatedAt())
                .updatedAt(showtime.getUpdatedAt())
                .build();
    }
}
