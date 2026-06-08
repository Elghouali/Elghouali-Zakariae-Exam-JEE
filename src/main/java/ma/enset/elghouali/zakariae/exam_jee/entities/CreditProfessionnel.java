package ma.enset.elghouali.zakariae.exam_jee.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("PROFESSIONNEL")
@Data @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CreditProfessionnel extends Credit {
    private String motif;
    private String raisonSociale;
}
