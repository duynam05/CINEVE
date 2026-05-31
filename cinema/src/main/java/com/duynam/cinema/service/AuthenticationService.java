package com.duynam.cinema.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.duynam.cinema.configuration.JwtProperties;
import com.duynam.cinema.constant.UserStatus;
import com.duynam.cinema.dto.request.AuthenticationRequest;
import com.duynam.cinema.dto.request.LogoutRequest;
import com.duynam.cinema.dto.request.RefreshTokenRequest;
import com.duynam.cinema.dto.response.AuthenticationResponse;
import com.duynam.cinema.entity.InvalidatedToken;
import com.duynam.cinema.entity.RefreshToken;
import com.duynam.cinema.entity.User;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.UserMapper;
import com.duynam.cinema.repository.InvalidatedTokenRepository;
import com.duynam.cinema.repository.RefreshTokenRepository;
import com.duynam.cinema.repository.UserRepository;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtProperties jwtProperties;
    UserMapper userMapper;
    RefreshTokenRepository refreshTokenRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        assertUserIsActive(user);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return AuthenticationResponse.builder()
                .token(generateToken(user))
                .refreshToken(createRefreshToken(user).getToken())
                .authenticated(true)
                .user(userMapper.toUserResponse(user))
                .build();
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndRevokedFalse(request.getRefreshToken().trim())
                .orElseThrow(() -> new AppException(ErrorCode.REFRESH_TOKEN_INVALID_OR_EXPIRED));

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new AppException(ErrorCode.REFRESH_TOKEN_INVALID_OR_EXPIRED);
        }

        User user = refreshToken.getUser();
        assertUserIsActive(user);

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        return AuthenticationResponse.builder()
                .token(generateToken(user))
                .refreshToken(createRefreshToken(user).getToken())
                .authenticated(true)
                .user(userMapper.toUserResponse(user))
                .build();
    }

    public void logout(String authorizationHeader, LogoutRequest request) {
        String accessToken = extractBearerToken(authorizationHeader);
        if (StringUtils.hasText(accessToken)) {
            invalidateAccessToken(accessToken);
        }

        if (request != null && StringUtils.hasText(request.getRefreshToken())) {
            refreshTokenRepository.findByTokenAndRevokedFalse(request.getRefreshToken().trim())
                    .ifPresent(refreshToken -> {
                        refreshToken.setRevoked(true);
                        refreshTokenRepository.save(refreshToken);
                    });
        }
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("cineve")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(jwtProperties.getValidDuration(), ChronoUnit.SECONDS)))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        JWSObject jwsObject = new JWSObject(header, new Payload(claimsSet.toJSONObject()));

        try {
            jwsObject.sign(new MACSigner(jwtProperties.getSignerKey().getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException exception) {
            log.error("Không thể tạo JWT", exception);
            throw new AppException(ErrorCode.TOKEN_CREATION_FAILED);
        }
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiresAt(Instant.now().plus(jwtProperties.getRefreshableDuration(), ChronoUnit.SECONDS))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    private void invalidateAccessToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            boolean verified = signedJWT.verify(new MACVerifier(jwtProperties.getSignerKey().getBytes()));
            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            String jwtId = signedJWT.getJWTClaimsSet().getJWTID();

            if (!verified || expirationTime == null || jwtId == null) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            if (expirationTime.toInstant().isAfter(Instant.now())) {
                invalidatedTokenRepository.save(InvalidatedToken.builder()
                        .id(jwtId)
                        .expiresAt(expirationTime.toInstant())
                        .build());
            }
        } catch (Exception exception) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> stringJoiner.add("ROLE_" + role.getName()));
        }

        return stringJoiner.toString();
    }

    private void assertUserIsActive(User user) {
        if (UserStatus.DISABLED.equals(user.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        }
        if (UserStatus.PENDING_VERIFICATION.equals(user.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_VERIFIED);
        }
    }

    private String extractBearerToken(String authorizationHeader) {
        if (!StringUtils.hasText(authorizationHeader) || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        return authorizationHeader.substring(7);
    }
}
