package com.greenbuilding.excellenttraining.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
public class StatsDashboardDTO {
    private List<Map<String, Object>> formationsParAnnee;
    private List<Map<String, Object>> budgetParDomaine;
    private List<Map<String, Object>> participantsParStructure;
}