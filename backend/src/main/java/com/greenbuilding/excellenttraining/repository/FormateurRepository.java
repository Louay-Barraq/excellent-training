package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FormateurRepository extends JpaRepository<Formateur, Integer> {
    Optional<Formateur> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Formateur> findByType(String type);
}