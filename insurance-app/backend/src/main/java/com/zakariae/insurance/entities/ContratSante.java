package com.zakariae.insurance.entities;

import com.zakariae.insurance.entities.enums.NiveauCouverture;
import jakarta.persistence.*;
import lombok.*;

@Entity
@DiscriminatorValue("SANTE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class ContratSante extends Contrat {

    @Enumerated(EnumType.STRING)
    @Column(name = "niveau_couverture")
    private NiveauCouverture niveauCouverture;

    @Column(name = "nb_personnes_couvertes")
    private Integer nbPersonnesCouvertes;
}
