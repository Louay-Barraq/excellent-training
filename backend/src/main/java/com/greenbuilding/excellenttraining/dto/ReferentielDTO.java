package com.greenbuilding.excellenttraining.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReferentielDTO {

    @NotBlank(message = "Le libellé est obligatoire")
    private String libelle;
}