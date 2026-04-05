package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.ParticipantDTO;
import com.greenbuilding.excellenttraining.model.Participant;
import com.greenbuilding.excellenttraining.model.Profil;
import com.greenbuilding.excellenttraining.model.Structure;
import com.greenbuilding.excellenttraining.repository.ParticipantRepository;
import com.greenbuilding.excellenttraining.repository.ProfilRepository;
import com.greenbuilding.excellenttraining.repository.StructureRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final StructureRepository structureRepository;
    private final ProfilRepository profilRepository;

    public List<Participant> findAll() {
        return participantRepository.findAll();
    }

    public Participant findById(int id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Participant introuvable avec l'id : " + id));
    }

    public Participant create(ParticipantDTO dto) {
        if (participantRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException(
                    "Un participant avec cet email existe déjà");
        }

        Structure structure = structureRepository.findById(dto.getStructureId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Structure introuvable avec l'id : " + dto.getStructureId()));

        Profil profil = profilRepository.findById(dto.getProfilId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Profil introuvable avec l'id : " + dto.getProfilId()));

        Participant participant = new Participant();
        participant.setNom(dto.getNom());
        participant.setPrenom(dto.getPrenom());
        participant.setEmail(dto.getEmail());
        participant.setTel(dto.getTel());
        participant.setStructure(structure);
        participant.setProfil(profil);

        return participantRepository.save(participant);
    }

    public Participant update(int id, ParticipantDTO dto) {
        Participant participant = findById(id);

        if (!participant.getEmail().equals(dto.getEmail())
                && participantRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException(
                    "Un participant avec cet email existe déjà");
        }

        Structure structure = structureRepository.findById(dto.getStructureId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Structure introuvable avec l'id : " + dto.getStructureId()));

        Profil profil = profilRepository.findById(dto.getProfilId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Profil introuvable avec l'id : " + dto.getProfilId()));

        participant.setNom(dto.getNom());
        participant.setPrenom(dto.getPrenom());
        participant.setEmail(dto.getEmail());
        participant.setTel(dto.getTel());
        participant.setStructure(structure);
        participant.setProfil(profil);

        return participantRepository.save(participant);
    }

    public void delete(int id) {
        if (!participantRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Participant introuvable avec l'id : " + id);
        }
        participantRepository.deleteById(id);
    }
}