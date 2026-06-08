package ma.enset.elghouali.zakariae.exam_jee.mappers;

import ma.enset.elghouali.zakariae.exam_jee.dtos.*;
import ma.enset.elghouali.zakariae.exam_jee.entities.*;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class ExamMapper {

    public ClientDTO fromClient(Client client) {
        ClientDTO dto = new ClientDTO();
        BeanUtils.copyProperties(client, dto);
        return dto;
    }

    public CreditDTO fromCredit(Credit credit) {
        CreditDTO dto = new CreditDTO();
        BeanUtils.copyProperties(credit, dto);

        if (credit instanceof CreditPersonnel){
            dto.setTypeCredit("PERSONNEL");
        } else if (credit instanceof CreditImmobilier) {
            dto.setTypeCredit("IMMOBILIER");
        } else if (credit instanceof CreditProfessionnel) {
            dto.setTypeCredit("PROFESSION");
        }
        return dto;
    }

    public RemboursementDTO fromRemboursement(Remboursement remboursement) {
        RemboursementDTO dto = new RemboursementDTO();
        BeanUtils.copyProperties(remboursement, dto);
        if (remboursement.getCredit() != null) {
            dto.setCreditId(remboursement.getCredit().getId());
        }
        return dto;
    }
}
