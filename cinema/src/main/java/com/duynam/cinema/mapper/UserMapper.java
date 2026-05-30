package com.duynam.cinema.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.duynam.cinema.dto.request.RegisterRequest;
import com.duynam.cinema.dto.response.RoleResponse;
import com.duynam.cinema.dto.response.UserResponse;
import com.duynam.cinema.entity.Role;
import com.duynam.cinema.entity.User;

@Component
public class UserMapper {
    public User toUser(RegisterRequest request) {
        return User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phone(normalizeNullable(request.getPhone()))
                .build();
    }

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .roles(toRoleResponses(user.getRoles()))
                .build();
    }

    private Set<RoleResponse> toRoleResponses(Set<Role> roles) {
        if (roles == null) {
            return Set.of();
        }

        return roles.stream()
                .map(role -> RoleResponse.builder()
                        .name(role.getName())
                        .description(role.getDescription())
                        .build())
                .collect(Collectors.toSet());
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}
