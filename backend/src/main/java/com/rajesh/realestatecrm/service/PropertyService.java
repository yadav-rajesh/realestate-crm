package com.rajesh.realestatecrm.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import com.rajesh.realestatecrm.model.Property;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository repository;

    public Property save(Property property) {
        return repository.save(property);
    }

    public List<Property> getAll() {
        return repository.findAll();
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Property update(Long id, Property property) {
        Property existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        existing.setTitle(property.getTitle());
        existing.setLocation(property.getLocation());
        existing.setPrice(property.getPrice());
        existing.setType(property.getType());
        existing.setStatus(property.getStatus());

        return repository.save(existing);
    }
}