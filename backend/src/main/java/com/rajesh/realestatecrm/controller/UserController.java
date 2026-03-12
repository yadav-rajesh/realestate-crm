package com.rajesh.realestatecrm.controller;

import com.rajesh.realestatecrm.dto.ChangePasswordRequest;
import com.rajesh.realestatecrm.dto.UpdateProfileRequest;
import com.rajesh.realestatecrm.dto.UserListDto;
import com.rajesh.realestatecrm.dto.UserProfileDto;
import com.rajesh.realestatecrm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserProfileDto profile(Authentication authentication) {
        return userService.getProfile(authentication.getName());
    }

    @GetMapping
    public List<UserListDto> users(
            Authentication authentication,
            @RequestParam(required = false) String role
    ) {
        return userService.getUsersForAdmin(authentication.getName(), role);
    }

    @PutMapping("/me")
    public UserProfileDto updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        return userService.updateProfile(authentication.getName(), request);
    }

    @PostMapping("/change-password")
    public Map<String, String> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        userService.changePassword(
                authentication.getName(),
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        return Map.of("message", "Password updated successfully");
    }
}
