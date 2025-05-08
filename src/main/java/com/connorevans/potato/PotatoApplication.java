package com.connorevans.potato;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.connorevans.potato")
public class PotatoApplication {

    public static void main(String[] args) {
        SpringApplication.run(PotatoApplication.class, args);
    }

}
