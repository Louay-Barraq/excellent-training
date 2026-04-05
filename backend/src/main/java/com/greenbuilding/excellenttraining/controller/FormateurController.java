package com.greenbuilding.excellenttraining.controller;

import com.greenbuilding.excellenttraining.dto.FormateurDTO;
import com.greenbuilding.excellenttraining.model.Formateur;
import com.greenbuilding.excellenttraining.service.FormateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formateurs")
@RequiredArgsConstructor
public class FormateurController {

    private final FormateurService formateurService;

    @GetMapping
    public ResponseEntity<List<Formateur>> findAll() {
        return ResponseEntity.ok(formateurService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formateur> findById(@PathVariable int id) {
        return ResponseEntity.ok(formateurService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Formateur> create(@Valid @RequestBody FormateurDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(formateurService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Formateur> update(
            @PathVariable int id,
            @Valid @RequestBody FormateurDTO dto) {
        return ResponseEntity.ok(formateurService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        formateurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}