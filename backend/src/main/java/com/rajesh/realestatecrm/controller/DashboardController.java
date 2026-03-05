package com.rajesh.realestatecrm.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.rajesh.realestatecrm.dto.DashboardStats;
import com.rajesh.realestatecrm.service.PropertyService;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin
public class DashboardController {

    private final PropertyService service;

    @GetMapping("/stats")
    public DashboardStats getStats() {
        return service.getDashboardStats();
    }
}