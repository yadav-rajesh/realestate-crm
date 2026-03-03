package com.rajesh.realestatecrm.controller;

import com.rajesh.realestatecrm.model.User;
import com.rajesh.realestatecrm.repository.UserRepository;
import com.rajesh.realestatecrm.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Register
    @PostMapping("/register")
    public String register(@RequestBody User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return "User Registered Successfully";
    }

    // Login
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        if (user.getUsername() == null || user.getPassword() == null) {
            return "Username or Password missing";
        }

        Optional<User> existingUser =
                userRepository.findByUsername(user.getUsername());

        if (existingUser.isEmpty()) {
            return "User not found";
        }

        if (!passwordEncoder.matches(
                user.getPassword(),
                existingUser.get().getPassword())) {

            return "Invalid password";
        }

        return jwtUtil.generateToken(existingUser.get().getUsername());
    }
}