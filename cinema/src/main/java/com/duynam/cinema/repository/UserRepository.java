package com.duynam.cinema.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.constant.UserStatus;
import com.duynam.cinema.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    @Query("""
            select distinct u
            from User u
            left join u.roles role
            where (:keyword is null
                or lower(u.fullName) like lower(concat('%', :keyword, '%'))
                or lower(u.email) like lower(concat('%', :keyword, '%'))
                or u.phone like concat('%', :keyword, '%'))
              and (:status is null or u.status = :status)
              and (:role is null or role.name = :role)
            order by u.email asc
            """)
    List<User> searchUsers(
            @Param("keyword") String keyword,
            @Param("status") UserStatus status,
            @Param("role") String role
    );
}
