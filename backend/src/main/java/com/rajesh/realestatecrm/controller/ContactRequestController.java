package com.rajesh.realestatecrm.controller;

import com.rajesh.realestatecrm.dto.ContactRequestDto;
import com.rajesh.realestatecrm.dto.ContactRequestResponseDto;
import com.rajesh.realestatecrm.model.ContactRequest;
import com.rajesh.realestatecrm.service.ContactRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact-requests")
@RequiredArgsConstructor
@CrossOrigin
public class ContactRequestController {

    private final ContactRequestService service;

    @PostMapping
    public ContactRequest create(@RequestBody ContactRequestDto dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<ContactRequestResponseDto> getAll(Authentication authentication) {
        return service.getVisibleRequests(authentication.getName());
    }
}
