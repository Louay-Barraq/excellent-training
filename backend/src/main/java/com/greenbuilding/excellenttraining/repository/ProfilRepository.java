package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfilRepository extends JpaRepository<Profil, Integer> {
    Optional<Profil> findByLibelle(String libelle);
    boolean existsByLibelle(String libelle);
}