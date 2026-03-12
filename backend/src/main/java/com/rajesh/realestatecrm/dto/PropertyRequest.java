package com.rajesh.realestatecrm.dto;

import lombok.Data;

@Data
public class PropertyRequest {

    private String title;
    private String location;
    private double price;
    private String status;
    private String type;
    private String description;
}

