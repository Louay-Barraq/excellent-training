package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.UtilisateurDTO;
import com.greenbuilding.excellenttraining.dto.UtilisateurResponseDTO;
import com.greenbuilding.excellenttraining.model.Role;
import com.greenbuilding.excellenttraining.model.Utilisateur;
import com.greenbuilding.excellenttraining.repository.RoleRepository;
import com.greenbuilding.excellenttraining.repository.UtilisateurRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UtilisateurResponseDTO> findAll() {
        return utilisateurRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public UtilisateurResponseDTO create(UtilisateurDTO dto) {
        if (utilisateurRepository.existsByLogin(dto.getLogin())) {
            throw new IllegalArgumentException(
                    "Le login '" + dto.getLogin() + "' est déjà utilisé");
        }

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Rôle introuvable avec l'id : " + dto.getRoleId()));

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setLogin(dto.getLogin());
        utilisateur.setPassword(passwordEncoder.encode(dto.getPassword()));
        utilisateur.setRole(role);

        return toResponseDTO(utilisateurRepository.save(utilisateur));
    }

    public UtilisateurResponseDTO update(int id, UtilisateurDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Utilisateur introuvable avec l'id : " + id));

        if (!utilisateur.getLogin().equals(dto.getLogin())
                && utilisateurRepository.existsByLogin(dto.getLogin())) {
            throw new IllegalArgumentException(
                    "Le login '" + dto.getLogin() + "' est déjà utilisé");
        }

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Rôle introuvable avec l'id : " + dto.getRoleId()));

        utilisateur.setLogin(dto.getLogin());
        utilisateur.setPassword(passwordEncoder.encode(dto.getPassword()));
        utilisateur.setRole(role);

        return toResponseDTO(utilisateurRepository.save(utilisateur));
    }

    public void delete(int id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new EntityNotFoundException(
                    "Utilisateur introuvable avec l'id : " + id);
        }
        utilisateurRepository.deleteById(id);
    }

    public UtilisateurResponseDTO toResponseDTO(Utilisateur u) {
        UtilisateurResponseDTO dto = new UtilisateurResponseDTO();
        dto.setId(u.getId());
        dto.setLogin(u.getLogin());
        dto.setRoleNom(u.getRole().getNom());
        return dto;
    }
}