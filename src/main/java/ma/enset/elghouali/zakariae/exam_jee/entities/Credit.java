package ma.enset.elghouali.zakariae.exam_jee.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.enset.elghouali.zakariae.exam_jee.enums.StatutCredit;
import java.time.LocalDate;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "TYPE_CREDIT", length = 15)
@Data @NoArgsConstructor @AllArgsConstructor
public class Credit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate dateDemande;

    @Enumerated(EnumType.STRING)
    private StatutCredit statut;

    private LocalDate dateAcceptation;
    private Double montant;
    private Integer dureeRemboursement;
    private Double tauxInteret;

    @ManyToOne
    private Client client;

    @OneToMany(mappedBy = "credit", fetch = FetchType.LAZY)
    private List<Remboursement> remboursements;
}
