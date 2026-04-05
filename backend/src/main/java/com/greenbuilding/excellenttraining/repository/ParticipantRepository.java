package com.greenbuilding.excellenttraining.repository;

import com.greenbuilding.excellenttraining.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<Participant, Integer> {
    Optional<Participant> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Participant> findByStructureId(int structureId);
    List<Participant> findByProfilId(int profilId);
}