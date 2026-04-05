package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.FormationDTO;
import com.greenbuilding.excellenttraining.dto.FormationResponseDTO;
import com.greenbuilding.excellenttraining.model.*;
import com.greenbuilding.excellenttraining.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FormationService {

    private final FormationRepository formationRepository;
    private final DomaineRepository domaineRepository;
    private final FormateurRepository formateurRepository;
    private final ParticipantRepository participantRepository;

    public List<Formation> findAll() {
        return formationRepository.findAll();
    }

    public Formation findById(long id) {
        return formationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Formation introuvable avec l'id : " + id));
    }

    public FormationResponseDTO create(FormationDTO dto) {
        Domaine domaine = domaineRepository.findById(dto.getDomaineId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Domaine introuvable avec l'id : " + dto.getDomaineId()));

        Formation formation = new Formation();
        formation.setTitre(dto.getTitre());
        formation.setAnnee(dto.getAnnee());
        formation.setDuree(dto.getDuree());
        formation.setBudget(dto.getBudget());
        formation.setDomaine(domaine);

        return toResponseDTO(formationRepository.save(formation));
    }

    public FormationResponseDTO update(long id, FormationDTO dto) {
        Formation formation = findById(id);

        Domaine domaine = domaineRepository.findById(dto.getDomaineId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Domaine introuvable avec l'id : " + dto.getDomaineId()));

        formation.setTitre(dto.getTitre());
        formation.setAnnee(dto.getAnnee());
        formation.setDuree(dto.getDuree());
        formation.setBudget(dto.getBudget());
        formation.setDomaine(domaine);

        return toResponseDTO(formationRepository.save(formation));
    }

    public void delete(long id) {
        if (!formationRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Formation introuvable avec l'id : " + id);
        }
        formationRepository.deleteById(id);
    }

    public FormationResponseDTO affecterFormateur(long formationId, int formateurId) {
        Formation formation = findById(formationId);

        Formateur formateur = formateurRepository.findById(formateurId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Formateur introuvable avec l'id : " + formateurId));

        formation.setFormateur(formateur);
        return toResponseDTO(formationRepository.save(formation));
    }

    @Transactional
    public int inscrireParticipants(long formationId, List<Integer> participantIds) {
        Formation formation = findById(formationId);
        int count = 0;

        for (Integer participantId : participantIds) {
            Participant participant = participantRepository.findById(participantId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Participant introuvable avec l'id : " + participantId));

            if (!formation.getParticipants().contains(participant)) {
                formation.addParticipant(participant);
                count++;
            }
        }

        formationRepository.save(formation);
        return count;
    }

    public FormationResponseDTO toResponseDTO(Formation f) {
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
        dto.setNombreParticipants(f.getParticipants() != null
                ? f.getParticipants().size() : 0);
        return dto;
    }
}