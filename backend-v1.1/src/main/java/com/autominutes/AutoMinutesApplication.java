package com.autominutes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class AutoMinutesApplication {
    public static void main(String[] args) {
        SpringApplication.run(AutoMinutesApplication.class, args);
    }
}
