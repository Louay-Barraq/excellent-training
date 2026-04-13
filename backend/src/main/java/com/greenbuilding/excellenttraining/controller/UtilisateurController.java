package com.greenbuilding.excellenttraining.controller;

import com.greenbuilding.excellenttraining.dto.UtilisateurDTO;
import com.greenbuilding.excellenttraining.dto.ProfileUpdateDTO;
import com.greenbuilding.excellenttraining.dto.UtilisateurResponseDTO;
import com.greenbuilding.excellenttraining.model.Utilisateur;
import com.greenbuilding.excellenttraining.repository.UtilisateurRepository;
import com.greenbuilding.excellenttraining.service.UtilisateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurService utilisateurService;
    private final UtilisateurRepository utilisateurRepository;

    @PutMapping("/profile")
    public ResponseEntity<UtilisateurResponseDTO> updateProfile(
            @Valid @RequestBody ProfileUpdateDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String login = auth.getName();
        
        Utilisateur user = utilisateurRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));
        
        return ResponseEntity.ok(utilisateurService.updateProfile(user.getId(), dto));
    }

    @GetMapping
    public ResponseEntity<List<UtilisateurResponseDTO>> findAll() {
        return ResponseEntity.ok(utilisateurService.findAll());
    }

    @PostMapping
    public ResponseEntity<UtilisateurResponseDTO> create(
            @Valid @RequestBody UtilisateurDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(utilisateurService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UtilisateurResponseDTO> update(
            @PathVariable int id,
            @Valid @RequestBody UtilisateurDTO dto) {
        return ResponseEntity.ok(utilisateurService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        utilisateurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}