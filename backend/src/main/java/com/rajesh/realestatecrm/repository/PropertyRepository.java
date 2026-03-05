package com.rajesh.realestatecrm.repository;

import com.rajesh.realestatecrm.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    Page<Property> findByLocationContainingIgnoreCase(String location, Pageable pageable);

}