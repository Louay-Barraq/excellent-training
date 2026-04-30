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

    // ── Null-safe helpers ────────────────────────────────────────────────────

    private String safeStr(Object o) {
        return o != null ? o.toString() : "—";
    }

    private long safeNum(Object o) {
        return o instanceof Number n ? n.longValue() : 0L;
    }

    private double safeDouble(Object o) {
        return o instanceof Number n ? Math.round(n.doubleValue() * 100.0) / 100.0 : 0.0;
    }

    // ── Dashboard ────────────────────────────────────────────────────────────

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
                    m.put("annee",       safeNum(row[0]));
                    m.put("count",       safeNum(row[1]));
                    m.put("budgetTotal", safeDouble(row[2]));
                    return m;
                }).collect(Collectors.toList());
        dto.setFormationsParAnnee(formationsParAnnee);

        // ── Formations par domaine ──────────────────────────────────
        List<Map<String, Object>> formationsParDomaine = formationRepository.statsByDomaine()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("domaine",     safeStr(row[0]));
                    m.put("count",       safeNum(row[1]));
                    m.put("budgetTotal", safeDouble(row[2]));
                    m.put("budgetMoyen", safeDouble(row[3]));
                    return m;
                }).collect(Collectors.toList());
        dto.setFormationsParDomaine(formationsParDomaine);

        double budgetTotal = formationsParDomaine.stream()
                .mapToDouble(m -> {
                    Object v = m.get("budgetTotal");
                    return v instanceof Number n ? n.doubleValue() : 0.0;
                })
                .sum();
        dto.setBudgetTotal(budgetTotal);
        dto.setTotalDomaines((long) formationsParDomaine.size());

        // ── Top 5 formations par budget ─────────────────────────────
        List<Map<String, Object>> topFormations = formationRepository
                .topByBudget(PageRequest.of(0, 5))
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("titre",   safeStr(row[0]));
                    m.put("budget",  safeDouble(row[1]));
                    m.put("annee",   safeNum(row[2]));
                    m.put("domaine", safeStr(row[3]));
                    return m;
                }).collect(Collectors.toList());
        dto.setTopFormationsParBudget(topFormations);

        // ── Inscriptions par année ──────────────────────────────────
        List<Map<String, Object>> inscriptionsParAnnee = formationRepository.inscriptionsParAnnee()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("annee",             safeNum(row[0]));
                    m.put("totalInscriptions", safeNum(row[1]));
                    return m;
                }).collect(Collectors.toList());
        dto.setInscriptionsParAnnee(inscriptionsParAnnee);

        long totalInscriptions = inscriptionsParAnnee.stream()
                .mapToLong(m -> {
                    Object v = m.get("totalInscriptions");
                    return v instanceof Number n ? n.longValue() : 0L;
                })
                .sum();
        dto.setCoutMoyenParParticipant(
                totalInscriptions > 0
                        ? Math.round((budgetTotal / totalInscriptions) * 100.0) / 100.0
                        : 0);

        // ── Participants par formation ──────────────────────────────
        List<Map<String, Object>> partParFormation = formationRepository.participantsParFormation()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("titre",          safeStr(row[0]));
                    m.put("nbParticipants", safeNum(row[1]));
                    m.put("budget",         safeDouble(row[2]));
                    return m;
                }).collect(Collectors.toList());
        dto.setParticipantsParFormation(partParFormation);

        // ── Participants par structure ───────────────────────────────
        List<Map<String, Object>> participantsParStructure = participantRepository.countByStructure()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("structure", safeStr(row[0]));
                    m.put("count",     safeNum(row[1]));
                    return m;
                }).collect(Collectors.toList());
        dto.setParticipantsParStructure(participantsParStructure);

        // ── Participants par profil ─────────────────────────────────
        List<Map<String, Object>> participantsParProfil = participantRepository.countByProfil()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("profil", safeStr(row[0]));
                    m.put("count",  safeNum(row[1]));
                    return m;
                }).collect(Collectors.toList());
        dto.setParticipantsParProfil(participantsParProfil);

        // ── Top 5 participants ──────────────────────────────────────
        List<Map<String, Object>> topParticipants = participantRepository
                .topParticipants(PageRequest.of(0, 5))
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("nom",          safeStr(row[0]));
                    m.put("prenom",       safeStr(row[1]));
                    m.put("structure",    safeStr(row[2]));
                    m.put("nbFormations", safeNum(row[3]));
                    return m;
                }).collect(Collectors.toList());
        dto.setTopParticipants(topParticipants);

        // ── Inscriptions par structure ──────────────────────────────
        List<Map<String, Object>> inscriptionsParStructure = participantRepository
                .inscriptionsParStructure()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("structure",         safeStr(row[0]));
                    m.put("totalInscriptions", safeNum(row[1]));
                    return m;
                }).collect(Collectors.toList());
        dto.setInscriptionsParStructure(inscriptionsParStructure);

        // ── Heatmap structure × profil ──────────────────────────────
        List<Map<String, Object>> heatmap = participantRepository.countByStructureAndProfil()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("structure", safeStr(row[0]));
                    m.put("profil",    safeStr(row[1]));
                    m.put("count",     safeNum(row[2]));
                    return m;
                }).collect(Collectors.toList());
        dto.setHeatmapStructureProfil(heatmap);

        // ── Formateurs par type ─────────────────────────────────────
        List<Map<String, Object>> formateursParType = formateurRepository.countByType()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("type",  safeStr(row[0]));
                    m.put("count", safeNum(row[1]));
                    return m;
                }).collect(Collectors.toList());
        dto.setFormateursParType(formateursParType);

        // ── Charge par formateur ────────────────────────────────────
        List<Map<String, Object>> chargeParFormateur = formateurRepository
                .formateursAvecNbFormations()
                .stream().map(row -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("nom",          safeStr(row[0]));
                    m.put("prenom",       safeStr(row[1]));
                    m.put("type",         safeStr(row[2]));
                    m.put("nbFormations", safeNum(row[3]));
                    return m;
                }).collect(Collectors.toList());
        dto.setChargeParFormateur(chargeParFormateur);

        return dto;
    }
}