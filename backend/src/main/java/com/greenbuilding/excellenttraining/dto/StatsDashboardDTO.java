package com.greenbuilding.excellenttraining.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class StatsDashboardDTO {

    // ── KPIs ──────────────────────────────────────────────────
    private long totalFormations;
    private long totalParticipants;
    private long totalFormateurs;
    private long totalDomaines;
    private double budgetTotal;
    private double budgetMoyen;
    private double dureeMoyenne;
    private double coutMoyenParParticipant;

    // ── Alert indicators ──────────────────────────────────────
    private long formationsSansFormateur;
    private long formationsSansParticipants;
    private long formateursSansFormation;
    private long participantsSansInscription;

    // ── Formations ────────────────────────────────────────────
    private List<Map<String, Object>> formationsParAnnee;      // annee, count, budgetTotal
    private List<Map<String, Object>> formationsParDomaine;    // domaine, count, budgetTotal, budgetMoyen
    private List<Map<String, Object>> topFormationsParBudget;  // titre, budget, annee, domaine
    private List<Map<String, Object>> inscriptionsParAnnee;    // annee, totalInscriptions
    private List<Map<String, Object>> participantsParFormation;// titre, nbParticipants, budget

    // ── Participants ──────────────────────────────────────────
    private List<Map<String, Object>> participantsParStructure;  // structure, count
    private List<Map<String, Object>> participantsParProfil;     // profil, count
    private List<Map<String, Object>> topParticipants;           // nom, prenom, structure, nbFormations
    private List<Map<String, Object>> inscriptionsParStructure;  // structure, totalInscriptions
    private List<Map<String, Object>> heatmapStructureProfil;    // structure, profil, count

    // ── Formateurs ────────────────────────────────────────────
    private List<Map<String, Object>> formateursParType;         // type, count
    private List<Map<String, Object>> chargeParFormateur;        // nom, prenom, type, nbFormation
}