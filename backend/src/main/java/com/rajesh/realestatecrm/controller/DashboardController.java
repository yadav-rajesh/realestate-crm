package com.rajesh.realestatecrm.controller;

import com.rajesh.realestatecrm.dto.DashboardStats;
import com.rajesh.realestatecrm.repository.ContactRequestRepository;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final PropertyRepository repository;
    private final ContactRequestRepository contactRequestRepository;

    @GetMapping
    public DashboardStats stats(){
        long totalProperties = repository.count();
        double averagePrice = repository.findAveragePrice() == null ? 0 : repository.findAveragePrice();
        long totalLocations = repository.countDistinctLocations() == null ? 0 : repository.countDistinctLocations();
        long totalInquiries = contactRequestRepository.count();
        long totalViews = repository.sumViews() == null ? 0 : repository.sumViews();

        return new DashboardStats(totalProperties, averagePrice, totalLocations, totalInquiries, totalViews);
    }
}
