package com.duynam.cinema.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.duynam.cinema.constant.AuthTokenType;
import com.duynam.cinema.constant.PredefinedRole;
import com.duynam.cinema.constant.UserStatus;
import com.duynam.cinema.dto.request.ChangePasswordRequest;
import com.duynam.cinema.dto.request.ForgotPasswordRequest;
import com.duynam.cinema.dto.request.RegisterRequest;
import com.duynam.cinema.dto.request.ResendEmailVerificationRequest;
import com.duynam.cinema.dto.request.ResetPasswordRequest;
import com.duynam.cinema.dto.request.VerifyEmailRequest;
import com.duynam.cinema.dto.response.EmailVerificationResponse;
import com.duynam.cinema.dto.response.ForgotPasswordResponse;
import com.duynam.cinema.dto.response.RegisterResponse;
import com.duynam.cinema.dto.response.UserResponse;
import com.duynam.cinema.entity.AuthToken;
import com.duynam.cinema.entity.Role;
import com.duynam.cinema.entity.User;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.mapper.UserMapper;
import com.duynam.cinema.repository.AuthTokenRepository;
import com.duynam.cinema.repository.RoleRepository;
import com.duynam.cinema.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final long EMAIL_VERIFICATION_DURATION_MINUTES = 15;
    private static final long PASSWORD_RESET_DURATION_MINUTES = 15;

    UserRepository userRepository;
    RoleRepository roleRepository;
    AuthTokenRepository authTokenRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public RegisterResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        Role userRole = roleRepository.findById(PredefinedRole.USER_ROLE)
                .orElseThrow(() -> new IllegalStateException("USER role must exist before registering users"));

        var roles = new HashSet<Role>();
        roles.add(userRole);

        User user = userMapper.toUser(request);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.PENDING_VERIFICATION);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        AuthToken verificationToken = createAuthToken(savedUser, AuthTokenType.EMAIL_VERIFICATION, EMAIL_VERIFICATION_DURATION_MINUTES);

        return RegisterResponse.builder()
                .user(userMapper.toUserResponse(savedUser))
                .verificationOtp(verificationToken.getOtp())
                .build();
    }

    public UserResponse verifyEmail(VerifyEmailRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        AuthToken token = authTokenRepository
                .findFirstByUserEmailAndTypeAndOtpAndUsedAtIsNullOrderByExpiresAtDesc(
                        email,
                        AuthTokenType.EMAIL_VERIFICATION,
                        request.getOtp().trim())
                .orElseThrow(() -> new AppException(ErrorCode.OTP_INVALID_OR_EXPIRED));

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new AppException(ErrorCode.OTP_INVALID_OR_EXPIRED);
        }

        User user = token.getUser();
        if (UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_ALREADY_VERIFIED);
        }

        user.setStatus(UserStatus.ACTIVE);
        token.setUsedAt(Instant.now());
        userRepository.save(user);
        authTokenRepository.save(token);

        return userMapper.toUserResponse(user);
    }

    public EmailVerificationResponse resendEmailVerification(ResendEmailVerificationRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_ALREADY_VERIFIED);
        }

        AuthToken token = createAuthToken(user, AuthTokenType.EMAIL_VERIFICATION, EMAIL_VERIFICATION_DURATION_MINUTES);

        return EmailVerificationResponse.builder()
                .verificationOtp(token.getOtp())
                .build();
    }

    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (UserStatus.DISABLED.equals(user.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        }

        AuthToken token = createAuthToken(user, AuthTokenType.PASSWORD_RESET, PASSWORD_RESET_DURATION_MINUTES);

        return ForgotPasswordResponse.builder()
                .resetToken(token.getToken())
                .otp(token.getOtp())
                .build();
    }

    public void resetPassword(ResetPasswordRequest request) {
        AuthToken token = authTokenRepository
                .findByTokenAndTypeAndUsedAtIsNull(request.getResetToken().trim(), AuthTokenType.PASSWORD_RESET)
                .orElseThrow(() -> new AppException(ErrorCode.RESET_TOKEN_INVALID_OR_EXPIRED));

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new AppException(ErrorCode.RESET_TOKEN_INVALID_OR_EXPIRED);
        }

        User user = token.getUser();
        if (UserStatus.DISABLED.equals(user.getStatus())) {
            throw new AppException(ErrorCode.ACCOUNT_DISABLED);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        token.setUsedAt(Instant.now());
        userRepository.save(user);
        authTokenRepository.save(token);
    }

    public UserResponse getMyInfo() {
        return userMapper.toUserResponse(getCurrentUser());
    }

    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CURRENT_PASSWORD);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    private AuthToken createAuthToken(User user, AuthTokenType type, long validMinutes) {
        AuthToken token = AuthToken.builder()
                .user(user)
                .type(type)
                .token(UUID.randomUUID().toString())
                .otp(generateOtp())
                .expiresAt(Instant.now().plus(validMinutes, ChronoUnit.MINUTES))
                .build();

        return authTokenRepository.save(token);
    }

    private String generateOtp() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }
}
