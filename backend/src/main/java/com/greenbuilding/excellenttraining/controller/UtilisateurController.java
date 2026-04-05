package com.greenbuilding.excellenttraining.controller;

import com.greenbuilding.excellenttraining.dto.UtilisateurDTO;
import com.greenbuilding.excellenttraining.dto.UtilisateurResponseDTO;
import com.greenbuilding.excellenttraining.service.UtilisateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

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