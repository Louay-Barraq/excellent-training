package com.greenbuilding.excellenttraining.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private int id;
    private String token;
    private String login;
    private String role;
}