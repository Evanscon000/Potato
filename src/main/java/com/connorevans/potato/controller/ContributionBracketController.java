package com.connorevans.potato.controller;

import com.connorevans.potato.entity.ContributionBracket;
import com.connorevans.potato.service.ContributionBracketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brackets")
@CrossOrigin(origins = "http://localhost:5173")
public class ContributionBracketController {
    private final ContributionBracketService service;

    public ContributionBracketController(ContributionBracketService service) {
        this.service = service;
    }

    @GetMapping
    public List<ContributionBracket> getAll() {
        return service.getAllBrackets();
    }
}
