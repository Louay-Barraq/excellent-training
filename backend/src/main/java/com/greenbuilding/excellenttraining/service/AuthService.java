package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.AuthResponseDTO;
import com.greenbuilding.excellenttraining.dto.LoginDTO;
import com.greenbuilding.excellenttraining.model.Utilisateur;
import com.greenbuilding.excellenttraining.repository.UtilisateurRepository;
import com.greenbuilding.excellenttraining.security.JwtUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtils jwtUtils;

    public AuthResponseDTO login(LoginDTO loginDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getLogin(),
                        loginDTO.getPassword()
                )
        );

        Utilisateur utilisateur = utilisateurRepository
                .findByLogin(loginDTO.getLogin())
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable"));

        String token = jwtUtils.generateToken(
                utilisateur.getLogin(),
                utilisateur.getRole().getNom()
        );

        return new AuthResponseDTO(token, utilisateur.getLogin(),
                utilisateur.getRole().getNom());
    }
}