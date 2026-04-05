package com.greenbuilding.excellenttraining.controller;

import com.greenbuilding.excellenttraining.dto.StatsDashboardDTO;
import com.greenbuilding.excellenttraining.service.StatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatController {

    private final StatService statService;

    @GetMapping("/dashboard")
    public ResponseEntity<StatsDashboardDTO> getDashboard() {
        return ResponseEntity.ok(statService.getDashboard());
    }
}