package com.rajesh.realestatecrm.service;

import com.rajesh.realestatecrm.dto.UserListDto;
import com.rajesh.realestatecrm.dto.UpdateProfileRequest;
import com.rajesh.realestatecrm.dto.UserProfileDto;
import com.rajesh.realestatecrm.exception.UnauthorizedException;
import com.rajesh.realestatecrm.model.User;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import com.rajesh.realestatecrm.repository.UserRepository;
import com.rajesh.realestatecrm.util.PhoneUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserProfileDto getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getFullName(),
                user.getPhone(),
                user.getEmail()
        );
    }

    public UserProfileDto updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String fullName = request.getFullName() == null ? "" : request.getFullName().trim();
        String phone = request.getPhone() == null ? "" : request.getPhone().trim();
        String email = request.getEmail() == null ? "" : request.getEmail().trim();

        if (fullName.isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (phone.isBlank()) {
            throw new IllegalArgumentException("Phone is required");
        }
        if (email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        String normalizedPhone = PhoneUtil.normalizeIndianMobileRequired(phone, "Phone");

        userRepository.findByEmailIgnoreCase(email)
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Email already exists");
                });

        userRepository.findByPhone(normalizedPhone)
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Phone already exists");
                });

        user.setFullName(fullName);
        user.setPhone(normalizedPhone);
        user.setEmail(email);

        if (isAgentOrOwner(user.getRole())) {
            user.setPassword(passwordEncoder.encode(normalizedPhone));
        }

        userRepository.save(user);

        return new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                user.getFullName(),
                user.getPhone(),
                user.getEmail()
        );
    }

    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (isAgentOrOwner(user.getRole())) {
            throw new IllegalArgumentException("Password for agent/owner accounts is the registered mobile number.");
        }

        if (currentPassword == null || currentPassword.isBlank()) {
            throw new IllegalArgumentException("Current password is required");
        }
        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("New password is required");
        }
        if (newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }
        boolean currentPasswordValid;
        try {
            currentPasswordValid = user.getPassword() != null
                    && passwordEncoder.matches(currentPassword, user.getPassword());
        } catch (IllegalArgumentException ex) {
            currentPasswordValid = false;
        }

        if (!currentPasswordValid) {
            throw new UnauthorizedException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<UserListDto> getUsersForAdmin(String requestingUsername, String roleFilter) {
        User requestingUser = userRepository.findByUsername(requestingUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!"ADMIN".equalsIgnoreCase(requestingUser.getRole())) {
            throw new UnauthorizedException("Only admin can access this list");
        }

        String normalizedRole = roleFilter == null ? "" : roleFilter.trim().toUpperCase(Locale.ROOT);

        return userRepository.findAll()
                .stream()
                .filter(user -> normalizedRole.isBlank() || normalizedRole.equalsIgnoreCase(user.getRole()))
                .sorted(Comparator
                        .comparing((User user) -> safe(user.getRole()))
                        .thenComparing(user -> safe(user.getFullName()))
                        .thenComparing(user -> safe(user.getUsername())))
                .map(user -> new UserListDto(
                        user.getId(),
                        user.getUsername(),
                        user.getRole(),
                        user.getFullName(),
                        user.getPhone(),
                        user.getEmail(),
                        propertyRepository.countByOwnerId(user.getId())
                ))
                .collect(Collectors.toList());
    }

    private boolean isAgentOrOwner(String role) {
        if (role == null) {
            return false;
        }
        String normalized = role.trim().toUpperCase(Locale.ROOT);
        return "AGENT".equals(normalized) || "OWNER".equals(normalized);
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
