package com.rajesh.realestatecrm.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String identifier;
    private String username;
    private String password;
}
