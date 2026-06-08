package ma.enset.elghouali.zakariae.exam_jee.dtos;

import lombok.Data;
import ma.enset.elghouali.zakariae.exam_jee.enums.StatutCredit;
import java.time.LocalDate;

@Data
public class CreditDTO {
    private Long id;
    private LocalDate dateDemande;
    private StatutCredit statut;
    private Double montant;
    private Integer dureeRemboursement;
    private Double tauxInteret;
    private String typeCredit;
}
