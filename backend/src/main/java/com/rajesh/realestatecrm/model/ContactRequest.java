package com.rajesh.realestatecrm.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long propertyId;
    private String name;
    private String phone;

    @Column(length = 1000)
    private String message;

    private LocalDateTime createdAt;
}
