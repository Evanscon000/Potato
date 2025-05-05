package com.connorevans.potato.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class PotatoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double hourlyPay;
    private double hoursPerWeek;
    private double potatoPriceAtConversion;
    private LocalDateTime timestamp;

    public PotatoItem(String name, double hourlyPay, double hoursPerWeek, double potatoPriceAtConversion) {
        this.name = name;
        this.hourlyPay = hourlyPay;
        this.hoursPerWeek = hoursPerWeek;
        this.potatoPriceAtConversion = potatoPriceAtConversion;
        this.timestamp = LocalDateTime.now();
    }

    public PotatoItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getHourlyPay() {
        return hourlyPay;
    }

    public void setHourlyPay(double hourlyPay) {
        this.hourlyPay = hourlyPay;
    }

    public double getHoursPerWeek() {
        return hoursPerWeek;
    }

    public void setHoursPerWeek(double hoursPerWeek) {
        this.hoursPerWeek = hoursPerWeek;
    }

    public double getPotatoPriceAtConversion() {
        return potatoPriceAtConversion;
    }

    public void setPotatoPriceAtConversion(double potatoPriceAtConversion) {
        this.potatoPriceAtConversion = potatoPriceAtConversion;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
