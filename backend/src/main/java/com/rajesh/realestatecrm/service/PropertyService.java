package com.rajesh.realestatecrm.service;

import com.rajesh.realestatecrm.dto.PropertyImageDto;
import com.rajesh.realestatecrm.dto.PropertyRequest;
import com.rajesh.realestatecrm.dto.PropertyResponse;
import com.rajesh.realestatecrm.exception.ResourceNotFoundException;
import com.rajesh.realestatecrm.exception.UnauthorizedException;
import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.model.PropertyImage;
import com.rajesh.realestatecrm.model.User;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import com.rajesh.realestatecrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository repository;
    private final UserRepository userRepository;

    public PropertyResponse save(PropertyRequest request) {
        User owner = getCurrentUser();

        Property property = new Property();
        property.setTitle(request.getTitle());
        property.setLocation(request.getLocation());
        property.setPrice(request.getPrice());
        property.setStatus(request.getStatus());
        property.setType(request.getType());
        property.setDescription(request.getDescription());
        property.setOwner(owner);

        return toResponse(repository.save(property));
    }

    public Page<PropertyResponse> getAll(Pageable pageable){
        return repository.findAll(pageable).map(this::toResponse);
    }

    public PropertyResponse getById(Long id){
        return toResponse(getEntityById(id));
    }

    public Page<PropertyResponse> searchByLocation(String location, Pageable pageable) {
        return repository.findByLocationContainingIgnoreCase(location, pageable).map(this::toResponse);
    }

    public PropertyResponse update(Long id, PropertyRequest request){

        Property existing = getEntityById(id);

        existing.setTitle(request.getTitle());
        existing.setLocation(request.getLocation());
        existing.setPrice(request.getPrice());
        existing.setType(request.getType());
        existing.setStatus(request.getStatus());
        existing.setDescription(request.getDescription());

        return toResponse(repository.save(existing));
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

        return toResponse(repository.save(property));
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

    private PropertyResponse toResponse(Property property) {
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
                .ownerId(ownerId)
                .ownerName(ownerName)
                .phone(ownerPhone)
                .images(images)
                .build();
    }
}
