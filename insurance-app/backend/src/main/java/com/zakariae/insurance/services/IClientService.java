package com.zakariae.insurance.services;

import com.zakariae.insurance.dtos.ClientDTO;

import java.util.List;

public interface IClientService {
    ClientDTO createClient(ClientDTO dto);
    ClientDTO updateClient(Long id, ClientDTO dto);
    ClientDTO getClientById(Long id);
    List<ClientDTO> getAllClients();
    List<ClientDTO> searchClientsByNom(String nom);
    void deleteClient(Long id);
    ClientDTO getClientWithContrats(Long id);
}
