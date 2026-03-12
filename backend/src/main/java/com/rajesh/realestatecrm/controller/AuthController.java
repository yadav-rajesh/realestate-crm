package com.rajesh.realestatecrm.controller;

import com.rajesh.realestatecrm.dto.*;
import com.rajesh.realestatecrm.model.User;
import com.rajesh.realestatecrm.security.JwtUtil;
import com.rajesh.realestatecrm.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService service;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){

        String identifier = request.getIdentifier();
        if (identifier == null || identifier.isBlank()) {
            identifier = request.getUsername();
        }

        User user = service.login(identifier, request.getPassword());

        String token = jwtUtil.generateToken(user.getUsername(), user.getId(), user.getRole());

        return new LoginResponse(token, user.getId(), user.getUsername(), user.getRole());
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest request) {
        User user = service.register(
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                request.getPassword()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("role", user.getRole());
        response.put("message", "User registered successfully");
        return response;
    }
}
