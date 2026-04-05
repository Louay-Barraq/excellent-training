package com.greenbuilding.excellenttraining.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ParticipantDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    private int tel;

    @NotNull(message = "La structure est obligatoire")
    private Integer structureId;

    @NotNull(message = "Le profil est obligatoire")
    private Integer profilId;
}