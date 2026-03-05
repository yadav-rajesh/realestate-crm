package com.rajesh.realestatecrm.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.rajesh.realestatecrm.model.Property;
import com.rajesh.realestatecrm.repository.PropertyRepository;
import com.rajesh.realestatecrm.dto.DashboardStats;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    // SAVE
    public Property save(Property property) {
        return propertyRepository.save(property);
    }

    // GET ALL
    public Page<Property> getAll(Pageable pageable) {
        return propertyRepository.findAll(pageable);
    }

    // SEARCH
    public Page<Property> searchByLocation(String location, Pageable pageable) {
        return propertyRepository.findByLocationContainingIgnoreCase(location, pageable);
    }

    // UPDATE
    public Property update(Long id, Property property) {

        Optional<Property> existing = propertyRepository.findById(id);

        if(existing.isPresent()) {
            Property p = existing.get();
            p.setTitle(property.getTitle());
            p.setLocation(property.getLocation());
            p.setPrice(property.getPrice());
            p.setType(property.getType());
            p.setStatus(property.getStatus());

            return propertyRepository.save(p);
        }

        return null;
    }

    // DELETE
    public void delete(Long id) {
        propertyRepository.deleteById(id);
    }

    // DASHBOARD STATS
    public DashboardStats getDashboardStats() {

        long total = propertyRepository.count();
        Double avg = propertyRepository.findAveragePrice();
        Long locations = propertyRepository.countDistinctLocations();

        return new DashboardStats(
                total,
                avg != null ? avg : 0,
                locations
        );
    }
}