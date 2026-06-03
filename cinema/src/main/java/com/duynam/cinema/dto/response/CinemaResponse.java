package com.duynam.cinema.dto.response;

import java.time.Instant;

import com.duynam.cinema.constant.CinemaStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CinemaResponse {
    String id;
    String name;
    String slug;
    String address;
    String city;
    String phone;
    String email;
    String description;
    CinemaStatus status;
    Instant createdAt;
    Instant updatedAt;
}
