package com.duynam.cinema.configuration;

import java.util.HashSet;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.duynam.cinema.constant.PredefinedRole;
import com.duynam.cinema.constant.UserStatus;
import com.duynam.cinema.entity.Role;
import com.duynam.cinema.entity.User;
import com.duynam.cinema.exception.AppException;
import com.duynam.cinema.exception.ErrorCode;
import com.duynam.cinema.repository.RoleRepository;
import com.duynam.cinema.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties({JwtProperties.class, CorsProperties.class, BootstrapAdminProperties.class})
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    BootstrapAdminProperties bootstrapAdminProperties;
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            ensureRoleExists(roleRepository, PredefinedRole.USER_ROLE, "Người dùng");
            ensureRoleExists(roleRepository, PredefinedRole.ADMIN_ROLE, "Quản trị viên");

            if (!bootstrapAdminProperties.isEnabled()) {
                return;
            }

            validateBootstrapConfiguration();

            if (userRepository.findByEmail(bootstrapAdminProperties.getEmail()).isPresent()) {
                return;
            }

            Role adminRole = roleRepository.findById(PredefinedRole.ADMIN_ROLE)
                    .orElseThrow(() -> new IllegalStateException("ADMIN role must exist before bootstrap"));

            var roles = new HashSet<Role>();
            roles.add(adminRole);

            User admin = User.builder()
                    .email(bootstrapAdminProperties.getEmail().trim().toLowerCase())
                    .password(passwordEncoder.encode(bootstrapAdminProperties.getPassword()))
                    .fullName(bootstrapAdminProperties.getFullName())
                    .status(UserStatus.ACTIVE)
                    .roles(roles)
                    .build();

            userRepository.save(admin);
            log.warn("Đã tạo tài khoản Admin mặc định: {}", admin.getEmail());
        };
    }

    private void ensureRoleExists(RoleRepository roleRepository, String roleName, String description) {
        if (!roleRepository.existsById(roleName)) {
            roleRepository.save(Role.builder()
                    .name(roleName)
                    .description(description)
                    .build());
        }
    }

    private void validateBootstrapConfiguration() {
        if (isBlank(bootstrapAdminProperties.getEmail()) || isBlank(bootstrapAdminProperties.getPassword())) {
            throw new AppException(ErrorCode.BOOTSTRAP_CONFIG_MISSING);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
