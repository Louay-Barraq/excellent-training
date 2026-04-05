package com.greenbuilding.excellenttraining.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "formateur")
@Data
@NoArgsConstructor
public class Formateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    private int tel;

    @Column(nullable = false)
    private String type; // "INTERNE" ou "EXTERNE"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_employeur")
    private Employeur employeur; // null si formateur interne
}