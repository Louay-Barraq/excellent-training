package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Formation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FormationRepository extends JpaRepository<Formation, Long> {

    List<Formation> findByAnnee(int annee);
    List<Formation> findByDomaineId(int domaineId);
    List<Formation> findByParticipantsId(int participantId);

    // Stats pour le dashboard du Responsable
    @Query("SELECT f.annee, COUNT(f) FROM Formation f GROUP BY f.annee ORDER BY f.annee")
    List<Object[]> countByAnnee();

    @Query("SELECT f.domaine.libelle, SUM(f.budget) FROM Formation f GROUP BY f.domaine.libelle")
    List<Object[]> sumBudgetByDomaine();

    @Query("SELECT COUNT(f) > 0 FROM Formation f WHERE f.domaine.id = :domaineId")
    boolean existsByDomaineId(@Param("domaineId") int domaineId);

    @Query("SELECT COUNT(f) > 0 FROM Formation f WHERE f.formateur.id = :formateurId")
    boolean existsByFormateurId(@Param("formateurId") int formateurId);
    @Query("SELECT f.titre, COUNT(p) FROM Formation f JOIN f.participants p GROUP BY f.id, f.titre ORDER BY COUNT(p) DESC")
    List<Object[]> findTopFormations(Pageable pageable);

    @Query("SELECT f.id, f.titre, f.annee, f.domaine.libelle FROM Formation f ORDER BY f.id DESC")
    List<Object[]> findRecentActivities(Pageable pageable);

    // Average budget across all formations
    @Query("SELECT AVG(f.budget) FROM Formation f")
    Double avgBudget();

    // Average duration across all formations
    @Query("SELECT AVG(f.duree) FROM Formation f")
    Double avgDuree();

    // Formations grouped by domain with budget sum AND count
    @Query("SELECT f.domaine.libelle, COUNT(f), SUM(f.budget), AVG(f.budget) FROM Formation f GROUP BY f.domaine.libelle")
    List<Object[]> statsByDomaine();

    // Formations grouped by year with budget sum AND count
    @Query("SELECT f.annee, COUNT(f), SUM(f.budget) FROM Formation f GROUP BY f.annee ORDER BY f.annee")
    List<Object[]> statsByAnnee();

    // Formations without a formateur assigned
    @Query("SELECT COUNT(f) FROM Formation f WHERE f.formateur IS NULL")
    long countWithoutFormateur();

    // Formations without any participants
    @Query("SELECT COUNT(f) FROM Formation f WHERE f.participants IS EMPTY")
    long countWithoutParticipants();

    // Most expensive formations (top 5)
    @Query("SELECT f.titre, f.budget, f.annee, f.domaine.libelle FROM Formation f ORDER BY f.budget DESC")
    List<Object[]> topByBudget(Pageable pageable);

    // Number of inscriptions (total rows in join table) per year
    @Query("SELECT f.annee, COUNT(p) FROM Formation f JOIN f.participants p GROUP BY f.annee ORDER BY f.annee")
    List<Object[]> inscriptionsParAnnee();

    // Number of participants per formation (for average calculation)
    @Query("SELECT f.titre, COUNT(p), f.budget FROM Formation f LEFT JOIN f.participants p GROUP BY f.id, f.titre, f.budget")
    List<Object[]> participantsParFormation();
}