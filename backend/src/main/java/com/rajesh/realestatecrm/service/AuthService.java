package com.rajesh.realestatecrm.service;

import com.rajesh.realestatecrm.exception.UnauthorizedException;
import com.rajesh.realestatecrm.model.User;
import com.rajesh.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;

    public User login(String username,String password){

        User user = repository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        boolean isValid = passwordEncoder.matches(password, user.getPassword());

        if(!isValid){
            throw new UnauthorizedException("Invalid username or password");
        }

        return user;
    }

    public User register(String username, String password, String role) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (repository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole((role == null || role.isBlank()) ? "AGENT" : role.toUpperCase());

        return repository.save(user);
    }
}
