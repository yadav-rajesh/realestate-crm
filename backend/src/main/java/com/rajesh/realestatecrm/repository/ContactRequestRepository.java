package com.rajesh.realestatecrm.repository;

import com.rajesh.realestatecrm.model.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {
    List<ContactRequest> findAllByOrderByCreatedAtDesc();

    List<ContactRequest> findByPropertyIdInOrderByCreatedAtDesc(List<Long> propertyIds);

    long countByPropertyId(Long propertyId);

    @Query("SELECT c.propertyId, COUNT(c) FROM ContactRequest c WHERE c.propertyId IN :propertyIds GROUP BY c.propertyId")
    List<Object[]> countByPropertyIds(@Param("propertyIds") List<Long> propertyIds);
}
