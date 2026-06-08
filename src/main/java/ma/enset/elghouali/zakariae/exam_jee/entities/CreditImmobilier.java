package ma.enset.elghouali.zakariae.exam_jee.entities;

import jakarta.persistence.*;
import lombok.*;
import ma.enset.elghouali.zakariae.exam_jee.enums.TypeBien;
import ma.enset.elghouali.zakariae.exam_jee.enums.TypeBien;

@Entity
@DiscriminatorValue("IMMOBILIER")
@Data @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CreditImmobilier extends Credit {
    @Enumerated(EnumType.STRING)
    private TypeBien typeBien;
}
