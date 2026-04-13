package com.greenbuilding.excellenttraining.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProfileUpdateDTO {
    @NotBlank(message = "Le login est obligatoire")
    @Size(min = 3, message = "Le login doit avoir au moins 3 caractères")
    private String login;

    private String password;
}
