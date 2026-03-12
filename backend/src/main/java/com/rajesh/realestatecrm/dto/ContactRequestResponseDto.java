package com.rajesh.realestatecrm.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ContactRequestResponseDto {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String propertyLocation;
    private String requesterName;
    private String requesterPhone;
    private String message;
    private LocalDateTime createdAt;
}

