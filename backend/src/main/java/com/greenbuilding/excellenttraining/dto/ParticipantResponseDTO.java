package com.greenbuilding.excellenttraining.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ParticipantResponseDTO {
    private int id;
    private String nom;
    private String prenom;
    private String email;
    private int tel;
    private String structureLibelle;
    private String profilLibelle;
}