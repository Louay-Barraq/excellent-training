package com.greenbuilding.excellenttraining.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "formation")
@Data
@NoArgsConstructor
@EqualsAndHashCode(exclude = {"participants", "formateur", "domaine"})
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private int annee;

    @Column(nullable = false)
    private int duree; // en jours

    @Column(nullable = false)
    private double budget;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_domaine")
    private Domaine domaine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_formateur")
    private Formateur formateur;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "formation_participant",
            joinColumns = @JoinColumn(name = "formation_id"),
            inverseJoinColumns = @JoinColumn(name = "participant_id")
    )
    private Set<Participant> participants = new HashSet<>();

    // Méthode utilitaire pour gérer les inscriptions
    public void addParticipant(Participant participant) {
        this.participants.add(participant);
    }

    public void removeParticipant(Participant participant) {
        this.participants.remove(participant);
    }
}