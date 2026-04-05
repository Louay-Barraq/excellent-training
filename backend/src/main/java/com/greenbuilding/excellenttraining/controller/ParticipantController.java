package com.greenbuilding.excellenttraining.controller;

import com.greenbuilding.excellenttraining.dto.ParticipantDTO;
import com.greenbuilding.excellenttraining.model.Participant;
import com.greenbuilding.excellenttraining.service.ParticipantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participants")
@RequiredArgsConstructor
public class ParticipantController {

    private final ParticipantService participantService;

    @GetMapping
    public ResponseEntity<List<Participant>> findAll() {
        return ResponseEntity.ok(participantService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Participant> findById(@PathVariable int id) {
        return ResponseEntity.ok(participantService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Participant> create(@Valid @RequestBody ParticipantDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(participantService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Participant> update(
            @PathVariable int id,
            @Valid @RequestBody ParticipantDTO dto) {
        return ResponseEntity.ok(participantService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        participantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}