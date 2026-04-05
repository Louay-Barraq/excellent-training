package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    Optional<Utilisateur> findByLogin(String login);
    boolean existsByLogin(String login);
}