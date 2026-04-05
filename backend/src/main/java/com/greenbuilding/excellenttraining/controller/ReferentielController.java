package com.greenbuilding.excellenttraining.controller;

import com.greenbuilding.excellenttraining.dto.ReferentielDTO;
import com.greenbuilding.excellenttraining.model.Domaine;
import com.greenbuilding.excellenttraining.model.Profil;
import com.greenbuilding.excellenttraining.model.Structure;
import com.greenbuilding.excellenttraining.service.ReferentielService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referentiels")
@RequiredArgsConstructor
public class ReferentielController {

    private final ReferentielService referentielService;

    // ===== DOMAINES =====
    @GetMapping("/domaines")
    public ResponseEntity<List<Domaine>> findAllDomaines() {
        return ResponseEntity.ok(referentielService.findAllDomaines());
    }

    @PostMapping("/domaines")
    public ResponseEntity<Domaine> addDomaine(@Valid @RequestBody ReferentielDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(referentielService.addDomaine(dto));
    }

    @PutMapping("/domaines/{id}")
    public ResponseEntity<Domaine> updateDomaine(
            @PathVariable int id,
            @Valid @RequestBody ReferentielDTO dto) {
        return ResponseEntity.ok(referentielService.updateDomaine(id, dto));
    }

    @DeleteMapping("/domaines/{id}")
    public ResponseEntity<Void> deleteDomaine(@PathVariable int id) {
        referentielService.deleteDomaine(id);
        return ResponseEntity.noContent().build();
    }

    // ===== STRUCTURES =====
    @GetMapping("/structures")
    public ResponseEntity<List<Structure>> findAllStructures() {
        return ResponseEntity.ok(referentielService.findAllStructures());
    }

    @PostMapping("/structures")
    public ResponseEntity<Structure> addStructure(@Valid @RequestBody ReferentielDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(referentielService.addStructure(dto));
    }

    @PutMapping("/structures/{id}")
    public ResponseEntity<Structure> updateStructure(
            @PathVariable int id,
            @Valid @RequestBody ReferentielDTO dto) {
        return ResponseEntity.ok(referentielService.updateStructure(id, dto));
    }

    @DeleteMapping("/structures/{id}")
    public ResponseEntity<Void> deleteStructure(@PathVariable int id) {
        referentielService.deleteStructure(id);
        return ResponseEntity.noContent().build();
    }

    // ===== PROFILS =====
    @GetMapping("/profils")
    public ResponseEntity<List<Profil>> findAllProfils() {
        return ResponseEntity.ok(referentielService.findAllProfils());
    }

    @PostMapping("/profils")
    public ResponseEntity<Profil> addProfil(@Valid @RequestBody ReferentielDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(referentielService.addProfil(dto));
    }

    @PutMapping("/profils/{id}")
    public ResponseEntity<Profil> updateProfil(
            @PathVariable int id,
            @Valid @RequestBody ReferentielDTO dto) {
        return ResponseEntity.ok(referentielService.updateProfil(id, dto));
    }

    @DeleteMapping("/profils/{id}")
    public ResponseEntity<Void> deleteProfil(@PathVariable int id) {
        referentielService.deleteProfil(id);
        return ResponseEntity.noContent().build();
    }
}