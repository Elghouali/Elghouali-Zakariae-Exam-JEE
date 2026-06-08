package ma.enset.elghouali.zakariae.exam_jee.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.enset.elghouali.zakariae.exam_jee.enums.TypeRemboursement;
import ma.enset.elghouali.zakariae.examjee.enums.TypeRemboursement;
import java.time.LocalDate;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Remboursement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    private Double montant;

    @Enumerated(EnumType.STRING)
    private TypeRemboursement type;

    @ManyToMany
    private Credit credit;
}
