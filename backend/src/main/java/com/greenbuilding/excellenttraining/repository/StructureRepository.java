package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Structure;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StructureRepository extends JpaRepository<Structure, Integer> {
    Optional<Structure> findByLibelle(String libelle);
    boolean existsByLibelle(String libelle);
}