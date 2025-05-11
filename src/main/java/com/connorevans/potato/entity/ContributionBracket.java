package com.connorevans.potato.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "contribution_bracket")
public class ContributionBracket {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int  minAge;
    private int  maxAge;
    private double recommendedPercent;   // e.g. 15 = 15 %

    // boilerplate
    public ContributionBracket() {}
    public ContributionBracket(int minAge, int maxAge, double recommendedPercent) {
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.recommendedPercent = recommendedPercent;
    }
    public Long getId(){ return id; }
    public int getMinAge(){ return minAge; }
    public int getMaxAge(){ return maxAge; }
    public double getRecommendedPercent(){ return recommendedPercent; }
}
