package com.connorevans.potato.controller;

import com.connorevans.potato.entity.ContributionBracket;
import com.connorevans.potato.service.ContributionBracketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ContributionBracketController {

    private final ContributionBracketService service;

    public ContributionBracketController(ContributionBracketService service) {
        this.service = service;
    }

    @GetMapping("/brackets")
    public List<ContributionBracket> getAll() {
        return service.getAllBrackets();
    }

    @GetMapping("/recommendation/{age}")
    public double getRecommendedPercent(@PathVariable int age) {
        return service.getRecommendedPercent(age);
    }
}
