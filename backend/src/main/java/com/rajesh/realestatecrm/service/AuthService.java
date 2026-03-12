package com.rajesh.realestatecrm.service;

import com.rajesh.realestatecrm.exception.UnauthorizedException;
import com.rajesh.realestatecrm.model.User;
import com.rajesh.realestatecrm.repository.UserRepository;
import com.rajesh.realestatecrm.util.PhoneUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;

    public User login(String identifier, String password){
        if (identifier == null || identifier.isBlank()) {
            throw new UnauthorizedException("Invalid email/mobile or password");
        }
        if (password == null || password.isBlank()) {
            throw new UnauthorizedException("Invalid email/mobile or password");
        }

        String key = identifier.trim();
        String normalizedIdentifierPhone = PhoneUtil.normalizeIndianMobileOrNull(key);

        User user = repository.findByEmailIgnoreCase(key)
                .or(() -> normalizedIdentifierPhone == null
                        ? Optional.empty()
                        : repository.findByPhone(normalizedIdentifierPhone))
                .or(() -> repository.findByUsername(key))
                .orElseThrow(() -> new UnauthorizedException("Invalid email/mobile or password"));

        if (isAgentOrOwner(user.getRole())) {
            String normalizedPasswordPhone = PhoneUtil.normalizeIndianMobileOrNull(password);
            if (normalizedPasswordPhone != null && normalizedPasswordPhone.equals(user.getPhone())) {
                if (!isEncodedPhonePassword(user, normalizedPasswordPhone)) {
                    user.setPassword(passwordEncoder.encode(normalizedPasswordPhone));
                    repository.save(user);
                }
                return user;
            }
        }

        boolean isValid = user.getPassword() != null && passwordEncoder.matches(password, user.getPassword());
        if (!isValid) {
            throw new UnauthorizedException("Invalid email/mobile or password");
        }

        return user;
    }

    public User register(String fullName, String email, String phone, String password) {
        if (fullName == null || fullName.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (phone == null || phone.isBlank()) {
            throw new IllegalArgumentException("Phone is required");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        String normalizedEmail = email.trim().toLowerCase();
        String normalizedPhone = PhoneUtil.normalizeIndianMobileRequired(phone, "Phone");

        if (repository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (repository.findByPhone(normalizedPhone).isPresent()) {
            throw new IllegalArgumentException("Phone already exists");
        }

        User user = new User();
        user.setUsername(generateUsernameFromEmail(normalizedEmail));
        user.setFullName(fullName.trim());
        user.setEmail(normalizedEmail);
        user.setPhone(normalizedPhone);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");

        return repository.save(user);
    }

    private boolean isAgentOrOwner(String role) {
        if (role == null) {
            return false;
        }
        String normalized = role.trim().toUpperCase();
        return "AGENT".equals(normalized) || "OWNER".equals(normalized);
    }

    private boolean isEncodedPhonePassword(User user, String normalizedPhone) {
        if (user.getPassword() == null) {
            return false;
        }
        try {
            return passwordEncoder.matches(normalizedPhone, user.getPassword());
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private String generateUsernameFromEmail(String email) {
        String base = email.split("@")[0]
                .toLowerCase()
                .replaceAll("[^a-z0-9._]", "");

        if (base.isBlank()) {
            base = "user";
        }

        String candidate = base;
        int suffix = 1;
        while (repository.findByUsername(candidate).isPresent()) {
            candidate = base + suffix;
            suffix++;
        }

        return candidate;
    }
}
