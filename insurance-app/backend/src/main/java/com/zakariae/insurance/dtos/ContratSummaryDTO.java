package com.zakariae.insurance.dtos;

import com.zakariae.insurance.entities.enums.StatutContrat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratSummaryDTO {
    private Long id;
    private String typeContrat;
    private LocalDate dateSouscription;
    private StatutContrat statut;
    private BigDecimal montantCotisation;
}
