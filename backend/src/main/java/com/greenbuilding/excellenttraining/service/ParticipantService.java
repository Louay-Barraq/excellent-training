package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.ParticipantDTO;
import com.greenbuilding.excellenttraining.dto.ParticipantResponseDTO;
import com.greenbuilding.excellenttraining.dto.FormationResponseDTO;
import com.greenbuilding.excellenttraining.model.Participant;
import com.greenbuilding.excellenttraining.model.Profil;
import com.greenbuilding.excellenttraining.model.Structure;
import com.greenbuilding.excellenttraining.model.Formation;
import com.greenbuilding.excellenttraining.repository.FormationRepository;
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
    private final FormationRepository formationRepository;

    public List<ParticipantResponseDTO> findAll() {
        return participantRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public ParticipantResponseDTO findById(int id) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Participant introuvable avec l'id : " + id));
        return toResponseDTO(participant);
    }

    public Participant findEntityById(int id) {
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

    public ParticipantResponseDTO update(int id, ParticipantDTO dto) {
        Participant participant = findEntityById(id);

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

        return toResponseDTO(participantRepository.save(participant));
    }

    public void delete(int id) {
        if (!participantRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Participant introuvable avec l'id : " + id);
        }
        participantRepository.deleteById(id);
    }

    public ParticipantResponseDTO toResponseDTO(Participant p) {
        ParticipantResponseDTO dto = new ParticipantResponseDTO();
        dto.setId(p.getId());
        dto.setNom(p.getNom());
        dto.setPrenom(p.getPrenom());
        dto.setEmail(p.getEmail());
        dto.setTel(p.getTel());
        dto.setStructureLibelle(p.getStructure().getLibelle());
        dto.setProfilLibelle(p.getProfil().getLibelle());
        return dto;
    }

    public List<FormationResponseDTO> listFormations(int participantId) {
        // Ensure participant exists to return 404 (not empty list for unknown id)
        if (!participantRepository.existsById(participantId)) {
            throw new EntityNotFoundException("Participant introuvable avec l'id : " + participantId);
        }
        return formationRepository.findByParticipantsId(participantId)
                .stream()
                .map(this::toFormationResponseDTO)
                .toList();
    }

    private FormationResponseDTO toFormationResponseDTO(Formation f) {
        FormationResponseDTO dto = new FormationResponseDTO();
        dto.setId(f.getId());
        dto.setTitre(f.getTitre());
        dto.setAnnee(f.getAnnee());
        dto.setDuree(f.getDuree());
        dto.setBudget(f.getBudget());
        dto.setDomaineLibelle(f.getDomaine() != null ? f.getDomaine().getLibelle() : null);
        dto.setFormateurNomComplet(f.getFormateur() != null
                ? f.getFormateur().getNom() + " " + f.getFormateur().getPrenom()
                : null);
        dto.setNombreParticipants(f.getParticipants() != null ? f.getParticipants().size() : 0);
        return dto;
    }
}