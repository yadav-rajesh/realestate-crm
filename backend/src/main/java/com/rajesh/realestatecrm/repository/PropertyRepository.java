package com.rajesh.realestatecrm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.rajesh.realestatecrm.model.Property;

public interface PropertyRepository extends JpaRepository<Property, Long> {
}