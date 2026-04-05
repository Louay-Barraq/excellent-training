package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByNom(String nom);
}