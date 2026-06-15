package com.duynam.cinema.dto.response;

import java.time.Instant;

import com.duynam.cinema.constant.NotificationType;
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
public class NotificationResponse {
    String id;
    NotificationType type;
    String title;
    String content;
    String targetId;
    Boolean read;
    Instant readAt;
    Instant createdAt;
}
