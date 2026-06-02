package com.duynam.cinema.entity;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

import com.duynam.cinema.constant.MovieStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false, unique = true, length = 180)
    String title;

    @Column(nullable = false, unique = true, length = 220)
    String slug;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(nullable = false)
    Integer durationMinutes;

    @Column(length = 150)
    String director;

    @Column(length = 1000)
    String actors;

    @Column(length = 80)
    String language;

    @Column(length = 80)
    String country;

    @Column(length = 20)
    String ageRating;

    LocalDate releaseDate;

    @Column(length = 500)
    String posterUrl;

    @Column(length = 500)
    String trailerUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 30)
    MovieStatus status = MovieStatus.COMING_SOON;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "movie_genres")
    Set<Genre> genres;

    @Column(nullable = false, updatable = false)
    Instant createdAt;

    @Column(nullable = false)
    Instant updatedAt;

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }
}
