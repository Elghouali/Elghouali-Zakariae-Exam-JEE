package ma.enset.elghouali.zakariae.exam_jee;

import ma.enset.elghouali.zakariae.exam_jee.entities.*;
import ma.enset.elghouali.zakariae.exam_jee.enums.*;
import ma.enset.elghouali.zakariae.exam_jee.repositories.*;
import ma.enset.elghouali.zakariae.exam_jee.security.RsaKeysConfig;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.time.LocalDate;

@SpringBootApplication
@EnableConfigurationProperties(RsaKeysConfig.class)
public class ExamJeeApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExamJeeApplication.class, args);
	}

	@Bean
	CommandLineRunner start(ClientRepository clientRepository,
							CreditRepository creditRepository,
							RemboursementRepository remboursementRepository) {
		return args -> {
			// 1. Alimenter les clients
			Client c1 = Client.builder().nom("Hassan").email("hassan@gmail.com").build();
			Client c2 = Client.builder().nom("Amina").email("amina@gmail.com").build();
			clientRepository.saveAll(List.of(c1, c2));

			// 2. Alimenter les Credits
			CreditPersonnel cp = new CreditPersonnel();
			cp.setClient(c1);
			cp.setMontant(50000.0);
			cp.setDureeRemboursement(48);
			cp.setTauxInteret(4.5);
			cp.setDateDemande(LocalDate.now());
			cp.setStatut(StatutCredit.ACCEPTE);
			cp.setMotif("Achat Voiture");

			CreditImmobilier ci = new CreditImmobilier();
			ci.setClient(c2);
			ci.setMontant(1200000.0);
			ci.setDureeRemboursement(240);
			ci.setTauxInteret(4.2);
			ci.setDateDemande(LocalDate.now());
			ci.setStatut(StatutCredit.EN_COURS);
			ci.setTypeBien(TypeBien.APPARTEMENT);

			creditRepository.saveAll(List.of(cp, ci));

			// 3. Alimenter les Remboursements
			Remboursement r1 = Remboursement.builder()
					.credit(cp)
					.montant(1200.0)
					.date(LocalDate.now().plusMonths(1))
					.type(TypeRemboursement.MENSUALITE)
					.build();

			Remboursement r2 = Remboursement.builder()
					.credit(cp)
					.montant(1200.0)
					.date(LocalDate.now().plusMonths(2))
					.type(TypeRemboursement.MENSUALITE)
					.build();

			remboursementRepository.saveAll(List.of(r1, r2));

			System.out.println("====== Test de la couche DAO terminé avec succès ! ======");
		};
	}
}
