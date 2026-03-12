package com.rajesh.realestatecrm.repository;

import com.rajesh.realestatecrm.model.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {
    List<ContactRequest> findAllByOrderByCreatedAtDesc();

    List<ContactRequest> findByPropertyIdInOrderByCreatedAtDesc(List<Long> propertyIds);
}
