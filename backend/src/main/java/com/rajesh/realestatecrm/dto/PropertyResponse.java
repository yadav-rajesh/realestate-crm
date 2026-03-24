package com.rajesh.realestatecrm.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PropertyResponse {

    private Long id;
    private String title;
    private String location;
    private double price;
    private String status;
    private String type;
    private String description;
    private Integer bhk;
    private Integer areaSqft;
    private List<String> amenities;
    private long views;
    private long inquiryCount;
    private Long ownerId;
    private String ownerName;
    private String phone;
    private List<PropertyImageDto> images;
}

