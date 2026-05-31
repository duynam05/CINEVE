package com.duynam.cinema.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.constant.AuthTokenType;
import com.duynam.cinema.entity.AuthToken;

@Repository
public interface AuthTokenRepository extends JpaRepository<AuthToken, String> {
    Optional<AuthToken> findFirstByUserEmailAndTypeAndOtpAndUsedAtIsNullOrderByExpiresAtDesc(
            String email,
            AuthTokenType type,
            String otp
    );

    Optional<AuthToken> findByTokenAndTypeAndUsedAtIsNull(String token, AuthTokenType type);
}
