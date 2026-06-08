package ma.enset.elghouali.zakariae.exam_jee.web;

import lombok.AllArgsConstructor;
import ma.enset.elghouali.zakariae.exam_jee.dtos.*;
import ma.enset.elghouali.zakariae.exam_jee.services.CreditService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@AllArgsConstructor
public class CreditRestController {

    private CreditService creditService;

    @GetMapping("/clients")
    public List<ClientDTO> clients() {
        return creditService.getAllClients();
    }

    @GetMapping("/clients/{id}/credits")
    public List<CreditDTO> creditsByClient(@PathVariable(name = "id") Long clientId) {
        return creditService.getCreditsByClient(clientId);
    }

    @GetMapping("/credits/{id}")
    public CreditDTO getCredit(@PathVariable Long id) {
        return creditService.getCreditById(id);
    }

    @PostMapping("/remboursements")
    public RemboursementDTO saveRemboursement(@RequestBody RemboursementDTO remboursementDTO) {
        return creditService.addRemboursement(remboursementDTO);
    }
}
