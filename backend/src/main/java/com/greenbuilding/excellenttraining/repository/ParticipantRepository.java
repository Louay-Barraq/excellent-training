package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Participant;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<Participant, Integer> {
    Optional<Participant> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByStructureId(int structureId);
    boolean existsByProfilId(int profilId);
    List<Participant> findByStructureId(int structureId);
    List<Participant> findByProfilId(int profilId);
    @Query("SELECT p.structure.libelle, COUNT(p) FROM Participant p GROUP BY p.structure.libelle")
    List<Object[]> countByStructure();

    // Count participants by profil
    @Query("SELECT p.profil.libelle, COUNT(p) FROM Participant p GROUP BY p.profil.libelle")
    List<Object[]> countByProfil();

    // Participants with the most inscriptions (top 5)
    @Query("SELECT p.nom, p.prenom, p.structure.libelle, COUNT(f) FROM Participant p LEFT JOIN Formation f ON p MEMBER OF f.participants GROUP BY p.id, p.nom, p.prenom, p.structure.libelle ORDER BY COUNT(f) DESC")
    List<Object[]> topParticipants(Pageable pageable);

    // Participants with zero inscriptions
    @Query("SELECT COUNT(p) FROM Participant p WHERE p NOT IN (SELECT pt FROM Formation f JOIN f.participants pt)")
    long countWithoutInscription();

    // Count participants by structure AND profil (for heatmap)
    @Query("SELECT p.structure.libelle, p.profil.libelle, COUNT(p) FROM Participant p GROUP BY p.structure.libelle, p.profil.libelle")
    List<Object[]> countByStructureAndProfil();

    // Total inscriptions per structure
    @Query("SELECT p.structure.libelle, COUNT(f) FROM Participant p LEFT JOIN Formation f ON p MEMBER OF f.participants GROUP BY p.structure.libelle")
    List<Object[]> inscriptionsParStructure();
}