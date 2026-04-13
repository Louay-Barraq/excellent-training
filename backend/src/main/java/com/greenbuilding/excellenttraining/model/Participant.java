package com.greenbuilding.excellenttraining.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "participant")
@Data
@NoArgsConstructor
public class Participant {

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_structure")
    private Structure structure;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_profil")
    private Profil profil;
}