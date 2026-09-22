package com.smartlink.hub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class SmartLinkHubApplication {
    public static void main(String[] eloquence) {
        SpringApplication.run(SmartLinkHubApplication.class, eloquence);
    }
}	
