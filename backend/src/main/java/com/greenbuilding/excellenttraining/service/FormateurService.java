package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.FormateurDTO;
import com.greenbuilding.excellenttraining.model.Employeur;
import com.greenbuilding.excellenttraining.model.Formateur;
import com.greenbuilding.excellenttraining.repository.EmployeurRepository;
import com.greenbuilding.excellenttraining.repository.FormateurRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FormateurService {

    private final FormateurRepository formateurRepository;
    private final EmployeurRepository employeurRepository;

    public List<Formateur> findAll() {
        return formateurRepository.findAll();
    }

    public Formateur findById(int id) {
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

    public Formateur update(int id, FormateurDTO dto) {
        Formateur formateur = findById(id);

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

        return formateurRepository.save(formateur);
    }

    public void delete(int id) {
        if (!formateurRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Formateur introuvable avec l'id : " + id);
        }
        formateurRepository.deleteById(id);
    }
}