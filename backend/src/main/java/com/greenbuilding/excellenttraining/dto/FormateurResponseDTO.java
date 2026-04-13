package com.greenbuilding.excellenttraining.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FormateurResponseDTO {
    private int id;
    private String nom;
    private String prenom;
    private String email;
    private int tel;
    private String type;
    private String nomEmployeur;
}