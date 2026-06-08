package ma.enset.elghouali.zakariae.exam_jee.services;

import lombok.AllArgsConstructor;
import ma.enset.elghouali.zakariae.exam_jee.dtos.*;
import ma.enset.elghouali.zakariae.exam_jee.entities.*;
import ma.enset.elghouali.zakariae.exam_jee.mappers.ExamMapper;
import ma.enset.elghouali.zakariae.exam_jee.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class CreditServiceImpl implements CreditService{
    private ClientRepository clientRepository;
    private CreditRepository creditRepository;
    private RemboursementRepository remboursementRepository;
    private ExamMapper mapper;

    @Override
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream()
                .map(mapper::fromClient)
                .collect(Collectors.toList());
    }

    @Override
    public List<CreditDTO> getCreditsByClient(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        return client.getCredits().stream()
                .map(mapper::fromCredit)
                .collect(Collectors.toList());
    }

    @Override
    public CreditDTO getCreditById(Long creditId) {
        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new RuntimeException("Crédit introuvable"));
        return mapper.fromCredit(credit);
    }

    @Override
    public RemboursementDTO addRemboursement(RemboursementDTO dto) {
        Credit credit = creditRepository.findById(dto.getCreditId())
                .orElseThrow(() -> new RuntimeException("Crédit introuvable"));

        Remboursement remboursement = Remboursement.builder()
                .date(dto.getDate())
                .montant(dto.getMontant())
                .type(dto.getType())
                .credit(credit)
                .build();

        Remboursement saved = remboursementRepository.save(remboursement);
        return mapper.fromRemboursement(saved);
    }

}
