package com.duynam.cinema.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.duynam.cinema.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
}
