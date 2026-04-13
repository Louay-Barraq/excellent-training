package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.StatsDashboardDTO;
import com.greenbuilding.excellenttraining.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatService {

    private final FormationRepository   formationRepository;
    private final ParticipantRepository participantRepository;
    private final FormateurRepository   formateurRepository;

    public StatsDashboardDTO getDashboard() {
        StatsDashboardDTO dto = new StatsDashboardDTO();

        // ── KPIs ────────────────────────────────────────────────────
        dto.setTotalFormations(formationRepository.count());
        dto.setTotalParticipants(participantRepository.count());
        dto.setTotalFormateurs(formateurRepository.count());

        Double avgBudget = formationRepository.avgBudget();
        Double avgDuree  = formationRepository.avgDuree();
        dto.setBudgetMoyen(avgBudget != null ? Math.round(avgBudget * 100.0) / 100.0 : 0);
        dto.setDureeMoyenne(avgDuree  != null ? Math.round(avgDuree  * 100.0) / 100.0 : 0);

        // ── Alert indicators ────────────────────────────────────────
        dto.setFormationsSansFormateur(formationRepository.countWithoutFormateur());
        dto.setFormationsSansParticipants(formationRepository.countWithoutParticipants());
        dto.setFormateursSansFormation(formateurRepository.countWithoutFormation());
        dto.setParticipantsSansInscription(participantRepository.countWithoutInscription());

        // ── Formations par année ────────────────────────────────────
        List<Map<String, Object>> formationsParAnnee = formationRepository.statsByAnnee()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("annee",       row[0]);
                    m.put("count",       row[1]);
                    m.put("budgetTotal", row[2]);
                    return m;
                }).collect(Collectors.toList());
        dto.setFormationsParAnnee(formationsParAnnee);

        // ── Formations par domaine ──────────────────────────────────
        List<Map<String, Object>> formationsParDomaine = formationRepository.statsByDomaine()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("domaine",     row[0]);
                    m.put("count",       row[1]);
                    m.put("budgetTotal", row[2]);
                    m.put("budgetMoyen", row[3] != null
                            ? Math.round(((Number) row[3]).doubleValue() * 100.0) / 100.0 : 0);
                    return m;
                }).collect(Collectors.toList());
        dto.setFormationsParDomaine(formationsParDomaine);

        double budgetTotal = formationsParDomaine.stream()
                .mapToDouble(m -> ((Number) m.get("budgetTotal")).doubleValue())
                .sum();
        dto.setBudgetTotal(budgetTotal);
        dto.setTotalDomaines((long) formationsParDomaine.size());

        // ── Top 5 formations par budget ─────────────────────────────
        List<Map<String, Object>> topFormations = formationRepository
                .topByBudget(PageRequest.of(0, 5))
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("titre",   row[0]);
                    m.put("budget",  row[1]);
                    m.put("annee",   row[2]);
                    m.put("domaine", row[3]);
                    return m;
                }).collect(Collectors.toList());
        dto.setTopFormationsParBudget(topFormations);

        // ── Inscriptions par année ──────────────────────────────────
        List<Map<String, Object>> inscriptionsParAnnee = formationRepository.inscriptionsParAnnee()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("annee",             row[0]);
                    m.put("totalInscriptions", row[1]);
                    return m;
                }).collect(Collectors.toList());
        dto.setInscriptionsParAnnee(inscriptionsParAnnee);

        long totalInscriptions = inscriptionsParAnnee.stream()
                .mapToLong(m -> ((Number) m.get("totalInscriptions")).longValue())
                .sum();
        dto.setCoutMoyenParParticipant(
                totalInscriptions > 0
                        ? Math.round((budgetTotal / totalInscriptions) * 100.0) / 100.0
                        : 0);

        // ── Participants par formation ──────────────────────────────
        List<Map<String, Object>> partParFormation = formationRepository.participantsParFormation()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("titre",          row[0]);
                    m.put("nbParticipants", row[1]);
                    m.put("budget",         row[2]);
                    return m;
                }).collect(Collectors.toList());
        dto.setParticipantsParFormation(partParFormation);

        // ── Participants par structure ───────────────────────────────
        List<Map<String, Object>> participantsParStructure = participantRepository.countByStructure()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("structure", row[0]);
                    m.put("count",     row[1]);
                    return m;
                }).collect(Collectors.toList());
        dto.setParticipantsParStructure(participantsParStructure);

        // ── Participants par profil ─────────────────────────────────
        List<Map<String, Object>> participantsParProfil = participantRepository.countByProfil()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("profil", row[0]);
                    m.put("count",  row[1]);
                    return m;
                }).collect(Collectors.toList());
        dto.setParticipantsParProfil(participantsParProfil);

        // ── Top 5 participants ──────────────────────────────────────
        List<Map<String, Object>> topParticipants = participantRepository
                .topParticipants(PageRequest.of(0, 5))
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("nom",          row[0]);
                    m.put("prenom",       row[1]);
                    m.put("structure",    row[2]);
                    m.put("nbFormations", row[3]);
                    return m;
                }).collect(Collectors.toList());
        dto.setTopParticipants(topParticipants);

        // ── Inscriptions par structure ──────────────────────────────
        List<Map<String, Object>> inscriptionsParStructure = participantRepository
                .inscriptionsParStructure()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("structure",         row[0]);
                    m.put("totalInscriptions", row[1]);
                    return m;
                }).collect(Collectors.toList());
        dto.setInscriptionsParStructure(inscriptionsParStructure);

        // ── Heatmap structure × profil ──────────────────────────────
        List<Map<String, Object>> heatmap = participantRepository.countByStructureAndProfil()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("structure", row[0]);
                    m.put("profil",    row[1]);
                    m.put("count",     row[2]);
                    return m;
                }).collect(Collectors.toList());
        dto.setHeatmapStructureProfil(heatmap);

        // ── Formateurs par type ─────────────────────────────────────
        List<Map<String, Object>> formateursParType = formateurRepository.countByType()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("type",  row[0]);
                    m.put("count", row[1]);
                    return m;
                }).collect(Collectors.toList());
        dto.setFormateursParType(formateursParType);

        // ── Charge par formateur ────────────────────────────────────
        List<Map<String, Object>> chargeParFormateur = formateurRepository
                .formateursAvecNbFormations()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("nom",          row[0]);
                    m.put("prenom",       row[1]);
                    m.put("type",         row[2]);
                    m.put("nbFormations", row[3]);
                    return m;
                }).collect(Collectors.toList());
        dto.setChargeParFormateur(chargeParFormateur);

        return dto;
    }
}