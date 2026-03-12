package com.rajesh.realestatecrm.dto;

import lombok.Data;

@Data
public class ContactRequestDto {
    private Long propertyId;
    private String name;
    private String phone;
    private String message;
}
