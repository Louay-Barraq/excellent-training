package com.greenbuilding.excellenttraining.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FormationDTO {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @Min(value = 2000, message = "L'année doit être valide")
    private int annee;

    @Min(value = 1, message = "La durée doit être d'au moins 1 jour")
    private int duree;

    @Positive(message = "Le budget doit être positif")
    private double budget;

    @NotNull(message = "Le domaine est obligatoire")
    private Integer domaineId;
}