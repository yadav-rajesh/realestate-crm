package com.rajesh.realestatecrm.service;

import com.rajesh.realestatecrm.exception.ResourceNotFoundException;
import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository repository;

    public Property save(Property property){
        return repository.save(property);
    }

    public Page<Property> getAll(Pageable pageable){
        return repository.findAll(pageable);
    }

    public Property getById(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
    }

    public Property update(Long id,Property property){

        Property existing = getById(id);

        existing.setTitle(property.getTitle());
        existing.setLocation(property.getLocation());
        existing.setPrice(property.getPrice());
        existing.setType(property.getType());
        existing.setStatus(property.getStatus());
        existing.setDescription(property.getDescription());

        return repository.save(existing);
    }

    public void delete(Long id){
        Property existing = getById(id);
        repository.delete(existing);
    }
}
