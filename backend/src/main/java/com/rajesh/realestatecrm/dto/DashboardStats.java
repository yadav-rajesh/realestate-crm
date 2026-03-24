package com.rajesh.realestatecrm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {

    private long totalProperties;

    private double averagePrice;

    private long totalLocations;

    private long totalInquiries;

    private long totalViews;

}
