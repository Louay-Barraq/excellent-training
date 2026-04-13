package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Formateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FormateurRepository extends JpaRepository<Formateur, Integer> {
    Optional<Formateur> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Formateur> findByType(String type);
    boolean existsByEmployeurId(int employeurId);
    List<Formateur> findByEmployeurId(int employeurId);

    // Count by type (INTERNE vs EXTERNE)
    @Query("SELECT f.type, COUNT(f) FROM Formateur f GROUP BY f.type")
    List<Object[]> countByType();

    // Formateurs with their number of assigned formations
    @Query("SELECT f.nom, f.prenom, f.type, COUNT(fm) FROM Formateur f LEFT JOIN Formation fm ON fm.formateur = f GROUP BY f.id, f.nom, f.prenom, f.type ORDER BY COUNT(fm) DESC")
    List<Object[]> formateursAvecNbFormations();

    // Formateurs with zero formations assigned
    @Query("SELECT COUNT(f) FROM Formateur f WHERE f NOT IN (SELECT DISTINCT fm.formateur FROM Formation fm WHERE fm.formateur IS NOT NULL)")
    long countWithoutFormation();
}