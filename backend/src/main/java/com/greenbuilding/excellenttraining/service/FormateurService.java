package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.FormateurDTO;
import com.greenbuilding.excellenttraining.dto.FormateurResponseDTO;
import com.greenbuilding.excellenttraining.model.Employeur;
import com.greenbuilding.excellenttraining.model.Formateur;
import com.greenbuilding.excellenttraining.repository.EmployeurRepository;
import com.greenbuilding.excellenttraining.repository.FormateurRepository;
import com.greenbuilding.excellenttraining.repository.FormationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FormateurService {

    private final FormateurRepository formateurRepository;
    private final EmployeurRepository employeurRepository;
    private final FormationRepository formationRepository;

    public List<FormateurResponseDTO> findAll() {
        return formateurRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public FormateurResponseDTO findById(int id) {
        Formateur formateur = formateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Formateur introuvable avec l'id : " + id));
        return toResponseDTO(formateur);
    }

    public Formateur findEntityById(int id) {
        return formateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Formateur introuvable avec l'id : " + id));
    }

    public Formateur create(FormateurDTO dto) {
        if (formateurRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException(
                    "Un formateur avec cet email existe déjà");
        }

        Formateur formateur = new Formateur();
        formateur.setNom(dto.getNom());
        formateur.setPrenom(dto.getPrenom());
        formateur.setEmail(dto.getEmail());
        formateur.setTel(dto.getTel());
        formateur.setType(dto.getType());

        if ("EXTERNE".equals(dto.getType()) && dto.getEmployeurId() != null) {
            Employeur employeur = employeurRepository.findById(dto.getEmployeurId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Employeur introuvable avec l'id : " + dto.getEmployeurId()));
            formateur.setEmployeur(employeur);
        }

        return formateurRepository.save(formateur);
    }

    public FormateurResponseDTO update(int id, FormateurDTO dto) {
        Formateur formateur = findEntityById(id);

        if (!formateur.getEmail().equals(dto.getEmail())
                && formateurRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException(
                    "Un formateur avec cet email existe déjà");
        }

        formateur.setNom(dto.getNom());
        formateur.setPrenom(dto.getPrenom());
        formateur.setEmail(dto.getEmail());
        formateur.setTel(dto.getTel());
        formateur.setType(dto.getType());

        if ("EXTERNE".equals(dto.getType()) && dto.getEmployeurId() != null) {
            Employeur employeur = employeurRepository.findById(dto.getEmployeurId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Employeur introuvable avec l'id : " + dto.getEmployeurId()));
            formateur.setEmployeur(employeur);
        } else {
            formateur.setEmployeur(null);
        }

        return toResponseDTO(formateurRepository.save(formateur));
    }

    public void delete(int id) {
        if (!formateurRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Formateur introuvable avec l'id : " + id);
        }
        if (formationRepository.existsByFormateurId(id)) {
            throw new IllegalArgumentException(
                    "Ce formateur est affecté à une ou plusieurs formations. " +
                    "Veuillez réaffecter ces formations avant de le supprimer.");
        }
        formateurRepository.deleteById(id);
    }

    public FormateurResponseDTO toResponseDTO(Formateur f) {
        FormateurResponseDTO dto = new FormateurResponseDTO();
        dto.setId(f.getId());
        dto.setNom(f.getNom());
        dto.setPrenom(f.getPrenom());
        dto.setEmail(f.getEmail());
        dto.setTel(f.getTel());
        dto.setType(f.getType());
        dto.setNomEmployeur(f.getEmployeur() != null
                ? f.getEmployeur().getNomEmployeur() : null);
        return dto;
    }
}