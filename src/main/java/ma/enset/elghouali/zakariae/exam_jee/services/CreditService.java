package ma.enset.elghouali.zakariae.exam_jee.services;

import ma.enset.elghouali.zakariae.exam_jee.dtos.ClientDTO;
import ma.enset.elghouali.zakariae.exam_jee.dtos.CreditDTO;
import ma.enset.elghouali.zakariae.exam_jee.dtos.RemboursementDTO;

import java.util.List;

public interface CreditService {
    List<ClientDTO> getAllClients();
    List<CreditDTO> getCreditsByClient(Long clientId);
    CreditDTO getCreditById(Long creditId);
    RemboursementDTO addRemboursement(RemboursementDTO remboursementDTO);
}
