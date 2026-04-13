package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Employeur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeurRepository extends JpaRepository<Employeur, Integer> {
    boolean existsByNomEmployeur(String nomEmployeur);
}