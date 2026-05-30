package com.duynam.cinema.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@ConfigurationProperties(prefix = "app.bootstrap.admin")
public class BootstrapAdminProperties {
    boolean enabled;
    String email;
    String password;
    String fullName;
}
