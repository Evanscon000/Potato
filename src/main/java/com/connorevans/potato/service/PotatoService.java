package com.connorevans.potato.service;

import com.connorevans.potato.entity.PotatoItem;
import com.connorevans.potato.repo.PotatoItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PotatoService {

    private final PotatoItemRepository potatoItemRepository;

    public PotatoService(PotatoItemRepository potatoItemRepository){
        this.potatoItemRepository = potatoItemRepository;
    }

    public PotatoItem create(PotatoItem potatoItem) {
        return potatoItemRepository.save(potatoItem);
    }

    public List<PotatoItem> getAllPotatoes(){
        return potatoItemRepository.findAll();
    }

    public Optional<PotatoItem> getPotatoItemById(Long id) {
        return potatoItemRepository.findById(id);
    }

    public PotatoItem updatePotatoItemById(Long id, PotatoItem updatedItem) {
        return potatoItemRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedItem.getName());
                    existing.setHourlyPay(updatedItem.getHourlyPay());
                    existing.setHoursPerWeek(updatedItem.getHoursPerWeek());
                    existing.setPotatoPriceAtConversion(updatedItem.getPotatoPriceAtConversion());
                    return potatoItemRepository.save(existing);
                })
                .orElseThrow(() -> new IllegalArgumentException("Potato Item not found with ID: " + id));

    }

    public void deletePotatoItemById(Long id) {
        potatoItemRepository.deleteById(id);
    }

}
