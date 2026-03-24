package com.rajesh.realestatecrm.dto;

import lombok.Data;

import java.util.List;

@Data
public class PropertyRequest {

    private String title;
    private String location;
    private double price;
    private String status;
    private String type;
    private String description;
    private Integer bhk;
    private Integer areaSqft;
    private List<String> amenities;
}

