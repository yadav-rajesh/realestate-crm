package com.rajesh.realestatecrm.service;

import com.rajesh.realestatecrm.dto.PropertyImageDto;
import com.rajesh.realestatecrm.dto.PropertyRequest;
import com.rajesh.realestatecrm.dto.PropertyResponse;
import com.rajesh.realestatecrm.exception.ResourceNotFoundException;
import com.rajesh.realestatecrm.exception.UnauthorizedException;
import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.model.PropertyImage;
import com.rajesh.realestatecrm.model.User;
import com.rajesh.realestatecrm.repository.ContactRequestRepository;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import com.rajesh.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository repository;
    private final UserRepository userRepository;
    private final ContactRequestRepository contactRequestRepository;

    public PropertyResponse save(PropertyRequest request) {
        User owner = getCurrentUser();

        Property property = new Property();
        applyRequest(property, request);
        property.setOwner(owner);
        property.setViews(0);

        return toResponse(repository.save(property), 0);
    }

    public Page<PropertyResponse> getAll(Pageable pageable){
        return toResponsePage(repository.findAll(pageable));
    }

    public PropertyResponse getById(Long id, boolean incrementView){
        Property property = getEntityById(id);

        if (incrementView) {
            property.setViews(property.getViews() + 1);
            property = repository.save(property);
        }

        return toResponse(property, contactRequestRepository.countByPropertyId(property.getId()));
    }

    public Page<PropertyResponse> searchByLocation(String location, Pageable pageable) {
        return toResponsePage(repository.findByLocationContainingIgnoreCase(location, pageable));
    }

    public PropertyResponse update(Long id, PropertyRequest request){

        Property existing = getEntityById(id);

        applyRequest(existing, request);

        return toResponse(repository.save(existing), contactRequestRepository.countByPropertyId(existing.getId()));
    }

    public PropertyResponse addImage(Long id, String imageName) {
        Property property = getEntityById(id);

        if (property.getImages() == null) {
            property.setImages(new ArrayList<>());
        }

        PropertyImage image = new PropertyImage();
        image.setImageUrl(imageName);
        image.setProperty(property);
        property.getImages().add(image);

        return toResponse(repository.save(property), contactRequestRepository.countByPropertyId(property.getId()));
    }

    public void delete(Long id){
        Property existing = getEntityById(id);
        repository.delete(existing);
    }

    private Property getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Login required");
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }

    private void applyRequest(Property property, PropertyRequest request) {
        property.setTitle(request.getTitle());
        property.setLocation(request.getLocation());
        property.setPrice(request.getPrice());
        property.setStatus(request.getStatus());
        property.setType(request.getType());
        property.setDescription(request.getDescription());
        property.setBhk(request.getBhk());
        property.setAreaSqft(request.getAreaSqft());
        property.setAmenities(normalizeAmenities(request.getAmenities()));
    }

    private List<String> normalizeAmenities(List<String> amenities) {
        if (amenities == null) {
            return List.of();
        }

        return amenities.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .distinct()
                .limit(12)
                .collect(Collectors.toList());
    }

    private Page<PropertyResponse> toResponsePage(Page<Property> page) {
        Map<Long, Long> inquiryCounts = getInquiryCounts(page.getContent());
        List<PropertyResponse> content = page.getContent().stream()
                .map(property -> toResponse(property, inquiryCounts.getOrDefault(property.getId(), 0L)))
                .collect(Collectors.toList());

        return new PageImpl<>(content, page.getPageable(), page.getTotalElements());
    }

    private Map<Long, Long> getInquiryCounts(List<Property> properties) {
        List<Long> propertyIds = properties.stream()
                .map(Property::getId)
                .filter(Objects::nonNull)
                .toList();

        if (propertyIds.isEmpty()) {
            return Map.of();
        }

        Map<Long, Long> counts = new LinkedHashMap<>();
        for (Object[] row : contactRequestRepository.countByPropertyIds(propertyIds)) {
            if (row == null || row.length < 2) {
                continue;
            }

            Long propertyId = row[0] instanceof Number ? ((Number) row[0]).longValue() : null;
            long inquiryCount = row[1] instanceof Number ? ((Number) row[1]).longValue() : 0;

            if (propertyId != null) {
                counts.put(propertyId, inquiryCount);
            }
        }

        return counts;
    }

    private PropertyResponse toResponse(Property property, long inquiryCount) {
        User owner = property.getOwner();
        String ownerName = null;
        String ownerPhone = null;
        Long ownerId = null;

        if (owner != null) {
            ownerId = owner.getId();
            ownerName = StringUtils.hasText(owner.getFullName()) ? owner.getFullName() : owner.getUsername();
            ownerPhone = owner.getPhone();
        }

        List<PropertyImageDto> images = property.getImages() == null
                ? List.of()
                : property.getImages().stream()
                .map(image -> new PropertyImageDto(image.getId(), image.getImageUrl()))
                .collect(Collectors.toList());

        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .location(property.getLocation())
                .price(property.getPrice())
                .status(property.getStatus())
                .type(property.getType())
                .description(property.getDescription())
                .bhk(property.getBhk())
                .areaSqft(property.getAreaSqft())
                .amenities(property.getAmenities() == null ? List.of() : property.getAmenities())
                .views(property.getViews())
                .inquiryCount(inquiryCount)
                .ownerId(ownerId)
                .ownerName(ownerName)
                .phone(ownerPhone)
                .images(images)
                .build();
    }
}
