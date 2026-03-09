package com.rajesh.realestatecrm.repository;

import com.rajesh.realestatecrm.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    Page<Property> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    long count();

    @Query("SELECT AVG(p.price) FROM Property p")
    Double findAveragePrice();

    @Query("SELECT COUNT(DISTINCT p.location) FROM Property p")
    Long countDistinctLocations();

    Page<Property> findByType(String type, Pageable pageable);
}

