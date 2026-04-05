package com.greenbuilding.excellenttraining.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FormateurDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    private int tel;

    @NotBlank(message = "Le type est obligatoire")
    @Pattern(regexp = "INTERNE|EXTERNE", message = "Le type doit être INTERNE ou EXTERNE")
    private String type;

    private Integer employeurId; // null si INTERNE
}