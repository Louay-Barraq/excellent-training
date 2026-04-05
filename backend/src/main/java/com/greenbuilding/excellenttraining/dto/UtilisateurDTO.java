package com.greenbuilding.excellenttraining.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UtilisateurDTO {

    @NotBlank(message = "Le login est obligatoire")
    @Size(min = 3, message = "Le login doit avoir au moins 3 caractères")
    private String login;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit avoir au moins 6 caractères")
    private String password;

    @NotNull(message = "Le rôle est obligatoire")
    private Integer roleId;
}