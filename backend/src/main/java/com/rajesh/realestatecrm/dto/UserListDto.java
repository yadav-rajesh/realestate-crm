package com.rajesh.realestatecrm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserListDto {
    private Long id;
    private String username;
    private String role;
    private String fullName;
    private String phone;
    private String email;
    private long propertyCount;
}

