package ma.enset.elghouali.zakariae.exam_jee.dtos;

import lombok.Data;
import ma.enset.elghouali.zakariae.exam_jee.enums.TypeRemboursement;
import java.time.LocalDate;

@Data
public class RemboursementDTO {
    private Long id;
    private LocalDate date;
    private Double montant;
    private TypeRemboursement typeRemboursement;
    private Long creditId;
}
