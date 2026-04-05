package com.greenbuilding.excellenttraining.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FormationResponseDTO {
    private long id;
    private String titre;
    private int annee;
    private int duree;
    private double budget;
    private String domaineLibelle;
    private String formateurNomComplet;
    private int nombreParticipants;
}