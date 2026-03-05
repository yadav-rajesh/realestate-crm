package com.rajesh.realestatecrm.service;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.exception.ResourceNotFoundException;


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

    public Page<Property> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public void delete(Long id) {
        Property existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        repository.delete(existing);
    }


    public Property update(Long id, Property property) {
        Property existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        existing.setTitle(property.getTitle());
        existing.setLocation(property.getLocation());
        existing.setPrice(property.getPrice());
        existing.setType(property.getType());
        existing.setStatus(property.getStatus());

        return repository.save(existing);
    }
}
