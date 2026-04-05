package com.greenbuilding.excellenttraining.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employeur")
@Data
@NoArgsConstructor
public class Employeur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "nom_employeur", nullable = false)
    private String nomEmployeur;
}