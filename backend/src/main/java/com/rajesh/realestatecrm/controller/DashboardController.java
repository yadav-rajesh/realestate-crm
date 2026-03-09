package com.rajesh.realestatecrm.controller;

import com.rajesh.realestatecrm.dto.DashboardStats;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final PropertyRepository repository;

    @GetMapping
    public DashboardStats stats(){
        long totalProperties = repository.count();
        double averagePrice = repository.findAll()
                .stream()
                .mapToDouble(p -> p.getPrice())
                .average()
                .orElse(0);
        long totalLocations = repository.findAll()
                .stream()
                .map(p -> p.getLocation())
                .distinct()
                .count();

        return new DashboardStats(totalProperties, averagePrice, totalLocations);
    }
}
