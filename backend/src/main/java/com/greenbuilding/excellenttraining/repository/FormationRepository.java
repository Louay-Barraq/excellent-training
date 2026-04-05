package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {

    List<Formation> findByAnnee(int annee);
    List<Formation> findByDomaineId(int domaineId);

    // Stats pour le dashboard du Responsable
    @Query("SELECT f.annee, COUNT(f) FROM Formation f GROUP BY f.annee ORDER BY f.annee")
    List<Object[]> countByAnnee();

    @Query("SELECT f.domaine.libelle, SUM(f.budget) FROM Formation f GROUP BY f.domaine.libelle")
    List<Object[]> sumBudgetByDomaine();

    @Query("SELECT COUNT(f) > 0 FROM Formation f WHERE f.domaine.id = :domaineId")
    boolean existsByDomaineId(@Param("domaineId") int domaineId);

    @Query("SELECT COUNT(f) > 0 FROM Formation f WHERE f.formateur.id = :formateurId")
    boolean existsByFormateurId(@Param("formateurId") int formateurId);
}