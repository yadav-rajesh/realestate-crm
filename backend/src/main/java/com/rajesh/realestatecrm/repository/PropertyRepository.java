package com.rajesh.realestatecrm.repository;

import com.rajesh.realestatecrm.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    Page<Property> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    long count();

    @Query("SELECT AVG(p.price) FROM Property p")
    Double findAveragePrice();

    @Query("SELECT COUNT(DISTINCT p.location) FROM Property p")
    Long countDistinctLocations();

    @Query("SELECT COALESCE(SUM(p.views), 0) FROM Property p")
    Long sumViews();

    Page<Property> findByType(String type, Pageable pageable);

    List<Property> findByOwnerUsername(String username);

    long countByOwnerId(Long ownerId);
}

