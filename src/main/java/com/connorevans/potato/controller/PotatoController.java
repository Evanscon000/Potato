package com.connorevans.potato.controller;

import com.connorevans.potato.entity.PotatoItem;
import com.connorevans.potato.service.PotatoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/potatoes")
public class PotatoController {

    private final PotatoService potatoService;

    public PotatoController(PotatoService potatoService) {
        this.potatoService = potatoService;
    }

    @PostMapping
    public ResponseEntity<PotatoItem> createPotatoItem(@RequestBody PotatoItem item) {
        return new ResponseEntity<>(potatoService.create(item), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PotatoItem>> getAllPotatoes() {
        return ResponseEntity.ok(potatoService.getAllPotatoes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PotatoItem> getPotatoById(@PathVariable Long id) {
        return potatoService.getPotatoItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PotatoItem> updatePotatoById(@PathVariable Long id, @RequestBody PotatoItem item) {
        return ResponseEntity.ok(potatoService.updatePotatoItemById(id, item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePotatoById(@PathVariable Long id) {
        potatoService.deletePotatoItemById(id);
        return ResponseEntity.noContent().build();
    }
}
