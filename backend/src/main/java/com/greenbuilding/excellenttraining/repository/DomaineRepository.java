package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Domaine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DomaineRepository extends JpaRepository<Domaine, Integer> {
    Optional<Domaine> findByLibelle(String libelle);
    boolean existsByLibelle(String libelle);
}