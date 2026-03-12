package com.rajesh.realestatecrm.service;

import com.rajesh.realestatecrm.dto.ContactRequestDto;
import com.rajesh.realestatecrm.dto.ContactRequestResponseDto;
import com.rajesh.realestatecrm.exception.UnauthorizedException;
import com.rajesh.realestatecrm.model.ContactRequest;
import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.model.User;
import com.rajesh.realestatecrm.repository.ContactRequestRepository;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import com.rajesh.realestatecrm.repository.UserRepository;
import com.rajesh.realestatecrm.util.PhoneUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactRequestService {

    private final ContactRequestRepository repository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    public ContactRequest create(ContactRequestDto dto) {
        if (dto.getPropertyId() == null) {
            throw new IllegalArgumentException("Property is required");
        }
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (dto.getPhone() == null || dto.getPhone().isBlank()) {
            throw new IllegalArgumentException("Phone is required");
        }

        ContactRequest request = new ContactRequest();
        request.setPropertyId(dto.getPropertyId());
        request.setName(dto.getName().trim());
        request.setPhone(PhoneUtil.normalizeIndianMobileRequired(dto.getPhone(), "Phone"));
        request.setMessage(dto.getMessage() == null ? null : dto.getMessage().trim());
        request.setCreatedAt(LocalDateTime.now());

        return repository.save(request);
    }

    public List<ContactRequestResponseDto> getVisibleRequests(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String role = user.getRole() == null ? "" : user.getRole().trim().toUpperCase(Locale.ROOT);

        List<ContactRequest> requests;
        if ("ADMIN".equals(role)) {
            requests = repository.findAllByOrderByCreatedAtDesc();
        } else if ("AGENT".equals(role) || "OWNER".equals(role)) {
            List<Long> propertyIds = propertyRepository.findByOwnerUsername(user.getUsername())
                    .stream()
                    .map(Property::getId)
                    .collect(Collectors.toList());

            if (propertyIds.isEmpty()) {
                return List.of();
            }

            requests = repository.findByPropertyIdInOrderByCreatedAtDesc(propertyIds);
        } else {
            throw new UnauthorizedException("Not allowed to view requests");
        }

        Set<Long> propertyIdSet = requests.stream()
                .map(ContactRequest::getPropertyId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        Map<Long, Property> propertyMap = propertyIdSet.isEmpty()
                ? Collections.emptyMap()
                : propertyRepository.findAllById(propertyIdSet)
                .stream()
                .collect(Collectors.toMap(Property::getId, Function.identity()));

        return requests.stream()
                .map(request -> {
                    Property property = propertyMap.get(request.getPropertyId());
                    return ContactRequestResponseDto.builder()
                            .id(request.getId())
                            .propertyId(request.getPropertyId())
                            .propertyTitle(property == null ? null : property.getTitle())
                            .propertyLocation(property == null ? null : property.getLocation())
                            .requesterName(request.getName())
                            .requesterPhone(request.getPhone())
                            .message(request.getMessage())
                            .createdAt(request.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }
}

