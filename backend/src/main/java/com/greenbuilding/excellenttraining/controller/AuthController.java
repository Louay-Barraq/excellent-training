package com.greenbuilding.excellenttraining.controller;

import com.greenbuilding.excellenttraining.dto.AuthResponseDTO;
import com.greenbuilding.excellenttraining.dto.LoginDTO;
import com.greenbuilding.excellenttraining.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(authService.login(loginDTO));
    }
}