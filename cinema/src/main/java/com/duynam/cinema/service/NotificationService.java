package com.duynam.cinema.service;

import java.time.Instant;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.duynam.cinema.constant.NotificationType;
import com.duynam.cinema.dto.response.NotificationResponse;
import com.duynam.cinema.entity.Notification;
import com.duynam.cinema.entity.User;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.NotificationMapper;
import com.duynam.cinema.repository.NotificationRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService {
    NotificationRepository notificationRepository;
    NotificationMapper notificationMapper;

    public List<NotificationResponse> getMyNotifications() {
        return notificationRepository.findAllByUserEmailOrderByCreatedAtDesc(getCurrentEmail()).stream()
                .map(notificationMapper::toNotificationResponse)
                .toList();
    }

    @Transactional
    public NotificationResponse markAsRead(String id) {
        Notification notification = getMyNotification(id);
        notification.setRead(true);
        notification.setReadAt(Instant.now());
        return notificationMapper.toNotificationResponse(notificationRepository.save(notification));
    }

    @Transactional
    public void deleteMyNotification(String id) {
        notificationRepository.delete(getMyNotification(id));
    }

    @Transactional
    public void create(User user, NotificationType type, String title, String content, String targetId) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .content(content)
                .targetId(targetId)
                .read(false)
                .build();
        notificationRepository.save(notification);
    }

    private Notification getMyNotification(String id) {
        return notificationRepository.findByIdAndUserEmail(id, getCurrentEmail())
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
    }

    private String getCurrentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
