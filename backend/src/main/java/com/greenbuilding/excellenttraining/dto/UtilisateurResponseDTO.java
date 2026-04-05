package com.greenbuilding.excellenttraining.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UtilisateurResponseDTO {
    private int id;
    private String login;
    private String roleNom;
}