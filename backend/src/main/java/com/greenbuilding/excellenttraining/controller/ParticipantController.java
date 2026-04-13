package com.greenbuilding.excellenttraining.controller;

import com.greenbuilding.excellenttraining.dto.ParticipantDTO;
import com.greenbuilding.excellenttraining.dto.ParticipantResponseDTO;
import com.greenbuilding.excellenttraining.dto.FormationResponseDTO;
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
    public ResponseEntity<List<ParticipantResponseDTO>> findAll() {
        return ResponseEntity.ok(participantService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParticipantResponseDTO> findById(@PathVariable int id) {
        return ResponseEntity.ok(participantService.findById(id));
    }

    @GetMapping("/{id}/formations")
    public ResponseEntity<List<FormationResponseDTO>> listFormations(@PathVariable int id) {
        return ResponseEntity.ok(participantService.listFormations(id));
    }

    @PostMapping
    public ResponseEntity<ParticipantResponseDTO> create(
            @Valid @RequestBody ParticipantDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(participantService.toResponseDTO(participantService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParticipantResponseDTO> update(
            @PathVariable int id, @Valid @RequestBody ParticipantDTO dto) {
        return ResponseEntity.ok(participantService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        participantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}