package com.connorevans.potato.service;

import com.connorevans.potato.entity.ContributionBracket;
import com.connorevans.potato.repo.ContributionBracketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContributionBracketService {
    private final ContributionBracketRepository repo;

    public ContributionBracketService(ContributionBracketRepository repo) {
        this.repo = repo;
    }

    public List<ContributionBracket> getAllBrackets() {
        return repo.findAll();
    }
}
