package com.greenbuilding.excellenttraining.service;

import com.greenbuilding.excellenttraining.dto.StatsDashboardDTO;
import com.greenbuilding.excellenttraining.repository.FormationRepository;
import com.greenbuilding.excellenttraining.repository.ParticipantRepository;
import com.greenbuilding.excellenttraining.repository.StructureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatService {

    private final FormationRepository formationRepository;
    private final ParticipantRepository participantRepository;
    private final StructureRepository structureRepository;

    public StatsDashboardDTO getDashboard() {
        StatsDashboardDTO dto = new StatsDashboardDTO();

        dto.setFormationsParAnnee(
                formationRepository.countByAnnee().stream()
                        .map(row -> Map.of(
                                "annee", row[0],
                                "count", row[1]))
                        .collect(Collectors.toList())
        );

        dto.setBudgetParDomaine(
                formationRepository.sumBudgetByDomaine().stream()
                        .map(row -> Map.of(
                                "domaine", row[0],
                                "totalBudget", row[1]))
                        .collect(Collectors.toList())
        );

        dto.setParticipantsParStructure(
                structureRepository.findAll().stream()
                        .map(s -> Map.of(
                                "structure", (Object) s.getLibelle(),
                                "count", (Object) participantRepository
                                        .findByStructureId(s.getId()).size()))
                        .collect(Collectors.toList())
        );

        return dto;
    }
}