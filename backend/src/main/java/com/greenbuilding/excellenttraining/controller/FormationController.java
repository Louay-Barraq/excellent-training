package com.greenbuilding.excellenttraining.controller;

import com.greenbuilding.excellenttraining.dto.FormationDTO;
import com.greenbuilding.excellenttraining.dto.FormationResponseDTO;
import com.greenbuilding.excellenttraining.model.Formation;
import com.greenbuilding.excellenttraining.service.FormationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/formations")
@RequiredArgsConstructor
public class FormationController {

    private final FormationService formationService;

    @GetMapping
    public ResponseEntity<List<Formation>> findAll() {
        return ResponseEntity.ok(formationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> findById(@PathVariable long id) {
        return ResponseEntity.ok(formationService.findById(id));
    }

    @PostMapping
    public ResponseEntity<FormationResponseDTO> create(
            @Valid @RequestBody FormationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(formationService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormationResponseDTO> update(
            @PathVariable long id,
            @Valid @RequestBody FormationDTO dto) {
        return ResponseEntity.ok(formationService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        formationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/formateur/{formateurId}")
    public ResponseEntity<FormationResponseDTO> affecterFormateur(
            @PathVariable long id,
            @PathVariable int formateurId) {
        return ResponseEntity.ok(formationService.affecterFormateur(id, formateurId));
    }

    @PostMapping("/{id}/participants")
    public ResponseEntity<Map<String, Object>> inscrireParticipants(
            @PathVariable long id,
            @RequestBody List<Integer> participantIds) {
        int count = formationService.inscrireParticipants(id, participantIds);
        return ResponseEntity.ok(Map.of(
                "message", count + " participant(s) inscrits avec succès",
                "count", count));
    }
}