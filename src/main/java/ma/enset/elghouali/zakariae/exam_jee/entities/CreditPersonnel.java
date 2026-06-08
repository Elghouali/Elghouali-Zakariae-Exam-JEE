package ma.enset.elghouali.zakariae.exam_jee.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("PERSONNEL")
@Data @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CreditPersonnel extends Credit {
    private String motif;
}
